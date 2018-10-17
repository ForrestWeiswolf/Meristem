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

function mustBeNum(val, message) {
  if (typeof val === 'number') {
    return val
  } else if (val === null) {
    throw new Error(message('null'))
  } else {
    throw new Error(message(typeof val))
  }
}

function mustBeArr(val, message) {
  if (val === null) {
    throw new Error(message('null'))
  } else if (val.constructor === Array) {
    return val
  } else {
    throw new Error(message(typeof val))
  }
}

module.exports = { checkParens, mustBeArr, mustBeNum }
