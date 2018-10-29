function checkParens(str) {
  let parensOpen = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '(') {
      parensOpen++
    } else if (str.charAt(i) === ')') {
      parensOpen--
    }

    if (parensOpen < 0) {
      return false
    }
  }

  if (parensOpen !== 0) {
    return false
  } else {
    return true
  }
}

function typeOf(val) {
  return val === null ? 'null' : typeof val
}

function mustBeType(val, type, message) {
  if (typeOf(val) === type) {
    return val
  } else {
    throw new Error(message(typeOf(val)))
  }
}

function mustBeClass(val, constructor, message) {
  if (typeOf(val) !== 'object') {
    throw new Error(message(typeOf(val)))
  } else if (val.constructor !== constructor) {
    throw new Error(message(typeOf(val)))
  } else {
    return val
  }
}

const mustBeNum = (val, message) => mustBeType(val, 'number', message)
const mustBeArr = (val, message) => mustBeClass(val, Array, message)

module.exports = { checkParens, mustBeArr, mustBeNum }
