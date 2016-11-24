describe('e2e - dist/fontfill.global.js', () => {
  it('Should create global variable fontfill', () => {
    // This loader query is important
    // `!!`` ignore all other loaders that would be applied
    // `script` loader executes the script once in the global name space
    require('!!script!dist/fontfill.global.js')
    expect(window.fontfill).to.exist
    delete window.fontfill
    expect(window.fontfill).to.not.exist
  })
})

describe('e2e - dist/fontfill.global.min.js', () => {
  it('Should create global variable fontfill', () => {
    // This loader query is important
    // `!!`` ignore all other loaders that would be applied
    // `script` loader executes the script once in the global name space
    require('!!script!dist/fontfill.global.min.js')
    expect(window.fontfill).to.exist
    delete window.fontfill
    expect(window.fontfill).to.not.exist
  })
})

describe('e2e - dist/fontfill.commonjs.js', () => {
  it('Should, without transpiling, load bundle as module with AutoFittingText class property', () => {
    // This loader query is important
    // `!!`` ignore all other loaders that would be applied
    const { AutoFittingText } = require('!!dist/fontfill.commonjs.js')
    expect(AutoFittingText).to.exist
  })
})

describe('e2e - dist/fontfill.commonjs.min.js', () => {
  it('Should, without transpiling, load bundle as module with AutoFittingText class property', () => {
    // This loader query is important
    // `!!`` ignore all other loaders that would be applied
    const { AutoFittingText } = require('!!dist/fontfill.commonjs.js')
    expect(AutoFittingText).to.exist
  })
})

describe('e2e - dist/index.js', () => {
  it('Should, without transpiling, load as module with AutoFittingText class property', () => {
    // This loader query is important
    // `!!`` ignore all other loaders that would be applied
    // so we don't recompile.
    const { AutoFittingText } = require('!!dist/index.js')
    expect(AutoFittingText).to.exist
  })
})

describe('e2e - src/index.js', () => {
  it('Should load as module, with AutoFittingText class by transpiling', () => {
    const { AutoFittingText } = require('src/index.js')
    expect(AutoFittingText).to.exist
  })
})
