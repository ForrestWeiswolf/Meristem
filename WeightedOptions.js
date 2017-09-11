function WeightedOptions(options = {}) {
  this.options = options
}

WeightedOptions.prototype.getTotalWeight = function() {
  const keys = Object.keys(this.options)

  return keys.reduce((sum, key) => {
    return this.options[key] + sum
  }, 0)
};

WeightedOptions.prototype.choose = function() {
  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  if (this.getTotalWeight() === 0){
    return null
  }

  for (var key in this.options){
    count += this.options[key]
    if(count > rand){
      return key
    }
  }
};

// module.exports = WeightedOptions

const opt = new WeightedOptions({a: 1, b: 2, c: 3})
let results = {}
let rand

for (var i = 0; i < 500; i++){
  rand = opt.choose()
  results[rand] = results[rand] + 1 || 1
}

console.log(results)
