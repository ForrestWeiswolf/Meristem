//A basic example, using Formats to generate random motto-ish phrases

const WeightedRandom = require('../WeightedRandom')
const Format = require('../Format')

const definitions = {
  context: new WeightedRandom({
    'In All Things,': 6,
    '(abstraction) and': 3,
    '(abstraction), (abstraction),': 1,
    '(abstraction) through': 2,
  }),
  abstraction: new WeightedRandom({
    'Love': 2,
    'Peace': 3,
    'Nature': 1,
    'Faith': 3,
    'Hope': 1,
    'Truth': 2,
    'Vigilance': 1,
    'Strength': 2
  }),
  adjective: new WeightedRandom({
    'Honorable': 2,
    'Vigilant': 3,
    'Proud': 1,
    'United': 3,
    'True': 1,
    'Truthful': 2,
    'Strong': 1
  })
}

const motto = new Format('(context) (abstraction)', definitions)
for(var i  = 0; i < 5; i++){
  console.log(motto.expand())
}