describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('Takes a string and an option non-empty object as arguments', () => {
      let format = new Format('(a)', { a: 'example' })
      expect(format).toBeDefined()
      format = new Format('(a)')
      expect(format).toBeDefined()
    })

    it('Is a constructor', () => {
      const format = new Format('(a)', { a: 'example' })
      expect(typeof format).toEqual('object')
    })

    it('Throws an error if first arg is not a string', () => {
      function emptyConstructor() {
        return new Format()
      }

      function wrongTypeConstructor() {
        return new Format(1)
      }

      expect(emptyConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
      expect(wrongTypeConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
    })
  })

  describe('expand method', () => {
    let format

    it('is an instance method', () => {
      expect(typeof Format.prototype.expand).toEqual('function')
    })

    it('returns a string', () => {
      format = new Format('(a)', { 'a': 'example' })
      expect(typeof format.expand()).toEqual('string')
    })

    it('when the string contains no parentheses, returns it as-is', () => {
      format = new Format('ABC', { 'a': 'example' })
      expect(format.expand()).toEqual('ABC')
    })

    it('inserts strings from the definitions object in place of parenthetical tokens', () => {
      format = new Format('(a), (b)(c)', { 'a': 'foo', 'b': 'bar', 'c': '...' })
      expect(format.expand()).toEqual('foo, bar...')
    })

    it('throws an error when a token is not found in the definitions object', () => {
      format = new Format('(a)BC', { 'd': 'example' })
      expect(format.expand).toThrow(new Error('"a" not found in definitions'))
    })

    it('uses passed definitions object if this.definitions does not exist', () => {
      format = new Format('(a), (b)(c)')
      expect(format.expand({ 'a': 'foo', 'b': 'bar', 'c': '...' })).toEqual('foo, bar...')
    })

    it('throws an error when this.definitions does not exist and no object is passed', () => {
      format = new Format('(a)BC')
      expect(format.expand).toThrow(new Error('This.definitions does not exist and no definitions argument passed'));
    })

    describe('when a token is itself a Format', () => {
      it('when the definition is an object with an expand method, it is called and the returned value added to result', () => {
        format = new Format('(a), (b)', { 'a': 'foo', 'b': 'bar' })
        let recFormat = new Format('Recursive example: (recurse)', { 'recurse': format })
        expect(recFormat.expand()).toEqual('Recursive example: foo, bar')
      })

      it('passes the expand method this.definitions', () => {
        format = new Format('(a), (b)')
        let recFormat = new Format('Recursive example: (recurse)', { 'recurse': format, 'a': 'foo', 'b': 'bar' })
        expect(recFormat.expand()).toEqual('Recursive example: foo, bar')
      })
    }) //end 'when a token is itself a Format'
  })
})
