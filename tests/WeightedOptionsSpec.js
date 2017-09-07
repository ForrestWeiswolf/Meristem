describe('WeightedOptions', () => {
  let opt

  beforeEach( () => {
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
      const data = {'a': 1, 'b': 2}
      const optWithData = new WeightedOptions(data)
      expect(optWithData.options).toEqual(data)
    })

    it('initializes empty when constructor is not passed arguments', ()  => {
      const keys = Object.keys(opt.options)
      expect(keys.length).toEqual(0)
    })

    xit('throws an error when the first argument is not an object', ()  => {
    })

  })
})
