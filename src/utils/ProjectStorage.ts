'use client'
class ProjectStorage {
  private storage: Storage | object;
  private feedback: (message: string) => any;
  private dev_mode: "development" | "production"

  // init storage type
  constructor(
    storageType = "local",
    feedback = (message: string) => { console.log(message) },
    dev_mode = "production"  
  ) {
    if (this.getCurrentEnv()) {
      this.storage = {};
    } else {
      this.storage = storageType === "local" ? localStorage : sessionStorage;
    }
    this.feedback = feedback;
    this.dev_mode = dev_mode as "development" | "production"; 
  }

  // get current work mode
  #getCurrentWorkModeIsDev() {
    return this.dev_mode === "development";
  }

  // is execute feedback
  #innerfeedback(message: string) {
    this.#getCurrentWorkModeIsDev() 
      && this.feedback(message)
  }

  // get current environment
  getCurrentEnv() {
    return typeof window === "undefined";
  }

  // get storage is object or not
  #getStorageIsObject() {
    return this.storage.hasOwnProperty("setItem");
  }

  // set item to storage
  setItem(key: string, value: any) {
    if (typeof value === 'undefined') {
      this.#innerfeedback(`Value with key "${key.toString()}" is undefined`)
      return;
    }
    if (this.#getStorageIsObject()) {
      (this.storage as Storage).setItem(key, JSON.stringify(value));
    } else {
      (this.storage as any)[key] = JSON.stringify(value);
    }
    this.#innerfeedback("Item set successfully")
  }

  // get item from storage
  getItem(key: string) {
    let item;
    if (this.#getStorageIsObject()) {
      item = (this.storage as Storage).getItem(key);
    } else {
      item = (this.storage as any)[key];
    }
    if (!item) {
      this.#innerfeedback(`Item with key "${key}" not found`)
      return;
    }
    this.#innerfeedback("Item found")
    return JSON.parse(item);
  }

  // remove item from storage
  removeItem(key: string) {
    if (this.#getStorageIsObject()) {
      if (!(this.storage as Storage).getItem(key)) {
        this.#innerfeedback(`Item with key "${key}" not found`)
      }
      (this.storage as Storage).removeItem(key);
    } else {
      if (!(this.storage as any)[key]) {
        this.#innerfeedback(`Item with key "${key}" not found`)
        return;
      }
      delete (this.storage as any)[key];
    }
    this.#innerfeedback("Item removed successfully")
  }

  // clear storage
  clear() {
    if (this.#getStorageIsObject()) {
      (this.storage as Storage).clear();
    } else {
      this.storage = {};
    }
    this.#innerfeedback("Storage cleared successfully")
  }

  // get storage length
  get length() {
    let length;
    if (this.#getStorageIsObject()) {
      length = (this.storage as Storage).length;
    } else {
      length = Object.keys(this.storage).length;
    }
    if (length === 0) {
      this.#innerfeedback("Storage is empty")
    } else {
      this.#innerfeedback(`Storage length: ${length}`)
    }
    return length;
  }

  // get storage key
  key(index: number) {
    let key;
    if (this.#getStorageIsObject()) {
      key = (this.storage as Storage).key(index);
    } else {
      key = Object.keys(this.storage)[index];
    }
    if (!key) {
      this.#innerfeedback(`Key with index "${index}" not found`)
    }
    this.#innerfeedback("Key found")
    return key;
  }

  // get storage item by key or index
  get(keyOrIndex: string | number) {
    if (typeof keyOrIndex === 'number') {
      const key = (this.storage as Storage).key(keyOrIndex);
      return (this.storage as Storage).getItem(key as string);
    } else if (typeof keyOrIndex === 'string') {
      return (this.storage as Storage).getItem(keyOrIndex);
    } else {
      this.#innerfeedback(`Key or index "${keyOrIndex}" is not valid`)
      return;
    }
  }
}

const localCache = new ProjectStorage("local");
const sessionCache = new ProjectStorage("session");
export { localCache, sessionCache };