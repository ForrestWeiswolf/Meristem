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

  it('throws an error when no argument is passed', () => {
    function emptyConstructor() {
      return new WeightedRandom()
    }

    expect(emptyConstructor).toThrow(new Error('No argument passed to WeightedRandom constructor'))
  })

  it('throws an informative error when the first argument is not an object', () => {
    function strConstructor() {
      return new WeightedRandom('Ce n\'est pas un objet')
    }

    function numConstructor() {
      return new WeightedRandom(72)
    }

    function nullConstructor() {
      return new WeightedRandom(null)
    }

    expect(strConstructor).toThrow(new Error('WeightedRandom constructor was passed string instead of object'))
    expect(numConstructor).toThrow(new Error('WeightedRandom constructor was passed number instead of object'))
    expect(nullConstructor).toThrow(new Error('WeightedRandom constructor was passed null instead of object'))
  })

  it('throws an informative error when the object has non-numeric keys', () => {
    function stringWeightConstructor() {
      return new WeightedRandom({a: 'three', b: 2})
    }

    function nullWeightConstructor() {
      return new WeightedRandom({a: null, b: 2})
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
