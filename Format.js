function Format(formatString, definitions) {
  if (typeof formatString !== 'string'){
    throw new Error('Incorrect first argument to Format constructor')
  }
  if (typeof definitions !== 'object'){
    throw new Error('Incorrect second argument to Format constructor')
  }

  this.formatString = formatString
  this.definitions = definitions
}