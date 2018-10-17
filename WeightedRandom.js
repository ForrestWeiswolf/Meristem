const {mustBeArr, mustBeNum} = require('./utils')


function WeightedRandom() {
  if (typeof arguments[0] === 'undefined') {
    throw new Error('No argument passed to WeightedRandom constructor')
  } else if (arguments[0] === null) {
    throw new Error('WeightedRandom constructor was passed null - it must be passed an object or a series of length 2 arrays')
  } else if (typeof arguments[0] !== 'object') {
    throw new Error(`WeightedRandom constructor was passed ${typeof arguments[0]} - it must be passed an object or a series of length 2 arrays`)
  } else if(arguments[0].constructor === Array){
    this.choices = this.pairsToOptions(...arguments)
  } else {
    this.choices = this.objToOptions(arguments[0])
  }
}

WeightedRandom.prototype.objToOptions = function (obj) {
  let result = []

  Object.keys(obj).forEach((option) => {
    result.push({
      val: option,
      weight: mustBeNum(obj[option], type => `WeightedRandom was passed ${type} as a weight in options, instead of a number`)
    })
  })

  return result
}

WeightedRandom.prototype.pairsToOptions = function () {
  let result = []

  Array.prototype.slice.call(arguments).forEach((pair) => {
    mustBeArr(pair, type => `WeightedRandom constructor was passed ${type} - it must be passed an object or a series of length 2 arrays`)

    if (pair.length !== 2) {
      throw new Error('arrays passed to WeightedOptions constructor must be of length 2')
    } else {
      result.push({
        val: pair[0],
        weight: mustBeNum(pair[1], type => `WeightedRandom was passed ${type} as a weight in options, instead of a number`)
      })
    }
  })

  return result
}


WeightedRandom.prototype.getTotalWeight = function () {
  return this.choices.reduce((sum, choice) => {
    return choice.weight + sum
  }, 0)
}

WeightedRandom.prototype.choose = function () {
  if (this.getTotalWeight() === 0) {
    return null
  }

  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  for(let i = 0; i < this.choices.length; i++){
    count += this.choices[i].weight

    if (count > rand) {
      return this.choices[i].val
    }
  }    
}

module.exports = WeightedRandom
