describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('Takes a string and a non-empty object as arguments', () => {
      const format = new Format('(a)', {a: 'example'})
    })

    it('Is a constructor', () => {
      const format = new Format('(a)', { a: 'example' })
      expect(typeof format).toEqual('object')
    })

    it('Throws an error if first arg is not a string', () => {
      function emptyConstructor(){
        return new Format()
      }

      function wrongTypeConstructor(){
        return new Format(1)
      }

      expect(emptyConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
      expect(wrongTypeConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
    })

    it('Throws an error if second arg is not a object', () => {
      function emptySecondConstructor() {
        return new Format('(a)')
      }

      function wrongSecondTypeConstructor() {
        return new Format('(a)', 1)
      }

      expect(emptySecondConstructor).toThrow(new Error('Incorrect second argument to Format constructor'));
      expect(wrongSecondTypeConstructor).toThrow(new Error('Incorrect second argument to Format constructor'));
    })
  })
})
