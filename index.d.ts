declare module 'meristem' {
  type WeightedOption = {
    0: any,
    1: number
  }

  export class WeightedRandom {
    constructor(options: {})
    constructor(...options: Array<WeightedOption>)

    choose: () => any;
  }

  type Definitions = {
    [key: string]: Format | WeightedRandom | string
  }

  export class FrozenRandom extends WeightedRandom

  export class Format {
    constructor(formatString: string, definitions?: Definitions)

    expand: (definitions?: Definitions) => string;
  }
}
