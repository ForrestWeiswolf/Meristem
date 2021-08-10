const { WeightedRandom, Format } = require('../src/index')

describe('Format', () => {
  describe('constructor', () => {
    it('Is a function', () => {
      expect(typeof Format).toEqual('function')
    })

    it('can take a string or an optional non-empty object as arguments', () => {
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

    it('throws an error if separators aren\'t strings', () => {
      function badSeparator() {
        return new Format('(a)', { a: 'a' }, { separators: { start: null, end: '>' } })
      }

      expect(badSeparator).toThrow(
        new Error('Separators must be strings (was null)')
      )
    })
  }) // end 'constructor'

  describe('.expand', () => {
    const exampleDefinitions = { a: 'example' }
    let format

    beforeEach(() => {
      format = new Format('(a) (a) (a)...', exampleDefinitions)
    })

    it('is an instance method', () => {
      expect(typeof Format.prototype.expand).toEqual('function')
    })

    it('calls handleNonterminal on any parenthetical nonterminals, and replaces them with the returned value', () => {
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz baz baz...')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(2)).toContain('a')
    })

    it('uses separators other than parentheses instead if they were passed as options to the constructor', () => {
      format = new Format(
        '{a} (not a nonterminal anymore) {b}',
        { a: 'example' },
        { separators: { start: '{', end: '}' } }
      )
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz (not a nonterminal anymore) baz')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('b')
    })

    it('works if separators are more than one character long', () => {
      format = new Format(
        '((a)) (not a nonterminal anymore) ((b))',
        { a: 'example' },
        { separators: { start: '((', end: '))' } }
      )
      spyOn(format, '_handleNonterminal').and.callFake(
        (nonterminal) => (nonterminal ? 'baz' : '')
      )

      expect(format.expand()).toEqual('baz (not a nonterminal anymore) baz')
      expect(format._handleNonterminal.calls.argsFor(0)).toContain('a')
      expect(format._handleNonterminal.calls.argsFor(1)).toContain('b')
    })

    describe('if constructor set inlineOptionals setting', () => {
      it('includes text inside an inline optional normally when probability is 1', () => {
        format = new Format(
          '(a)bc',
          { a: 'example' },
          {
            separators: { start: '{', end: '}' },
            inlineOptionals: { start: '(', end: ')', probability: 1 },
          }
        )

        expect(format.expand()).toEqual('abc')
      })

      it('ignores text in an inline optional when probability is 0', () => {
        format = new Format(
          '(a)bc',
          { a: 'example' },
          {
            separators: { start: '{', end: '}' },
            inlineOptionals: { start: '(', end: ')', probability: 0 },
          }
        )

        expect(format.expand()).toEqual('bc')
      })

      it('includes text in an inline optional with correct probability', () => {
        format = new Format(
          '(a)bc',
          {},
          {
            separators: { start: '{', end: '}' },
            inlineOptionals: { start: '(', end: ')', probability: 0.3 },
          }
        )

        let count = 0
        for (let i = 0; i < 10000; i++) {
          if (format.expand() === 'abc') {
            count++
          }
        }

        expect(count).toBeCloseTo(3000, -3)
      })

      it('handles nonterminals inside inline optionals', () => {
        format = new Format(
          '({a} )bc',
          exampleDefinitions,
          {
            separators: { start: '{', end: '}' },
            inlineOptionals: { start: '(', end: ')', probability: 1 },
          }
        )

        expect(format.expand()).toEqual('example bc')
      })

      it('handles inline optionals inside nonterminals', () => {
        format = new Format(
          '{a}bc',
          { a: '(A)-' },
          {
            separators: { start: '{', end: '}' },
            inlineOptionals: { start: '(', end: ')', probability: 0.5 },
          }
        )

        const results = []
        for (let i = 0; i < 20; i++) {
          results.push(format.expand())
        }

        expect(results).toContain('A-bc')
        expect(results).toContain('-bc')
      })
    })

    it('passes its definitions as second arg to handleNonterminal', () => {
      const settings = { separators: { start: '{', end: '}' } }
      format = new Format('{a}...', exampleDefinitions, settings)
      spyOn(format, '_handleNonterminal')

      format.expand()
      expect(format._handleNonterminal.calls.argsFor(0)[1]).toBe(exampleDefinitions)
    })

    it('passes its settings as third arg to handleNonterminal', () => {
      const settings = { separators: { start: '{', end: '}' } }
      format = new Format('{a}...', exampleDefinitions, settings)
      spyOn(format, '_handleNonterminal')

      format.expand()

      /* The format constructor sets some settings to defaults if thety weren't in the
      constructor, so we can't just test that it equals the settings we passed. */
      expect(format._handleNonterminal.calls.argsFor(0)[2]).toEqual(format._settings)
    })

    it('uses passed definitions object if this.definitions does not exist', () => {
      spyOn(format, '_handleNonterminal').and.callThrough()

      expect(format.expand(exampleDefinitions)).toEqual('example example example...')
      expect(format._handleNonterminal.calls.argsFor(0)[1]).toBe(exampleDefinitions)
    })

    it('lets properties of passed settings override this._settings', () => {
      format = new Format('{a} (a)', exampleDefinitions, { separators: { start: '{', end: '}' } })

      expect(format.expand(exampleDefinitions, { separators: { start: '(', end: ')' } })).toEqual('{a} example')
    })

    it('uses properties of this._settings if not overridden', () => {
      format = new Format('{a} (a)', exampleDefinitions, { separators: { start: '(', end: ')' } })

      expect(format.expand(exampleDefinitions, { inlineOptionals: { start: '<', end: '>', probability: 0 } })).toEqual('{a} example')
    })

    it('throws an error when this.definitions does not exist and no object is passed', () => {
      format = new Format('(a)BC')
      expect(format.expand).toThrow(
        new Error(
          'This.definitions does not exist and no definitions argument passed'
        )
      )
    })
  }) // end 'expand'

  describe('handleNonterminal', () => {
    let format
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

      it('passes the expand method definitions', () => {
        format = new Format('(a)', { a: 'recursive' })
        spyOn(format, 'expand').and.returnValue('recursive')

        const definitions = { recurse: format }

        format._handleNonterminal('recurse', definitions)

        expect(format.expand.calls.argsFor(0)[0]).toBe(definitions)
      })

      it('passes the expand method settings', () => {
        format = new Format('(a)', { a: 'recursive' })
        spyOn(format, 'expand').and.returnValue('recursive')

        const definitions = { recurse: format }
        const settings = { inlineOptionals: { start: '(', end: ')', probability: 0.5 } }

        format._handleNonterminal('recurse', definitions, settings)

        expect(format.expand.calls.argsFor(0)[1]).toBe(settings)
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
