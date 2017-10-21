//A basic example, using Formats to generate random motto-ish phrases

const WeightedRandom = require('../WeightedRandom')
const Format = require('../Format')

const definitions = {
  motto: new WeightedRandom({
    'In All Things, (abstraction)': 6,
    '(abstraction) and (abstraction)': 3,
    '(abstraction) through (abstraction)': 2,
    'In (abstraction), we become (adjective)': 3,
    'In (abstraction), we are (adjective)': 3  
  }),
  abstraction: new WeightedRandom({
    'Love': 2,
    'Peace': 3,
    'Nature': 1,
    'Faith': 2,
    'Hope': 2,
    'Truth': 3,
    'Vigilance': 4,
    'Strength': 4,
    'Honor': 4,
    'Charity': 2,
    '(abstraction), (abstraction)': 1
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

const motto = new Format('(motto)', definitions)
for(var i  = 0; i < 5; i++){
  console.log(motto.expand())
}