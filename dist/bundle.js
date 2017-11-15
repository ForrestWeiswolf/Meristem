/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  Format: __webpack_require__(1),
  WeightedRandom: __webpack_require__(2),  
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function Format(formatString, definitions) {
  if (typeof formatString !== 'string') {
    throw new Error('Incorrect first argument to Format constructor')
  }

  this.formatString = formatString
  this.definitions = definitions
  this.separators = { start: '(', end: ')' }
}

Format.prototype.expand = function (definitionsArg) {
  let result = '';
  let definitions = this.definitions || definitionsArg
  if (!definitions) {
    console.log(this.definitions, definitionsArg)
    throw new Error('This.definitions does not exist and no definitions argument passed')
  }

  this.formatString.split(this.separators.end) //splits into sections ending with a token
    .forEach((section) => {
      const splitSection = section.split(this.separators.start) //splits into arrays where first member is text and second is token 
      const text = splitSection[0]
      const token = splitSection[1]
      if (text) result += text
      result += this.handleToken(token, definitions)

    })
  return result;
}

Format.prototype.handleToken = function (tokenStr, definitions) {
  if (!tokenStr) {
    return ''
  } else if (!definitions[tokenStr]) {
    throw new Error(`"${tokenStr}" not found in definitions`)
  } else {

    let token = definitions[tokenStr]

    if (typeof token === 'string') {
      return new Format(token, definitions).expand()
    } else if (typeof token === 'object' && token.expand) {
      return token.expand(definitions)
    } else if (typeof token === 'object' && token.choose) {
      //let choice = token.choose()
      //return typeof choice === 'string' ? choice : 
      return new Format(token.choose(), definitions).expand()
    }

  }
}

module.exports = Format

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function WeightedRandom(choices = {}) {
  this.choices = choices
}

WeightedRandom.prototype.getTotalWeight = function() {
  const keys = Object.keys(this.choices)

  return keys.reduce((sum, key) => {
    return this.choices[key] + sum
  }, 0)
};

WeightedRandom.prototype.choose = function() {
  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  if (this.getTotalWeight() === 0){
    return null
  }

  for (var key in this.choices){
    count += this.choices[key]
    if(count > rand){
      return key
    }
  }
};

module.exports = WeightedRandom


/***/ })
/******/ ]);