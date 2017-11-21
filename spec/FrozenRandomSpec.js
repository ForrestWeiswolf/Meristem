const {WeightedRandom, FrozenRandom} = require('../index')

describe('FrozenRandom', () => {
  let emptyRand
  const data = {a: 1, b: 2, c : 2}
  let randWithData

  beforeEach( () => {
    randWithData = new FrozenRandom(data)
    emptyRand = new FrozenRandom()
  })

  it('Inherits from WeightedRandom', () =>{
    expect(emptyRand instanceof WeightedRandom).toBe(true)
  })

  describe('.choose', () => {
    it('calls through to prototype\'s choose method the first time it\'s called', () => {
      const wRandInInheritanceChain = Object.getPrototypeOf(FrozenRandom.prototype)
      spyOn(wRandInInheritanceChain.choose, 'call').and.callThrough()
      randWithData.choose()
      expect(wRandInInheritanceChain.choose.call).toHaveBeenCalledWith(randWithData)
    })

    it('always returns the same thing thereafter', () =>{
      let tries = []
      for (let i = 0; i < 10; i++){
        tries.push(randWithData.choose())
      }
      expect(tries.every( (item) => item === tries[0]))
    })

  })
})