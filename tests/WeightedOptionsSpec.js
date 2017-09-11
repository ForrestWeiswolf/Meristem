describe('WeightedOptions', () => {
  let emptyOpt
  const data = {a: 1, b: 2, c : 2}
  let optWithData

  beforeEach( () => {
    optWithData = new WeightedOptions(data)
    emptyOpt = new WeightedOptions()
  })

  it('Is a constructor', ()  => {
    expect(typeof WeightedOptions).toEqual('function')
    expect(typeof emptyOpt).toEqual('object')
  })

  describe('options property', () => {
    it('Is an object', ()  => {
      expect(typeof emptyOpt.options).toEqual('object')
    })

    it('when the constructor is passed an object as first argument, is set to that object', ()  => {
      expect(optWithData.options).toEqual(data)
    })

    it('initializes empty when constructor is not passed arguments', ()  => {
      const keys = Object.keys(emptyOpt.options)
      expect(keys.length).toEqual(0)
    })

    xit('throws an error when the first argument is not an object', ()  => {
    })
  })

  describe('getTotalWeight method', () => {
    it('Is a function', ()  => {
      expect(typeof emptyOpt.getTotalWeight).toEqual('function')
    })

    it('Returns the sum of the values in options property', ()  => {
      expect(emptyOpt.getTotalWeight()).toEqual(0)
      expect(optWithData.getTotalWeight()).toEqual(5)
    })
  })

  describe('choose method', () => {
    it('Is a function', ()  => {
      expect(typeof emptyOpt.choose).toEqual('function')
    })

    it('calls Math.random', ()  => {
      spyOn(Math, 'random').and.callThrough();
      optWithData.choose()
      expect(Math.random).toHaveBeenCalled();
    })

    it('if there are no options with postitive weight, returns null', ()  => {
      const zeroWeights = new WeightedOptions({a: 0, b: 0})

      expect(emptyOpt.choose()).toBeNull()
      expect(zeroWeights.choose()).toBeNull()
    })

    it('otherwise, returns a key from options property', ()  => {
      const rand = optWithData.choose()
      expect( Object.keys(data).indexOf(rand) ).not.toBeLessThan(0);
    })
  })

})
