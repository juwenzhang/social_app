class ProjectClientCookies {
  private cookies: string; 
  private options: { [key: string]: any };
  private feedback: (message: string) => void;
  private dev_mode: "development" | "production";

  constructor(
    options = {
      path: "/",
      domain: "",
      expires: 0,
      secure: false,
      httpOnly: false,
      sameSite: "Lax",
    },
    feedback = (message: string) => { console.log(message) },
    dev_mode = "production"  // "development" or "production"
  ) {
    if (!this.getCurrentEnv()) {
      this.cookies = document.cookie;
    } else {
      this.cookies = "";
    }
    this.options = options;
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

  // split cookies into an array
  #splitCookies() {
    return this.cookies.split(";").map(cookie => cookie.trim());
  }

  // concat cookies with options and set to document.cookie
  #setConfigToString(key: string | number, value: string | number) {
    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)};`;
    if (this.cookies === "") {
      Object.entries(this.options).forEach(([_key, _value]) => {
        if (_key === "expires") {
          const date = new Date();
          _value = new Date(date.getTime() + _value * 24 * 60 * 60 * 1000).toUTCString();
        }
        if (_key === "sameSite") {
          _value = _value.toUpperCase();
        }
        if (_key === "password") {
          _value = btoa(_value);  // encode password to base64
        }
        cookieString += `${_key}=${_value};`;
      });
    } else {
      const existingCookies = this.#splitCookies().filter(
        cookie => !cookie.startsWith(`${key}=`)).join("; ");
      cookieString += existingCookies;
    }
    return cookieString;
  }

  // set item to cookies
  setCookie(
    key: string | number, 
    value: string | number, 
    options: {
      path?: string;
      domain?: string;
      expires?: number;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "Lax" | "Strict" | "None";
      password?: string;  
    } = this.options) {
    if (this.getCurrentEnv()) {
      this.#innerfeedback("Cookies are not supported in this environment")
      return;
    }
    const cookieString = this.#setConfigToString(key, value);
    document.cookie = cookieString;
    this.#innerfeedback("Cookie set successfully")
  }

  // get item from cookies
  getCookieValue(key: string) {
    if (this.getCurrentEnv()) {
      this.#innerfeedback("Cookies are not supported in this environment")
      return false;
    }
    const cookies = this.#splitCookies();
    const cookie = cookies.find(cookie => cookie.startsWith(`${key}=`));
    if (cookie) {
      this.#innerfeedback("Cookie get successfully")
      let _value = cookie.split("=")[1];
      if (key === "password") {
        _value = atob(_value);  // decode password from base64
      }
      return decodeURIComponent(_value);
    } else {
      this.#innerfeedback("Cookie not found")
      return false;
    }
  }

  // remove item from cookies
  removeCookie(key: string) {
    if (this.getCurrentEnv()) {
      this.#innerfeedback("Cookies are not supported in this environment")
      return false;
    }
    const cookies = this.#splitCookies().filter(cookie => !cookie.startsWith(`${key}=`));
    document.cookie = cookies.join("; ");
    this.#innerfeedback("Cookie remove successfully")
    return true;
  }

  // clear cookies
  clearCookies() {
    if (this.getCurrentEnv()) {
      this.#innerfeedback("Cookies are not supported in this environment")
      return false;
    }
    document.cookie = "";
    this.#innerfeedback("Cookies clear successfully")
    return true;
  }
}

const cookies = new ProjectClientCookies();
export default cookies;