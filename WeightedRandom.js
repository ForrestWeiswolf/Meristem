function WeightedRandom(choices = {}) {
  this.choices = choices
}

WeightedRandom.prototype.getTotalWeight = function() {
  const keys = Object.keys(this.choices)

  return keys.reduce((sum, key) => {
    return this.choices[key] + sum
  }, 0)
};

WeightedRandom.prototype.choose = function() {
  const rand = Math.random() * this.getTotalWeight()
  let count = 0

  if (this.getTotalWeight() === 0){
    return null
  }

  for (var key in this.choices){
    count += this.choices[key]
    if(count > rand){
      return key
    }
  }
};

// module.exports = WeightedRandom

const opt = new WeightedRandom({a: 1, b: 2, c: 3})
let results = {}
let rand

for (var i = 0; i < 500; i++){
  rand = opt.choose()
  results[rand] = results[rand] + 1 || 1
}

console.log(results)
