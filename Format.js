const { checkGroupingSymbols, mustBeType } = require('./utils')
const mustBeStr = (val, message) => mustBeType(val, 'string', message)

function validateFormatString(formatString, separators) {
  mustBeStr(
    formatString,
    type =>
      type === 'undefined'
        ? 'No argument passed to Format constructor'
        : `Format constructor was passed ${type} instead of string`
  )

  checkGroupingSymbols(formatString, separators)

  if (formatString.includes(separators.start + separators.end)) {
    throw new Error('Empty nonterminal in Format string')
  }
}

const defaultSettings = { separators: { start: '(', end: ')' }, inlineOptionals: false }
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
  settings = {}
) {
  this._settings = { ...defaultSettings, ...settings }

  validateFormatString(formatString, this._settings.separators)

  this.formatString = formatString
  this.definitions = definitions
  this._separators = {
    start: mustBeStr(
      this._settings.separators.start,
      type => `Separators must be strings (was ${type})`
    ),
    end: mustBeStr(
      this._settings.separators.end,
      type => `Separators must be strings (was ${type})`
    ),
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
Format.prototype.expand = function (definitionsArg) {
  let definitions = this.definitions || definitionsArg
  if (!definitions) {
    throw new Error(
      'This.definitions does not exist and no definitions argument passed'
    )
  }

  let result = ''
  this._splitFormatString(this.formatString)
    .forEach(section => {
      if (section.type === 'nonterminal') {
        result += this._handleNonterminal(section.val, definitions)
      } else {
        result += section.val
      }
    })
  return result
}

Format.prototype._handleNonterminal = function (nonterminalStr, definitions) {
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

Format.prototype._splitFormatString = function (str) {
  const inlineOptionals = this._settings.inlineOptionals

  let sections = []
  let section = { type: 'text', val: '' }

  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i)

    if (char === this._separators.start) {
      sections.push(section)
      section = { type: 'nonterminal', val: '' }
    } else if (inlineOptionals && char === inlineOptionals.start) {
      sections.push(section)
      section = { type: 'optional', val: '' }
    } else if (char === this._separators.end || (inlineOptionals && char === inlineOptionals.end)) {
      sections.push(section)
      section = { type: 'text', val: '' }
    } else {
      section.val += char
    }
  }

  sections.push(section)
  return sections
}

module.exports = Format
