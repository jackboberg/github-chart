const { expect } = require('code')
const { test: describe } = require('tap')
const { classifyLine, colors } = require('../lib')

const getLine = (color = 'red') => `<rect class="day" fill="${color}" />`

describe('classifyDay', ({ test, plan }) => {
  plan(1)

  test('adds class when color is present', (t) => {
    Object.keys(colors).forEach((color, index) => {
      const out = classifyLine(getLine(color))

      expect(out).to.include(`class="day ${colors[color]}"`)
    })
    t.end()
  })

  test('does not modify class if color not present', (t) => {
    const out = classifyLine(getLine())

    expect(out).to.include(`class="day"`)
  })
})
