const FS = require('fs')
const TD = require('testdouble')
const Through = require('through2')
const { Stream } = require('stream')
const { expect } = require('code')
const { test: describe } = require('tap')
const { getSVG, classifyLine } = TD.replace('../lib')

const GHCal = require('..')

const username = 'jackboberg'
const svgFixture = `${__dirname}/fixtures/contributions.svg`

const getStream = () => FS.createReadStream(svgFixture)

describe('usage', ({ beforeEach, afterEach, test, end }) => {
  beforeEach((done) => {
    TD.when(getSVG(username)).thenReturn(getStream())
    done()
  })

  afterEach((done) => {
    TD.reset()
    done()
  })

  test('exports a function', (t) => {
    expect(GHCal).to.be.a.function()
    t.end()
  })

  test('returns a stream', (t) => {
    const stream = GHCal(username)

    expect(stream instanceof Stream).to.be.true()
    t.end()
  })

  test('requires username as a string', (t) => {
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

  test('gets SVG from github', (t) => {
    GHCal(username)

    const { callCount, calls } = TD.explain(getSVG)

    expect(callCount).to.equal(1)
    expect(calls[0].args[0]).to.equal(username)
    t.end()
  })

  test('classifies each line', (t) => {
    const stream = Through(
      (chunk, enc, next) => next(null, chunk), // transform is a noop
      (done) => {
        const { callCount } = TD.explain(classifyLine)

        expect(callCount).to.equal(1494) // lines in fixture
        done()
        t.end()
      }
    )

    GHCal(username).pipe(stream)
  })

  end()
})
