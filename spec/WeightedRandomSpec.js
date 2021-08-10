const { WeightedRandom } = require('../index')

describe('WeightedRandom', () => {
  const data = { a: 1, b: 2, c: 2 }
  let randWithData

  beforeEach(() => {
    randWithData = new WeightedRandom(data)
  })

  it('Is a constructor', () => {
    expect(typeof WeightedRandom).toEqual('function')
    expect(typeof randWithData).toEqual('object')
  })

  it('throws an informative error when the first argument is not an object or array', () => {
    function emptyConstructor() {
      return new WeightedRandom()
    }

    function strConstructor() {
      return new WeightedRandom("Ce n'est pas un objet")
    }

    function numConstructor() {
      return new WeightedRandom(72)
    }

    function nullConstructor() {
      return new WeightedRandom(null)
    }

    expect(emptyConstructor).toThrow(new Error('No argument passed to WeightedRandom constructor'))
    expect(strConstructor).toThrow(
      new Error(
        'WeightedRandom constructor was passed string - it must be passed an object or a series of length 2 arrays'
      )
    )
    expect(numConstructor).toThrow(
      new Error(
        'WeightedRandom constructor was passed number - it must be passed an object or a series of length 2 arrays'
      )
    )
    expect(nullConstructor).toThrow(
      new Error(
        'WeightedRandom constructor was passed null - it must be passed an object or a series of length 2 arrays'
      )
    )
  })

  it('has a objToOptions method', () => {
    expect(typeof WeightedRandom.prototype._objToOptions).toBe('function')
  })

  describe('WeightedRandom.prototype._objToOptions', () => {
    it('throws an informative error when the object has non-numeric values', () => {
      function stringWeight() {
        return WeightedRandom.prototype._objToOptions({ a: 'three', b: 2 })
      }

      function objWeight() {
        return WeightedRandom.prototype._objToOptions({ a: {}, b: 2 })
      }

      function nullWeight() {
        return WeightedRandom.prototype._objToOptions({ a: null, b: 2 })
      }

      expect(stringWeight).toThrow(
        new Error('WeightedRandom was passed string as a weight in options, instead of a number')
      )

      expect(objWeight).toThrow(
        new Error('WeightedRandom was passed object as a weight in options, instead of a number')
      )

      expect(nullWeight).toThrow(
        new Error('WeightedRandom was passed null as a weight in options, instead of a number')
      )
    })
  })

  it('calls objToOptions on a passed object', () => {
    spyOn(WeightedRandom.prototype, '_objToOptions').and.callThrough()

    const obj = { a: 1, b: 2 }
    new WeightedRandom(obj)

    expect(WeightedRandom.prototype._objToOptions).toHaveBeenCalledWith(obj)
  })

  /* As when passing an object, what we're doing here is giving it a list of
  options with weights. However, we want to be able to have options that
  are themselves objects; this would be problematic if options were
  expressed only as the keys of an object */

  it('has an pairsToOptions method', () => {
    expect(typeof WeightedRandom.prototype._pairsToOptions).toBe('function')
  })

  describe('WeightedRandom.prototype._pairsToOptions', () => {
    it('throws an informative error unless every argument is an array', () => {
      function nullArg() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], null, ['c', 2])
      }

      function strArg() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], 'not an array', ['c', 2])
      }

      expect(nullArg).toThrow(
        new Error(
          'WeightedRandom constructor was passed null - it must be passed an object or a series of length 2 arrays'
        )
      )

      expect(strArg).toThrow(
        new Error(
          'WeightedRandom constructor was passed string - it must be passed an object or a series of length 2 arrays'
        )
      )
    })

    it('throws an informative error unless every argument has length 2', () => {
      function emptyArrConstructor() {
        return WeightedRandom.prototype._pairsToOptions(['cup after all the tea is gone', 2], [], ['old pen', 2])
      }
      function tooLongConstructor() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], ['b', 1, 1], ['c', 2])
      }

      expect(emptyArrConstructor).toThrow(new Error('arrays passed to WeightedOptions constructor must be of length 2'))
      expect(tooLongConstructor).toThrow(new Error('arrays passed to WeightedOptions constructor must be of length 2'))
    })

    it('throws an informative error when any argument has non-numeric second element', () => {
      function stringWeight() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], ['b', 'two'])
      }

      function objWeight() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], ['b', {}])
      }

      function nullWeight() {
        return WeightedRandom.prototype._pairsToOptions(['a', 1], ['b', null])
      }

      expect(stringWeight).toThrow(
        new Error('WeightedRandom was passed string as a weight in options, instead of a number')
      )

      expect(objWeight).toThrow(
        new Error('WeightedRandom was passed object as a weight in options, instead of a number')
      )

      expect(nullWeight).toThrow(
        new Error('WeightedRandom was passed null as a weight in options, instead of a number')
      )
    })
  })

  it('calls pairsToOptions on passed arrays', () => {
    spyOn(WeightedRandom.prototype, '_pairsToOptions').and.callThrough()

    new WeightedRandom(['a', 1], ['b', 2])

    expect(WeightedRandom.prototype._pairsToOptions).toHaveBeenCalledWith(['a', 1], ['b', 2])
  })

  it('objToOptions and pairsToOptions return the same thing when given equivalent inputs', () => {
    expect(WeightedRandom.prototype._pairsToOptions(['foo', 1], ['bar', 2])).toEqual(
      WeightedRandom.prototype._objToOptions({ foo: 1, bar: 2 })
    )
  })

  it('constructor creates identical objects when given equivalent inputs', () => {
    const randFromPairs = new WeightedRandom(['foo', 1], ['bar', 2])
    const randFromObj = new WeightedRandom({ foo: 1, bar: 2 })

    expect(Object.keys(randFromPairs)).toEqual(Object.keys(randFromObj))

    Object.keys(randFromPairs).forEach((key) => {
      expect(randFromPairs[key]).toEqual(randFromObj[key])
    })
  })

  describe('getTotalWeight method', () => {
    it('Is a function', () => {
      expect(typeof randWithData.getTotalWeight).toEqual('function')
    })

    it('Returns the sum of the values in choices property', () => {
      expect(randWithData.getTotalWeight()).toEqual(5)
    })
  })

  describe('choose method', () => {
    it('Is a function', () => {
      expect(typeof randWithData.choose).toEqual('function')
    })

    it('calls Math.random', () => {
      spyOn(Math, 'random').and.callThrough()
      randWithData.choose()
      expect(Math.random).toHaveBeenCalled()
    })

    it('if there are no choices with postitive weight, returns null', () => {
      const zeroWeights = new WeightedRandom({ a: 0, b: 0 })

      expect(zeroWeights.choose()).toBeNull()
    })

    it('otherwise, returns a key from choices property', () => {
      const rand = randWithData.choose()
      expect(Object.keys(data).indexOf(rand)).not.toBeLessThan(0)
    })
  })
})
