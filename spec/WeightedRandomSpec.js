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
