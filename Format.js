function Format(formatString, definitions) {
  if (typeof formatString !== 'string'){
    throw new Error('Incorrect first argument to Format constructor')
  }
  if (typeof definitions !== 'object'){
    throw new Error('Incorrect second argument to Format constructor')
  }

  this.formatString = formatString
  this.definitions = definitions
  this.separators = {start: '(', end: ')'}
}

Format.prototype.expand = function(){
  let result = '';
  this.formatString.split(this.separators.end) //splits into sections ending with a token
  .forEach( (section) => {
    const splitSection = section.split(this.separators.start) //splits into arrays where first member is text and second is token    
    if (splitSection[0]) result += splitSection[0];
    if (splitSection[1]) result += this.definitions[splitSection[1]]  
  })
  return result;
}