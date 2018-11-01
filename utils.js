// Used by Format constructor to checks if parentheses, brackets, etc. are valid.
// To check parentheses, for example,
// pass {start: '(', end: ')'} as the symbols argument.
function checkGroupingSymbols(str, symbols) {
  let open = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === symbols.start) {
      open++
    } else if (str.charAt(i) === symbols.end) {
      open--
    }

    if (open < 0) {
      throw new Error(`Format string includes "${symbols.end}" without matching "${symbols.start}"`)
    }
  }

  if (open !== 0) {
    throw new Error(`Format string includes "${symbols.start}" without matching "${symbols.end}"`)
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

module.exports = { checkGroupingSymbols, mustBeType, mustBeClass }
