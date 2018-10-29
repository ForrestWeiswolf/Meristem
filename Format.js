const { checkParens, mustBeType } = require('./utils')
const mustBeStr = (val, message) => mustBeType(val, 'string', message)

function validateFormatString(formatString) {
  mustBeStr(
    formatString,
    type =>
      type === 'undefined'
        ? 'No argument passed to Format constructor'
        : `Format constructor was passed ${type} instead of string`
  )

  if (!checkParens(formatString)) {
    throw new Error('Mismatched parentheses in Format string')
  } else if (formatString.includes('()')) {
    throw new Error('Empty parentheses in Format string')
  }
}

/**
 * The format according to which text will be generated.
 * @constructor
 * @param {string} formatString - A string which may contain 'nonterminals' - text which will be replaced with a specified or randomly chosen substring.
 * By default, any sections of the text enclosed in parentheses will be replaced;
 * this can be changed in the setings argument.
 * @param {object} definitions - An object assosciating nonterminals as keys with
 * the values they will be replaced with. If the value is a [WeightedRandom]{@link WeightedRandom},
 * its .choose method will be called and the result inserted instead; if it is a Format
 * its .expand method will be called and the result inserted.
 * @param {object} [settings] - an object containing the settings used by this Format:
 * settings.separators.start and settings.separators.end may contain strings that will signal
 * the start and end of a nonterminal.
 *
 * Default value: `{ separators: { start: '(', end: ')' } }`
 */
function Format(
  formatString,
  definitions,
  settings = { separators: { start: '(', end: ')' } }
) {
  validateFormatString(formatString)

  this.formatString = formatString
  this.definitions = definitions
  this._separators = {
    start: settings.separators.start,
    end: settings.separators.end,
  }
}

/** Generate text according to the format. Uses the definitions passed to the constructor if there were any,
 * or those passed as an argument if none were passed to the constructor.
 *
 * Each section of the formatString that is enclosed in parentheses is replaced according to the following rules:
 * 1. If it's not a key in the definitions passed to the constructor or this method, an error is thrown.
 * 2. If its definition is a string, it's replaced with that string.
 * 3. If its definition is also a Format, it's replaced with the returned value of a call to its
 * .expand method on the definitions object currently in use
 * (note if it has its own definitions they will take precedence).
 * 4. If it's a [WeightedRandom]{@link WeightedRandom},  it's replaced with the returned value of a call to its
 * .choose method.
 * @param {object} definitionsArg - Optional; will be used if no definitions were passed to the constructor
 */
Format.prototype.expand = function(definitionsArg) {
  let result = ''
  let definitions = this.definitions || definitionsArg
  if (!definitions) {
    throw new Error(
      'This.definitions does not exist and no definitions argument passed'
    )
  }

  this.formatString
    .split(this._separators.end) // splits into sections ending with a nonterminal
    .forEach(section => {
      const splitSection = section.split(this._separators.start) // splits into arrays where first member is text and second is nonterminal
      const text = splitSection[0]
      const nonterminal = splitSection[1]
      if (text) result += text
      result += this._handleNonterminal(nonterminal, definitions)
    })
  return result
}

Format.prototype._handleNonterminal = function(nonterminalStr, definitions) {
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
