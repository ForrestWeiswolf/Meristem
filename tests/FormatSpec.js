describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('Takes a string and a non-empty object as arguments', () => {
      const format = new Format('(a)', {a: 'example'})
      expect(format).toBeDefined()
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

  describe('expand method', () => {
    let format

    it('is an instance method', () => {
      expect(typeof Format.prototype.expand).toEqual('function')
    })

    it('returns a string', () => {
      format = new Format('(A)', {'a': 'example'})      
      expect(typeof format.expand()).toEqual('string')
    })

    it('when the string contains no parentheses, returns it as-is', () => {
      format = new Format('ABC', {'a': 'example'})
      expect(format.expand()).toEqual('ABC')
    })

    it('inserts strings from the definitions object in place of parenthetical tokens', () => {
      format = new Format('(a), (b)(c)', {'a': 'foo', 'b': 'bar', 'c': '...'})
      expect(format.expand()).toEqual('foo, bar...')
    })

    it('throws an error when a token is not found in the definitions object', () => {
      format = new Format('(a)BC', {'d': 'example'})
      expect(format.expand).toThrow(new Error('"a" not found in definitions'));      
    })
  })
})
