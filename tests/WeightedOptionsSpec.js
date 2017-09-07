describe('WeightedOptions', () => {
  let opt
  const data = {a: 1, b: 2, c : 2}
  let optWithData

  beforeEach( () => {
    optWithData = new WeightedOptions(data)
    opt = new WeightedOptions()
  })

  it('Is a constructor', ()  => {
    expect(typeof WeightedOptions).toEqual('function')
    expect(typeof opt).toEqual('object')
  })

  describe('options property', () => {
    it('Is an object', ()  => {
      expect(typeof opt.options).toEqual('object')
    })

    it('when the constructor is passed an object as first argument, is set to that object', ()  => {
      expect(optWithData.options).toEqual(data)
    })

    it('initializes empty when constructor is not passed arguments', ()  => {
      const keys = Object.keys(opt.options)
      expect(keys.length).toEqual(0)
    })

    xit('throws an error when the first argument is not an object', ()  => {
    })
  })

  describe('getTotalWeight method', () => {
    it('Is a function', ()  => {
      expect(typeof opt.getTotalWeight).toEqual('function')
    })

    it('Returns the sum of the values in options property', ()  => {
      expect(opt.getTotalWeight()).toEqual(0)
      expect(optWithData.getTotalWeight()).toEqual(5)
    })
  })

})
