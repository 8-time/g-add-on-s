var CREDENTIALS_KEY = 'salesforceCredentials';

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        // eslint-disable-next-line prefer-rest-params
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}

var cachedPropertiesPrototype = {
  get: function (key, defaultValue) {
    var value = this.cache.get(key);
    if (!value) {
      value = this.properties.getProperty(key);
      if (value) {
        this.cache.put(key, value);
      }
    }
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  },
  put: function (key, value) {
    var serializedValue = JSON.stringify(value);
    this.cache.remove(key);
    this.properties.setProperty(key, serializedValue);
  },
  clear: function (key) {
    this.cache.remove(key);
    this.properties.deleteProperty(key);
  },
};

function cachedPropertiesForScript_() {
  return Object.assign(Object.create(cachedPropertiesPrototype), {
    properties: PropertiesService.getScriptProperties(),
    cache: CacheService.getScriptCache(),
  });
}

function getSalesforceCredentials() {
  return cachedPropertiesForScript_().get(CREDENTIALS_KEY, null);
}
