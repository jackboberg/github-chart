const Assert = require('assert')
const Request = require('request')
const OS = require('os')
const Split = require('split2')
const Through = require('through2')

module.exports = (username, colors) => {
  Assert(isString(username), 'username must be a string')

  const stream = getSVG(username)

  if (!colors) return stream

  return stream
    .pipe(Split())
    .pipe(Through(recolor(colors)))
}

const isString = (value) => typeof value === 'string'

const getSVG = (username) => {
  const url = `https://github.com/users/${username}/contributions`
  const options = { timeout: 1500 }
  const request = Request.get(url, options)

  request.on('response', (response) => {
    if (response.statusCode === 200) return

    const err = new Error(response.statusMessage)
    process.nextTick(() => request.emit('error', err))
  })

  return request
}

const recolor = (colors) => (chunk, encoding, done) => {
  const ghColors = [ '#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127' ]
  const reducer = (out, color, index) => out.replace(ghColors[index], color)
  const line = colors.reduce(reducer, chunk.toString())

  done(null, `${line}${OS.EOL}`)
}
