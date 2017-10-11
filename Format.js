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
      return token
    } else if (typeof token === 'object' && token.expand) {
      console.log(definitions)
      return token.expand(definitions)
    }
  }
}