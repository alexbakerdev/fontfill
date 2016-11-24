exports.is = function (a, b, options) {
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
}
