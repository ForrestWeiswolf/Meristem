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

// to avoid the bug where typeof null === 'object'
function typeOf(val) {
  return val === null ? 'null' : typeof val
}

// returns the val if it's the right type, otherwise throws an error
// message arg should be a function that takes the (incorrect) type
// and returns a message for the error.
function mustBeType(val, type, message) {
  if (typeOf(val) === type) {
    return val
  } else {
    throw new Error(message(typeOf(val)))
  }
}

// as mustBeType, but checks that val's constructor matches the
// constructor arg.
function mustBeClass(val, constructor, message) {
  if (typeOf(val) !== 'object') {
    throw new Error(message(typeOf(val)))
  } else if (val.constructor !== constructor) {
    return new Error(message(val.constructor))
  } else {
    return val
  }
}

const mustBeNum = (val, message) => mustBeType(val, 'number', message)
const mustBeArr = (val, message) => mustBeClass(val, Array, message)

module.exports = { checkParens, mustBeArr, mustBeNum }
