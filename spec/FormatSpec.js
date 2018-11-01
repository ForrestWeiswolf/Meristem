const { WeightedRandom, Format } = require('../index')

describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('can take a string and an optional non-empty object as arguments', () => {
      expect(new Format('(a)', { a: 'example' })).toBeDefined()
      expect(new Format('(a)')).toBeDefined()
    })

    it('Is a constructor', () => {
      const format = new Format('(a)', { a: 'example' })
      expect(typeof format).toEqual('object')
    })

    it('throws an error when no argument is passed', () => {
      function emptyConstructor() {
        return new Format()
      }

      expect(emptyConstructor).toThrow(
        new Error('No argument passed to Format constructor')
      )
    })

    it('throws an informative error when the first argument is not a string', () => {
      function objectConstructor() {
        return new Format({})
      }

      function numConstructor() {
        return new Format(72)
      }

      function nullConstructor() {
        return new Format(null)
      }

      expect(objectConstructor).toThrow(
        new Error('Format constructor was passed object instead of string')
      )
      expect(numConstructor).toThrow(
        new Error('Format constructor was passed number instead of string')
      )
      expect(nullConstructor).toThrow(
        new Error('Format constructor was passed null instead of string')
      )
    })

    it('throws an error if parens in first arg are mismatched', () => {
      function noClose() {
        return new Format('(a')
      }

      function noOpen() {
        return new Format('a)')
      }

      function closeBeforeOpen() {
        return new Format('a)(')
      }

      expect(noClose).toThrow(
        new Error('Format string includes "(" without matching ")"')
      )
      expect(noOpen).toThrow(
        new Error('Format string includes ")" without matching "("')
      )
      expect(closeBeforeOpen).toThrow(
        new Error('Format string includes ")" without matching "("')
      )
    })

    it('throws an error if there are empty parens in first arg', () => {
      function emptyParens() {
        return new Format('()')
      }

      expect(emptyParens).toThrow(
        new Error('Empty nonterminal in Format string')
      )
    })

    describe('when settings include separators other that parentheses', () => {
      it('throws an error if separators in first arg are mismatched', () => {
        function noClose() {
          return new Format(
            '{a',
            { a: 'foo' },
            { separators: { start: '{', end: '}' } }
          )
        }

        expect(noClose).toThrow(
          new Error('Format string includes "{" without matching "}"')
        )
      })

      it('throws an error if separators in first arg are empty', () => {
        function emptyBrackets() {
          return new Format(
            '{}',
            {},
            { separators: { start: '{', end: '}' } }
          )
        }

        expect(emptyBrackets).toThrow(
          new Error('Empty nonterminal in Format string')
        )
      })
    })
  }) // end 'constructor'

  describe('expand method', () => {
    it('is an instance method', () => {
      expect(typeof Format.prototype.expand).toEqual('function')
    })

    it('calls handleNonterminal on any parenthetical nonterminals, and replaces them with the returned value', () => {
      const format = new Format('(a) (b) (c)...', { a: 'example' })
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal, defs) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz baz baz...')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('b')
      expect(format._handleNonterminal.calls.argsFor(2)).toContain('c')
    })

    it('uses separators other than parentheses instead if they were passed as options to the constructor', () => {
      const format = new Format(
        '{a} (not a nonterminal anymore) {b}',
        { a: 'example' },
        { separators: { start: '{', end: '}' } }
      )
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal, defs) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz (not a nonterminal anymore) baz')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('b')
    })

    it('works if separators are more than one character long', () => {
      const format = new Format(
        '((a)) (not a nonterminal anymore) ((b))',
        { a: 'example' },
        { separators: { start: '((', end: '))' } }
      )
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal, defs) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz (not a nonterminal anymore) baz')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('b')
    })

    it('passes its definitions as a second argument to handleNonterminal', () => {
      const definitions = { a: 'example' }
      const format = new Format('(a) (b) (c)...', definitions)
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal, defs) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz baz baz...')
      expect(format._handleNonterminal).toHaveBeenCalledWith('a', definitions)
    })

    it('uses passed definitions object if this.definitions does not exist', () => {
      const definitions = { a: 'example' }
      const format = new Format('(a) (b) (c)...', definitions)

      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal, defs) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand(definitions)).toEqual('baz baz baz...')
      expect(format._handleNonterminal).toHaveBeenCalledWith('a', definitions)
    })

    it('throws an error when this.definitions does not exist and no object is passed', () => {
      const format = new Format('(a)BC')
      expect(format.expand).toThrow(
        new Error(
          'This.definitions does not exist and no definitions argument passed'
        )
      )
    })
  }) // end 'expand'

  describe('handleNonterminal', () => {
    beforeEach(() => {
      format = new Format('nothing')
    })

    it('throws an error when a nonterminal is not found in the definitions object', () => {
      // wrapper function because passing a method to expect().toThrow seems to cause issues:
      function badExpand() {
        return format._handleNonterminal('a', { b: 'foo' })
      }

      expect(badExpand).toThrow(new Error('"a" not found in definitions'))
    })

    describe('when a nonterminal is a string', () => {
      // not sure this is the best way to test this
      it('casts it into a format and expands it', () => {
        const definitions = {
          nest: '..a nest in a (tree)',
          tree: 'tree in a (bog)',
          bog: 'bog down in the valley, oh',
        }

        expect(format._handleNonterminal('nest', definitions)).toEqual(
          '..a nest in a tree in a bog down in the valley, oh'
        )
      })
    })

    describe('when a nonterminal is itself a Format', () => {
      it('its expand method is called and the returned value added to result', () => {
        format = new Format('(a)', { a: 'recursive' })
        spyOn(format, 'expand').and.returnValue('recursive')

        format._handleNonterminal('recurse', { recurse: format })

        expect(format.expand).toHaveBeenCalled()
      })

      it('passes the expand method this.definitions', () => {
        format = new Format('(a)', { a: 'recursive' })
        let definitions = { recurse: format }
        spyOn(format, 'expand').and.returnValue('recursive')

        format._handleNonterminal('recurse', definitions)

        expect(format.expand).toHaveBeenCalledWith(definitions)
      })
    }) // end 'when a nonterminal is itself a Format'

    describe('when a nonterminal is a WeightedRandom', () => {
      it('calls the WeightedRandom choose method', () => {
        const wOpt = new WeightedRandom({
          maple: 2,
          maypole: 2,
          catch: 1,
          carry: 2,
        })
        spyOn(wOpt, 'choose').and.callThrough()

        format._handleNonterminal('Bast', { Bast: wOpt })

        expect(wOpt.choose).toHaveBeenCalled()
      })

      it('casts the result of choose into a format and expands it', () => {
        // not sure this is the best way to test this
        const cities = new WeightedRandom({ '(NYC)': 1 })
        const definitions = { city: cities, NYC: 'New York City' }
        format = new Format('(city)', definitions)

        expect(format._handleNonterminal('city', definitions)).toEqual(
          'New York City'
        )
      })
    }) // end 'when a nonterminal is a WeightedRandom'
  }) // end 'handleNonterminal
})
