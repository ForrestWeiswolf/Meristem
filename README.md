Meristem
======

A Javascript library for procedural text generation using a context-free grammar.
Several examples of usage can be found [here](https://github.com/ForrestWeiswolf/Meristem-examples)

(I apologize for any unconventional terminology - what I'm trying to do here is close enough to the normal uses of context-free grammars that I feel I ought to follow convention, but not so similar that I'm easily able to do so without potentially misleading)

This project was inspired by [Mark Rosenfelder's Language Text Generator](http://zompist.com/gen.html), although I haven't looked at his code.

How To Use
------
First, `npm install meristem`, and `require` it in your code:
```javascript
Format = require('meristem').Format
WeightedRandom = require('meristem').WeightedRandom
```
Meristem privides three constructors: `Format`, `WeightedRandom`, and `FrozenRandom`.

### Format:
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
let definitions = {
  'nest': '..a nest in a (tree)', 'tree': 'tree in a (bog)', 'bog': 'bog down in the valley, oh!'
} 
const rattlinBog = new Format('(nest', definitions)
console.log(rattlinBog.expand()) //prints '..a nest in a tree in a bog down in the valley, oh!'
```

What about when the values in the definitions object aren't strings? 

Well, when a nonterminal's value is itself a Format, its expand method will be called, and then the result will be treated just as any other string would. This is could be useful if you want to nest Formats but don't want the inner ones to use the same definitions as the outer. 

However, a more common situation is for the value to be a WeightedRandom.

### WeightedRandom:
The purpose of a WeightedRandom is to choose randomly from a list of options, while allowing you to set weights, making some options more likely than others.

The WeightedRandom constructor takes an arbitrary number of arrays, each consisting of some value as the first element, and a numerical weight assosciated with it as the second. It has a `.choose` method, which, when called, returns a random one of those values, with probability correspning to the assosciated weight. For example
```javascript
const wRand = new WeightedRandom(['rain', 1], ['sun', 2]})
console.log(wRand.choose())
```
will print 'rain' 1/3 of the time, and 'sun' 2/3 of the time. (The denominator being the total of the weights.) 

Alternatively, you may pass the WeightedRandom an object with numerical values, in which case the `.choose` method will returns a random key from that object, with probability correspning to the assosciated value. For example
```javascript
const wRand = new WeightedRandom({rain: 1, sun: 2})
console.log(wRand.choose())
```
is equivalent to the previous example. This was the only for of input available in previous versions of Meristem; it's slighly more succinct, but does not allow for non-string options.

## Using a WeightedRandom in a format:
When a nonterminal's value is a WeightedRandom, the WeightedRandom's `.choose` method is called, and the result expanded if relevant and inserted in the result, just as any other string would be. This allow you to generate random text using a format, like so:
```javascript
const weather = new WeightedRandom({rainy: 1, sunny: 2})
const day = new WeightedRandom({today: 2, tommorrow: 3})
const forecast = new Format('The weather (d) will be (w).', {d: day, w: weather})
```

## FrozenRandom:
FrozenRandom extends WeightedRandom, and behaves identically the first time its `.choose` method is called. However, every subsequent call of `.choose` will return the same result as the first. For example,
```javascript
const name = new FrozenRandom({Lee: 2, Abdallah: 3})
const introductions = new Format('"Hello. I\'m (name)," I said. "Nice to meet you, (name)," she replied.', {d: day, w: weather})
```
will return `'"Hello. I'm Lee," I said. "Nice to meet you, Lee," she replied.'` or `'"Hello. I'm Abdallah,"` I said. `"Nice to meet you, Abdallah," she replied.'`, but *won't* ever return `'"Hello. I'm Lee," I said. "Nice to meet you, Abdallah,"` she replied.'
