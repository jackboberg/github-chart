const GHCal = require('..')
const Nock = require('nock')
const { Stream } = require('stream')
const { expect } = require('code')
const { test } = require('tap')

const username = 'jackboberg'
const colors = ['#eeeeee', '#ffee4a', '#ffc501', '#fe9600', '#03001c']

test('usage', (suite) => {
  suite.beforeEach((done) => {
    Nock.disableNetConnect()
    done()
  })

  suite.afterEach((done) => {
    Nock.enableNetConnect()
    done()
  })

  suite.test('exports a function', (t) => {
    expect(GHCal).to.be.a.function()
    t.end()
  })

  suite.test('returns a stream', (t) => {
    const stream = GHCal(username)

    expect(stream instanceof Stream).to.be.true()
    t.end()
  })

  suite.test('requires username as a string', (t) => {
    const invalid = [
      () => GHCal(),
      () => GHCal(1),
      () => GHCal(true),
      () => GHCal([ username ]),
      () => GHCal({ username })
    ]

    invalid.forEach((fn) => expect(fn).to.throw('username must be a string'))
    t.end()
  })

  suite.test('accepts an array of colors', (t) => {
    const fn = () => GHCal(username, colors)

    // TODO: test type, format, length
    expect(fn).to.not.throw()
    t.end()
  })

  suite.end()
})
