declare module 'meristem' {
  type WeightedOption<T> = {
    0: T,
    1: number
  }

  type WeightedOptionMap = {
    [key in any]: number
  }

  type Definitions = {
    [key: string]: Format | WeightedRandom<any> | FrozenRandom<any> | string
  }
  export class WeightedRandom<T> {
    constructor(options: WeightedOptionMap)
    constructor(...options: Array<WeightedOption<T>>)

    choose: () => T;
  }

  export class FrozenRandom<T> {
    constructor(options: WeightedOptionMap)
    constructor(...options: Array<WeightedOption<T>>)

    choose: () => T;
  }
  export class Format {
    constructor(formatString: string, definitions?: Definitions)

    expand: (definitions?: Definitions) => string;
  }
}
