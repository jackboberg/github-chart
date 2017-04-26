const Concat = require('concat-stream')
const FS = require('fs')
const Nock = require('nock')
const { expect } = require('code')
const { test: describe } = require('tap')

const { getSVG } = require('../lib')

const username = 'jackboberg'
const svgFixture = `${__dirname}/fixtures/contributions.svg`

describe('getSVG', ({ beforeEach, afterEach, test, end }) => {
  let nock, svg

  beforeEach((done) => {
    Nock.disableNetConnect()
    nock = Nock('https://github.com')
      .get(`/users/${username}/contributions`)
    FS.readFile(svgFixture, (err, data) => {
      if (err) return done(err)

      svg = data
      done()
    })
  })

  afterEach((done) => {
    Nock.enableNetConnect()
    done()
  })

  test('steams contribution calendar svg', (t) => {
    const gotSvg = (data) => {
      expect(data).to.equal(svg)
      t.end()
    }

    nock.reply(200, getStream)
    getSVG(username).pipe(Concat(gotSvg))
  })

  test('emits error if request fails', (t) => {
    const error = 'request errored'

    nock.replyWithError(error)
    getSVG(username).on('error', (err) => {
      expect(err.message).to.equal(error)
      t.end()
    })
  })

  test('emits error if not found', (t) => {
    // FIXME: nock does not support setting status messages
    nock.reply(404, { statusMessage: 'Not Found' })
    getSVG(username).on('error', (err) => {
      expect(err).to.exist()
      // expect(err.message).to.equal('Not Found')
      t.end()
    })
  })

  end()
})

const getStream = () => FS.createReadStream(svgFixture)
