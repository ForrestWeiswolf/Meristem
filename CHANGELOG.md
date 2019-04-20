# 2.0.0 / 2018-11-02

- Format constructor checks that its arguments are valid

- Format constructor can be passed a settings object

- Settings can be used to change which characters separate a nonterminal from the rest of the Format string

- Added documentation with JSDoc, in addition to the instructions available in the readme.

- Private methods are now correctly prefixed with underscores

- Added a formal changelog

# 2.1.0 / 2019-01-22

- Update documentation to describe Format settings

- Format.expand can take settings as an argument

- Add inline optionals setting - defaults to false, but when set with an object containin `start`, `end`, and `probability` properties, Format.expand will randomly decide whether to include or ignore text in the format string if it is enclosed between `inlineOptionals.start` and `inlineOptionals.end`

- Refactor how Format handles settings

- Refactor several tests for Format

# 2.1.0 / 2019-04-20

- Not technically a new version, but I rewrote parts of the README.