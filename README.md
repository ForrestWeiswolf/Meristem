Meristem
======
[![npm version](http://img.shields.io/npm/v/meristem.svg?style=flat)](https://npmjs.org/package/meristem "View this project on npm")
[![Build Status](https://travis-ci.org/ForrestWeiswolf/Meristem.svg?branch=master)](https://travis-ci.org/ForrestWeiswolf/Meristem)
[![Coverage Status](https://coveralls.io/repos/github/ForrestWeiswolf/Meristem/badge.svg?branch=master)](https://coveralls.io/github/ForrestWeiswolf/Meristem?branch=continuous-integration)
[![Known Vulnerabilities](https://snyk.io/test/github/ForrestWeiswolf/Meristem/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ForrestWeiswolf/Meristem?targetFile=package.json)

A lightweight (no dependencies!) Javascript library for procedural text generation using a context-free grammar. Like template literals, or Python's string formatting, but significantly more flexible.

[Examples of usage](https://github.com/ForrestWeiswolf/Meristem-examples)
– [Documentation](https://forrestweiswolf.github.io/Meristem/) – [Changelog](https://github.com/ForrestWeiswolf/Meristem/blob/master/CHANGELOG.md)

## How To Use

First, `npm install meristem`, and `require` it in your code:

```javascript
Format = require('meristem').Format
WeightedRandom = require('meristem').WeightedRandom
```

Meristem privides three constructors: `Format`, `WeightedRandom`, and `FrozenRandom`.

### Format:

When creating a Format, you will generally pass the constructor a string, which we'll call the format string, and an object, which we'll call the definitions, or definitions object.

When you call a Format's `.expand` method, it will return the format string, but with any parenthetical 'nonterminals' replaced with the values assosciated with them in definitions object. The following code:

```javascript
let f = new Format('(month) is the cruelest month', { month: 'April' })
console.log(f.expand()) //
```
...prints ['April is the cruelest month'](https://en.wikipedia.org/wiki/The_Waste_Land).

If you pass an object to `Format.expand`, it will be used instead of the Format's own definitions object. This also you to use a format with no definitions specified:

```javascript
let f = new Format('(month) is the cruelest month,', { month: 'April' })
console.log(f.expand()) //prints 'April is the cruelest month,'
console.log(f.expand(), { month: 'May' }) //prints 'May is the cruelest month,'
```

`Format.expand` also operates recursively: if a nonterminal's definition is itself a string with parentheticals in it, they will be treated as nonterminals as well. For example:

```javascript
const Format = require('./Format')

let definitions = {
  aprilDescription: 'the cruelest month',
  'things the cruelest month does':
    'breeding \nLilacs out of the dead land, mixing\nMemory and desire, stirring\nDull roots with (season) rain',
  season: 'spring',
}
const burialOfTheDead = new Format(
  'April is (aprilDescription), (things the cruelest month does)',
  definitions
)
console.log(burialOfTheDead.expand())
```
...prints
`April is the cruelest month, breeding
Lilacs out of the dead land, mixing
Memory and desire, stirring
Dull roots with spring rain`.


What if the values in the definitions object aren't strings?

Well, when a nonterminal's value is a Format, its expand method will be called, and then the result will be treated just as any other string would. This is could be useful if you want to nest Formats but don't want the inner ones to use the same definitions as the outer.

However, a more common situation is for the value to be a WeightedRandom.

### WeightedRandom:

The purpose of a WeightedRandom is to choose randomly from a list of options, while allowing you to set weights, making some options more likely than others.

The WeightedRandom constructor takes an arbitrary number of arrays, each consisting of some value as the first element, and a numerical weight assosciated with it as the second. It has a `.choose` method, which, when called, returns a random one of those values, with probability correspning to the assosciated weight. For example

```javascript
// What are the roots that clutch, what branches grow
// Out of this stony rubbish?
const wRand = new WeightedRandom(['Lilacs', 1], ['Hyacinths', 2], ['That corpse you planted last year in your garden', 1]})
console.log(wRand.choose())
```

will print `Lilacs` 1/4 of the time, `That corpse you planted last year in your garden` 1/4 of the time, and `Hyacinths` 2/4 of the time. (Since the weights total to 4.)

Alternatively, you may pass the WeightedRandom an object with numerical values, in which case the `.choose` method will returns a random key from that object, with probability correspning to the assosciated value. For example

```javascript
const wRand = new WeightedRandom({
  Lilacs: 1,
  Hyacinths: 2,
  'That corpse you planted last year in your garden': 1,
})
console.log(wRand.choose())
```

is equivalent to the previous example. This is slighly more succinct, but does not allow for non-string options.

## Using a WeightedRandom in a format:

When a nonterminal's value is a WeightedRandom, the WeightedRandom's `.choose` method is called, and the result expanded if relevant and inserted in the result, just as any other string would be. This allow you to generate random text using a format, like so:

```javascript
const randomCard = new WeightedRandom(
  ['the drowned Phoenician Sailor', 2],
  ['Belladonna, The Lady of the Rocks', 1]
)
const divination = new Format('Here, said she, is your card, (card)', {
  card: randomCard,
})

console.log(divination.expand())
```
...prints `Here, said she, is your card, the drowned Phoenician Sailor` or `Here, said she, is your card, Belladonna, The Lady of the Rocks`

## FrozenRandom:

FrozenRandom extends WeightedRandom, and behaves identically the first time its `.choose` method is called. However, every subsequent call of `.choose` will return the same result as the first. For example,

```javascript
const randomFlowers = new FrozenRandom( ['hyacinth', 3], ['lilac', 1] })
const introductions = new Format(
  'You gave me (flower)s first a year ago;\nThey called me the (flower) girl.',
  { d: day, w: weather }
)
```

will return `You gave me hyacinths first a year ago;\nThey called me the hyacinth girl.` or `You gave me lilacs first a year ago;\nThey called me the lilac girl.`, but _won't_ ever return `You gave me hyacinths first a year ago;\nThey called me the lilac girl.`

Once you call `.reset`, however, the FrozenRandom will choose randomly again the next time `.choose` is called.

