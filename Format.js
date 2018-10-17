const { checkParens } = require('./utils')

function Format(formatString, definitions) {
  if (typeof formatString === 'undefined') {
    throw new Error('No argument passed to Format constructor')
  }
  else if (formatString === null) {
    throw new Error('Format constructor was passed null instead of string')
  } else if (typeof formatString !== 'string') {
    throw new Error(`Format constructor was passed ${typeof formatString} instead of string`)
  } else if (!checkParens(formatString)) {
    throw new Error('Mismatched parentheses in Format string')
  } else if (formatString.includes('()')) {
    throw new Error('Empty parentheses in Format string')
  }

  this.formatString = formatString
  this.definitions = definitions
  this.separators = { start: '(', end: ')' }
}

Format.prototype.expand = function (definitionsArg) {
  let result = ''
  let definitions = this.definitions || definitionsArg
  if (!definitions) {
    throw new Error('This.definitions does not exist and no definitions argument passed')
  }

  this.formatString.split(this.separators.end) //splits into sections ending with a nonterminal
    .forEach((section) => {
      const splitSection = section.split(this.separators.start) //splits into arrays where first member is text and second is nonterminal 
      const text = splitSection[0]
      const nonterminal = splitSection[1]
      if (text) result += text
      result += this.handleNonterminal(nonterminal, definitions)

    })
  return result
}

Format.prototype.handleNonterminal = function (nonterminalStr, definitions) {
  if (!nonterminalStr) {
    return ''
  } else if (!definitions[nonterminalStr]) {
    throw new Error(`"${nonterminalStr}" not found in definitions`)
  } else {

    let nonterminal = definitions[nonterminalStr]

    if (typeof nonterminal === 'string') {
      return new Format(nonterminal, definitions).expand()
    } else if (typeof nonterminal === 'object' && nonterminal.expand) {
      return nonterminal.expand(definitions)
    } else if (typeof nonterminal === 'object' && nonterminal.choose) {
      return new Format(nonterminal.choose(), definitions).expand()
    }
  }
}

module.exports = Format
