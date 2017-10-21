describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('can take a string and an optional non-empty object as arguments', () => {
      expect(new Format('(a)', { a: 'example' })).toBeDefined()
      expect(new Format('(a)')).toBeDefined()
    })

    it('can take a WeightedRandom and an optional non-empty object as arguments', () => {
      const coin = new WeightedRandom({heads: 1, tails: 1})
      expect(new Format(coin, { a: 'example' })).toBeDefined()
      expect(new Format(coin)).toBeDefined()
    })

    it('Is a constructor', () => {
      const format = new Format('(a)', { a: 'example' })
      expect(typeof format).toEqual('object')
    })

    it('Throws an error if first arg is not a string', () => {
      function emptyConstructor() {
        return new Format()
      }

      function numberConstructor() {
        return new Format(1)
      }

      function objectConstructor() {
        return new Format({key: 'value'})
      }

      function nullConstructor() {
        return new Format(null)
      }

      expect(emptyConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
      expect(numberConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
      expect(objectConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
      expect(nullConstructor).toThrow(new Error('Incorrect first argument to Format constructor'));
    })
  }) //end 'constructor'

  describe('expand method', () => {
    it('is an instance method', () => {
      expect(typeof Format.prototype.expand).toEqual('function')
    })

    it('calls handleToken on any parenthetical tokens, and replaces them with the returned value', () => {
      const format = new Format('(a) (b) (c)...', { 'a': 'example' })
      spyOn(format, 'handleToken').and.callFake((token, defs) => token ? 'baz' : '')

      expect(format.expand()).toEqual('baz baz baz...')
      expect(format.handleToken.calls.argsFor(0)).toContain('a')
      expect(format.handleToken.calls.argsFor(1)).toContain('b')
      expect(format.handleToken.calls.argsFor(2)).toContain('c')
    })

    it('passes its definitions as a second argument to handleToken', () => {
      const definitions = { 'a': 'example' }
      const format = new Format('(a) (b) (c)...', definitions)
      spyOn(format, 'handleToken').and.callFake((token, defs) => token ? 'baz' : '')

      expect(format.expand()).toEqual('baz baz baz...')
      expect(format.handleToken).toHaveBeenCalledWith('a', definitions)
    })

    it('uses passed definitions object if this.definitions does not exist', () => {
      const definitions = { 'a': 'example' }
      const format = new Format('(a) (b) (c)...', definitions)

      spyOn(format, 'handleToken').and.callFake((token, defs) => token ? 'baz' : '')

      expect(format.expand(definitions)).toEqual('baz baz baz...')
      expect(format.handleToken).toHaveBeenCalledWith('a', definitions)
    })

    it('throws an error when this.definitions does not exist and no object is passed', () => {
      const format = new Format('(a)BC')
      expect(format.expand).toThrow(new Error('This.definitions does not exist and no definitions argument passed'));
    })
  }) //end 'expand'

  describe('handleToken', () => {
    beforeEach(() => {
      format = new Format('nothing')
    })

    it('throws an error when a token is not found in the definitions object', () => {
      //wrapper function because passing a method to expect().toThrow seems to cause issues:
      function badExpand() {
        return format.handleToken('a', { 'b': 'foo' })
      }

      expect(badExpand).toThrow(new Error('"a" not found in definitions'))
    })

    describe('when a token is a string', () => {
      //not sure this is the best way to test this 
      it('casts it into a format and expands it', () => {
        const definitions = { 'nest': '..a nest in a (tree)', 'tree': 'tree in a (bog)', 'bog': 'bog down in the valley, oh' }

        expect(format.handleToken('nest', definitions)).toEqual('..a nest in a tree in a bog down in the valley, oh')
      })
    })

    describe('when a token is itself a Format', () => {
      it('its expand method is called and the returned value added to result', () => {
        format = new Format('(a)', { 'a': 'recursive' })
        spyOn(format, 'expand').and.returnValue('recursive')

        format.handleToken('recurse', { 'recurse': format })

        expect(format.expand).toHaveBeenCalled()
      })

      it('passes the expand method this.definitions', () => {
        format = new Format('(a)', { 'a': 'recursive' })
        let definitions = { 'recurse': format }
        spyOn(format, 'expand').and.returnValue('recursive')

        format.handleToken('recurse', definitions)

        expect(format.expand).toHaveBeenCalledWith(definitions)
      })
    }) //end 'when a token is itself a Format'

    describe('when a token is a WeightedRandom', () => {
      it('calls the WeightedRandom choose method', () => {
        const wOpt = new WeightedRandom({ maple: 2, maypole: 2, catch: 1, carry: 2 })
        spyOn(wOpt, 'choose').and.callThrough()

        format.handleToken('Bast', { 'Bast': wOpt })

        expect(wOpt.choose).toHaveBeenCalled()
      })

      it('casts the result of choose into a format and expands it', () => {
        //not sure this is the best way to test this 
        const cities = new WeightedRandom({ '(NYC)': 1 })
        const definitions = { 'city': cities, 'NYC': 'New York City' }
        format = new Format('(city)', definitions)

        expect(format.handleToken('city', definitions)).toEqual('New York City')
      })
    }) //end 'when a token is a WeightedRandom'    
  }) //end 'handleToken
}) 
