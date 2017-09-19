describe('WeightedOptions', () => {
  let emptyOpt
  let optWithData
  const data = [
    ['a', 1],
    ['b', 2],
    ['c', 3]
  ]


  beforeEach(() => {
    emptyOpt = new WeightedOptions()
  })

  it('Is a constructor', () => {
    expect(typeof WeightedOptions).toEqual('function')
    expect(typeof emptyOpt).toEqual('object')
  })

  it('Can take an array of arrays as argument', () => {
    optWithData = new WeightedOptions(data)
    expect(typeof optWithData).toEqual('object')
  })

  describe('Instance methods', () => {
    beforeEach(() => {
      optWithData = new WeightedOptions(data)
    })

    describe('getTotalWeight method', () => {
      it('Is a function', () => {
        expect(typeof emptyOpt.getTotalWeight).toEqual('function')
      })

      it('Returns the sum of the values in options property', () => {
        expect(emptyOpt.getTotalWeight()).toEqual(0)
        expect(optWithData.getTotalWeight()).toEqual(6) //total of weights in the data
      })
    })

    describe('choose method', () => {
      it('Is a function', () => {
        expect(typeof emptyOpt.choose).toEqual('function')
      })

      it('calls Math.random', () => {
        spyOn(Math, 'random').and.callThrough();
        optWithData.choose()
        expect(Math.random).toHaveBeenCalled();
      })

      it('if there are no options with postitive weight, returns null', () => {
        const zeroWeights = new WeightedOptions([['a', 0], ['b', 0]])

        expect(emptyOpt.choose()).toBeNull()
        expect(zeroWeights.choose()).toBeNull()
      })

      it('otherwise, returns a key from options property', () => {
        const randItem = optWithData.choose()
        const options = data.map((wOpt) => wOpt[0]) //the options without weights
        expect(options.indexOf(randItem)).not.toBeLessThan(0);
      })
    })

  })
})
