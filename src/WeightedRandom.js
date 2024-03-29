const { mustBeType, mustBeClass } = require('./utils')

const mustBeNum = (val, message) => mustBeType(val, 'number', message)
const mustBeArr = (val, message) => mustBeClass(val, Array, message)

/**
 * A set of values with weights, which can return a random value
 * with probability corresponding to its weight.
 * @constructor
 * @param {...Array} options Any number of arrays of length 2,
 * each consisting of an arbitrary value and the weight assigned to it.
 * Alternatively, the constructor may be called with a single object
 * where the keys are options and the assosciated values are their weights.
 */
function WeightedRandom(...args) {
  if (typeof args[0] === 'undefined') {
    throw new Error('No argument passed to WeightedRandom constructor')
  } else if (args[0] === null) {
    throw new Error(
      'WeightedRandom constructor was passed null - it must be passed an object or a series of length 2 arrays'
    )
  } else if (typeof args[0] !== 'object') {
    throw new Error(
      `WeightedRandom constructor was passed ${typeof args[0]} - it must be passed an object or a series of length 2 arrays`
    )
  } else if (args[0].constructor === Array) {
    this.choices = this._pairsToOptions(...args)
  } else {
    this.choices = this._objToOptions(args[0])
  }
}

WeightedRandom.prototype._objToOptions = function objToOptions(obj) {
  const result = []

  Object.keys(obj).forEach((option) => {
    result.push({
      val: option,
      weight: mustBeNum(
        obj[option],
        (type) => `WeightedRandom was passed ${type} as a weight in options, instead of a number`
      ),
    })
  })

  return result
}

WeightedRandom.prototype._pairsToOptions = function pairsToOptions(...args) {
  const result = []

  Array.prototype.slice.call(args).forEach((pair) => {
    mustBeArr(
      pair,
      (type) => `WeightedRandom constructor was passed ${type} - it must be passed an object or a series of length 2 arrays`
    )

    if (pair.length !== 2) {
      throw new Error(
        'arrays passed to WeightedOptions constructor must be of length 2'
      )
    } else {
      result.push({
        val: pair[0],
        weight: mustBeNum(
          pair[1],
          (type) => `WeightedRandom was passed ${type} as a weight in options, instead of a number`
        ),
      })
    }
  })

  return result
}

WeightedRandom.prototype.getTotalWeight = function getTotalWeight() {
  return this.choices.reduce((sum, choice) => choice.weight + sum, 0)
}

/**
 * Returns a random option. The chance of a given option being returned
 * is equal to (that option's weight) / (total of all options' weights).
 * E.g. if the constructor was passed `['a', 1], ['b', 2]`, there is a
 * 1/3 chance of `'a'` being returned and a 2/3 chance of `'b'` being returned.
 */
WeightedRandom.prototype.choose = function choose() {
  if (this.getTotalWeight() === 0) {
    return null
  }

  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  for (let i = 0; i < this.choices.length; i++) {
    count += this.choices[i].weight

    if (count > rand) {
      return this.choices[i].val
    }
  }
}

module.exports = WeightedRandom
