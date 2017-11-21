const WeightedRandom = require('./WeightedRandom')

function FrozenRandom(choices) {
  WeightedRandom.call(this, choices)
  this.value = null
}

FrozenRandom.prototype = Object.create(WeightedRandom.prototype)
FrozenRandom.prototype.constructor = FrozenRandom

FrozenRandom.prototype.choose = function () {
  if (this.value) {
    return this.value
  } else {
    //call WeightedRandom's choose method, but with this FrozenRandom as 'this' context:
    this.value = Object.getPrototypeOf(FrozenRandom.prototype).choose.call(this)
    return this.value
  }
}

module.exports = FrozenRandom

