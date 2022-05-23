declare module 'meristem' {
  type WeightedOption = {
    0: any,
    1: number
  }

  type WeightedOptionMap = {
    [key: any]: number
  }

  type Definitions = {
    [key: string]: Format | WeightedRandom | string
  }
  export class WeightedRandom {
    constructor(options: WeightedOptionMap)
    constructor(...options: Array<WeightedOption>)

    choose: () => any;
  }

  export class FrozenRandom extends WeightedRandom
  export class Format {
    constructor(formatString: string, definitions?: Definitions)

    expand: (definitions?: Definitions) => string;
  }
}
