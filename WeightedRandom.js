function WeightedRandom(choices) {
  if (typeof choices === 'undefined') {
    throw new Error('No argument passed to WeightedRandom constructor')
  }
  
  this.choices = choices
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
