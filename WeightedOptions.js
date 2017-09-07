function WeightedOptions(options = {}) {
  this.options = options
}

WeightedOptions.prototype.getTotalWeight = function() {
  const keys = Object.keys(this.options)

  return keys.reduce((sum, key) => {
    return this.options[key] + sum
  }, 0)
};

// module.exports = WeightedOptions
