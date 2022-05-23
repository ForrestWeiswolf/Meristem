declare module 'meristem' {
  type WeightedOption = {
    0: any,
    1: number
  }

  type WeightedOptionMap = {
    [key in any]: number
  }

  type Definitions = {
    [key: string]: Format | WeightedRandom | FrozenRandom | string
  }
  export class WeightedRandom {
    constructor(options: WeightedOptionMap)
    constructor(...options: Array<WeightedOption>)

    choose: () => any;
  }

  export class FrozenRandom {
    constructor(options: WeightedOptionMap)
    constructor(...options: Array<WeightedOption>)

    choose: () => any;
  }
  export class Format {
    constructor(formatString: string, definitions?: Definitions)

    expand: (definitions?: Definitions) => string;
  }
}
