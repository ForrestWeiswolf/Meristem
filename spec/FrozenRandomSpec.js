const {WeightedRandom, FrozenRandom} = require('../index')

describe('FrozenRandom', () => {
  let randWithData
  let wRandInInheritanceChain
  const data = {a: 1, b: 2, c : 2}

  beforeEach( () => {
    randWithData = new FrozenRandom(data)
    wRandInInheritanceChain = Object.getPrototypeOf(FrozenRandom.prototype)
  })

  it('Inherits from WeightedRandom', () =>{
    expect(randWithData instanceof WeightedRandom).toBe(true)
  })

  describe('.choose', () => {
    it('calls prototype\'s choose method the first time it\'s called', () => {
      spyOn(wRandInInheritanceChain.choose, 'call').and.returnValue('foo')

      randWithData.choose()
      expect(wRandInInheritanceChain.choose.call).toHaveBeenCalledWith(randWithData)
    })

    it('returns the result of prototype\'s choose method the first time it\'s called', () => {
      spyOn(wRandInInheritanceChain.choose, 'call').and.returnValue('foo')
      
      expect(randWithData.choose()).toEqual('foo')
    })

    it('returns the same thing thereafter', () =>{
      let tries = []
      for (let i = 0; i < 10; i++){
        tries.push(randWithData.choose())
      }
      expect(tries.every( (item) => item === tries[0]))
    })
  })
})
