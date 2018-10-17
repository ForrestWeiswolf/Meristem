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

module.exports = { checkParens }
