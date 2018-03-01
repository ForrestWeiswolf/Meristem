function WeightedRandom(choices) {
  if (typeof choices === 'undefined') {
    throw new Error('No argument passed to WeightedRandom constructor')
  } else if (choices === null) {
    throw new Error('WeightedRandom constructor was passed null instead of object')
  } else if (typeof choices !== 'object') {
    throw new Error(`WeightedRandom constructor was passed ${typeof choices} instead of object`)
  }

  this.choices = {}

  Object.keys(choices).forEach((option) => {
    if (typeof choices[option] === 'number') {
      this.choices[option] = choices[option]
    } else if (choices[option] === null) {
      throw new Error(
        `WeightedRandom was passed null as a weight in options, instead of a number`
      )
    }
    else {
      throw new Error(
        `WeightedRandom was passed a ${typeof choices[option]} as a weight in options, instead of a number`
      )
    }
  })
}

WeightedRandom.prototype.getTotalWeight = function () {
  const keys = Object.keys(this.choices)

  return keys.reduce((sum, key) => {
    return this.choices[key] + sum
  }, 0)
};

WeightedRandom.prototype.choose = function () {
  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  if (this.getTotalWeight() === 0) {
    return null
  }

  for (var key in this.choices) {
    count += this.choices[key]
    if (count > rand) {
      return key
    }
  }
};

module.exports = WeightedRandom
