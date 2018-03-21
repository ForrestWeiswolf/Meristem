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
      return new WeightedRandom('Ce n\'est pas un objet')
    }

    function numConstructor() {
      return new WeightedRandom(72)
    }

    function nullConstructor() {
      return new WeightedRandom(null)
    }

    expect(emptyConstructor).toThrow(new Error('No argument passed to WeightedRandom constructor'))
    expect(strConstructor).toThrow(new Error('WeightedRandom constructor was passed string - it must be passed an object or a series of length 2 arrays'))
    expect(numConstructor).toThrow(new Error('WeightedRandom constructor was passed number - it must be passed an object or a series of length 2 arrays'))
    expect(nullConstructor).toThrow(new Error('WeightedRandom constructor was passed null - it must be passed an object or a series of length 2 arrays'))
  })

  it('has a objToOptions method', () => {
    expect(typeof WeightedRandom.prototype.objToOptions).toBe('function')
  })

  describe('WeightedRandom.prototype.objToOptions', () => {
    it(`converts object with numeric values into an array of
    objects with .val and .weight properties corresponding to passed keys and values`, () => {
      const result = WeightedRandom.prototype.objToOptions({ a: 1, b: 2 })

      expect(result.length).toEqual(2)
      expect(result).toContain({ val: 'a', weight: 1 })
      expect(result).toContain({ val: 'b', weight: 2 })
    })
  })

  it('throws an informative error when the object has non-numeric values', () => {
    function stringWeightConstructor() {
      return new WeightedRandom({ a: 'three', b: 2 })
    }

    function nullWeightConstructor() {
      return new WeightedRandom({ a: null, b: 2 })
    }

    expect(stringWeightConstructor).toThrow(
      new Error('WeightedRandom was passed a string as a weight in options, instead of a number')
    )

    expect(nullWeightConstructor).toThrow(
      new Error('WeightedRandom was passed null as a weight in options, instead of a number')
    )
  })

  describe('choices property', () => {
    it('Is an object', () => {
      expect(typeof randWithData.choices).toEqual('object')
    })

    it('when the constructor is passed an object as first argument, is set to that object', () => {
      expect(randWithData.choices).toEqual(data)
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
      spyOn(Math, 'random').and.callThrough();
      randWithData.choose()
      expect(Math.random).toHaveBeenCalled();
    })

    it('if there are no choices with postitive weight, returns null', () => {
      const zeroWeights = new WeightedRandom({ a: 0, b: 0 })

      expect(zeroWeights.choose()).toBeNull()
    })

    it('otherwise, returns a key from choices property', () => {
      const rand = randWithData.choose()
      expect(Object.keys(data).indexOf(rand)).not.toBeLessThan(0);
    })
  })
})
