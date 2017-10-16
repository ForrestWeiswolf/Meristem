describe('WeightedRandom', () => {
  let emptyRand
  const data = {a: 1, b: 2, c : 2}
  let randWithData

  beforeEach( () => {
    randWithData = new WeightedRandom(data)
    emptyRand = new WeightedRandom()
  })

  it('Is a constructor', ()  => {
    expect(typeof WeightedRandom).toEqual('function')
    expect(typeof emptyRand).toEqual('object')
  })

  describe('options property', () => {
    it('Is an object', ()  => {
      expect(typeof emptyRand.options).toEqual('object')
    })

    it('when the constructor is passed an object as first argument, is set to that object', ()  => {
      expect(randWithData.options).toEqual(data)
    })

    it('initializes empty when constructor is not passed arguments', ()  => {
      const keys = Object.keys(emptyRand.options)
      expect(keys.length).toEqual(0)
    })

    xit('throws an error when the first argument is not an object', ()  => {
    })
  })

  describe('getTotalWeight method', () => {
    it('Is a function', ()  => {
      expect(typeof emptyRand.getTotalWeight).toEqual('function')
    })

    it('Returns the sum of the values in options property', ()  => {
      expect(emptyRand.getTotalWeight()).toEqual(0)
      expect(randWithData.getTotalWeight()).toEqual(5)
    })
  })

  describe('choose method', () => {
    it('Is a function', ()  => {
      expect(typeof emptyRand.choose).toEqual('function')
    })

    it('calls Math.random', ()  => {
      spyOn(Math, 'random').and.callThrough();
      randWithData.choose()
      expect(Math.random).toHaveBeenCalled();
    })

    it('if there are no options with postitive weight, returns null', ()  => {
      const zeroWeights = new WeightedRandom({a: 0, b: 0})

      expect(emptyRand.choose()).toBeNull()
      expect(zeroWeights.choose()).toBeNull()
    })

    it('otherwise, returns a key from options property', ()  => {
      const rand = randWithData.choose()
      expect( Object.keys(data).indexOf(rand) ).not.toBeLessThan(0);
    })
  })

})
