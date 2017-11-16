Meristem
======

A Javascript library for procedural text generation using a context-free grammar.
Several examples of usage can be found [here](https://github.com/ForrestWeiswolf/Meristem-examples)
This README is a work in progress, as indeed is Meristem itself. You can contact me if you have any questions. 

(I apologize for any unconventional terminology - what I'm trying to do here is close enough to the normal uses of context-free grammars that I feel I ought to follow convention, but not so similar that I'm easily able to do so without potentially misleading)

How To Use
------
First, `npm install meristem`, and `require` it in your code:
```javascript
Format = require('meristem').Format
```
Meristem privides two constructors: `Format` and `WeightedRandom`.

###Format:
When creating a Format, you will generally pass the constructor a string, which we'll call the format string, and an object, which we'll call the definitions, or definitions object. 

When you call a Format's `.expand` method, it will return the format string, but with any parenthetical 'nonterminals' replaced with string values found when they are treated as keys in the definitions object, like so:
```javascript
let f = new Format('Fill in the (b).', {b: 'blank'})
console.log(f.expand()) //prints 'Fill in the blank.'
```

(This is quite similar to ES6 template literals, or Python's string formatting, hence the name.)

If you pass an object to `Format.expand`, it will be used instead of the Format's own definitions object. This also you to use a format with no definitions specified:
```javascript
f = new Format('Fill in the (b).')
console.log(f.expand({b: 'blank'})) //prints 'Fill in the blank.'

const planet = new Format('Pluto (?) a planet!', {'?': 'is'})
console.log(planet.expand()) //prints 'Pluto is a planet'
console.log(planet.expand({'?': 'is not'})) //prints 'Pluto is not a planet'
```

`Format.expand` also operates recursively: if a nonterminal's definition is itsself a string with parentheticals in it, they will be treated as nonterminals as well:
```javascript
let definitions = { 'nest': '..a nest in a (tree)', 'tree': 'tree in a (bog)', 'bog': 'bog down in the valley, oh!' } 
const rattlinBog = new Format('(nest', definitions)
console.log(rattlinBog.expand()) //prints '..a nest in a tree in a bog down in the valley, oh!'
```