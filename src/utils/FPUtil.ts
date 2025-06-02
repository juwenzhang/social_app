function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}

function isArray(arr: any): boolean {
  return Array.isArray(arr);
}

function isFunction(func: any): boolean {
  return typeof func === 'function';
}

function isString(str: any): boolean {
  return typeof str === 'string';
}

function isNumber(num: any): boolean {
  return typeof num === 'number' && !isNaN(num);
}

function isBoolean(bool: any): boolean {
  return typeof bool === 'boolean';
}

function isUndefined(undef: any): boolean {
  return typeof undef === 'undefined';
}

function isNull(nul: any): boolean {
  return nul === null;
}

function isSymbol(sym: any): boolean {
  return typeof sym === 'symbol';
}

function isBigInt(bigInt: any): boolean {
  return typeof bigInt === 'bigint';
}

function isDate(date: any): boolean {
  return date instanceof Date;
}

function isRegExp(regex: any): boolean {
  return regex instanceof RegExp;
}

function isError(err: any): boolean {
  return err instanceof Error;
}

function isMap(map: any): boolean {
  return map instanceof Map;
}

function isSet(set: any): boolean {
  return set instanceof Set;
}

function isWeakMap(weakMap: any): boolean {
  return weakMap instanceof WeakMap;
}

function isWeakSet(weakSet: any): boolean {
  return weakSet instanceof WeakSet;
}

function isPromise(promise: any): boolean {
  return promise instanceof Promise;
}

function composeFunctions(...funcs: Function[]): Function {
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}

function pipeFunctions(...funcs: Function[]): Function {
  return funcs.reduce((a, b) => (...args: any[]) => b(a(...args)));
}

function partial(func: Function, ...args: any[]): Function {
  return func.bind(null, ...args);
}

function curry(func: Function): Function {
  return function curried(this: unknown, ...args: any[]) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (this: unknown, ...args2: any[]) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function memoize(func: Function): Function {
  const cache = new Map();
  return function (this: unknown,...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    }
  }
}

function debounce(func: Function, delay: number): Function {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown,...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function throttle(func: Function, delay: number): Function {
  let lastCall = 0;
  return function (this: unknown,...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    }
  };
}

function once(func: Function): Function {
  let called = false;
  return function (this: unknown,...args: any[]) {
    if (!called) {
      called = true;
      return func.apply(this, args);
    }
  };
}

function asyncify(func: Function): Function {
  return async function (this: unknown,...args: any[]) {
    return await func.apply(this, args);
  };
}

function delay(func: Function, delay: number): Function {
  return function (this: unknown,...args: any[]) {
    setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function retry(func: Function, retries: number): Function {
  return function (this: unknown,...args: any[]) {
    try {
      return func.apply(this, args);
    } catch (error) {
      if (retries > 0) {
        return retry(func, retries - 1).apply(this, args);
      } else {
        throw error;
      }
    }
  }
}

function timeout(func: Function, delay: number): Function {
  return function (this: unknown,...args: any[]) {
    const timeoutId = setTimeout(() => {
      throw new Error('Function timed out');
    }, delay);
  }
}

function safe(func: Function): Function {
  return function (this: unknown,...args: any[]) {
    try {
      return func.apply(this, args);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };
}

function log(func: Function): Function {
  return function (this: unknown,...args: any[]) {
    console.log(`Calling ${func.name} with arguments ${args}`);
    const result = func.apply(this, args);
    console.log(`Result of ${func.name}: ${result}`);
  }
}

function trace(func: Function): Function {
  return function (this: unknown,...args: any[]) {
    console.trace(`Calling ${func.name} with arguments ${args}`);
    const result = func.apply(this, args);
    console.trace(`Result of ${func.name}: ${result}`);
  }
}

export {
  isObject,
  isArray,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isSymbol,
  isBigInt,
  isDate,
  isRegExp,
  isError,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  isPromise,
  composeFunctions,
  pipeFunctions,
  partial,
  curry,
  memoize,
  debounce,
  throttle,
  once,
  asyncify,
  delay,
  retry,
  timeout,
  safe,
  log,
  trace,
}