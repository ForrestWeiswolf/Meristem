const WeightedRandom = require('./WeightedRandom')

/**
 * A [WeightedRandom]{@link WeightedRandom} that always chooses the same value until reset.
 * @constructor
 * @extends WeightedRandom
 */
function FrozenRandom(choices) {
  WeightedRandom.call(this, choices)
  this.value = null
}

FrozenRandom.prototype = Object.create(WeightedRandom.prototype)
FrozenRandom.prototype.constructor = FrozenRandom

/**
 * As [WeightedRandom.choose]{@link WeightedRandom#choose},
 * except that once it has been called once, it will always return the same value
 * (unless [.reset]{@link FrozenRandom#reset} is called)
 */
FrozenRandom.prototype.choose = function () {
  if (this.value) {
    return this.value
  } else {
    //call WeightedRandom's choose method, but with this FrozenRandom as 'this' context:
    this.value = Object.getPrototypeOf(FrozenRandom.prototype).choose.call(this)
    return this.value
  }
}

/**
 * Resets the FrozenRandom's behavior, causing it to choose randomly again
 * next time [.choose]{@link FrozenRandom#choose} is called,
 * not necessarily returning the same value as before.
 */
FrozenRandom.prototype.reset = function () {
  this.value = null
  return this
}

module.exports = FrozenRandom

