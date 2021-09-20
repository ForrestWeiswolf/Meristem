type WeightedOption = {
  0: any,
  1: number
}

declare module 'meristem' {
  export class WeightedRandom {
    constructor(options: {})
    constructor(...options: Array<WeightedOption>)

    choose: () => any;
  }

  export class FrozenRandom extends WeightedRandom
}
