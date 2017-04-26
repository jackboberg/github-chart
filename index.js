const Assert = require('assert')
const Split = require('split2')
const Through = require('through2')
const { EOL } = require('os')
const { getSVG, classifyLine } = require('./lib')

module.exports = (username, colors) => {
  Assert(isString(username), 'username must be a string')

  return getSVG(username)
    .pipe(Split())
    .pipe(Through(classify))
}

const isString = (value) => typeof value === 'string'

const classify = (chunk, encoding, done) => {
  process.nextTick(done, null, `${classifyLine(chunk.toString())}${EOL}`)
}
