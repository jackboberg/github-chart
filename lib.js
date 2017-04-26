const Request = require('request')

exports.getSVG = (username) => {
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

exports.classifyLine = (line) => Object.keys(colors).reduce(reducer, line)

const colors = exports.colors = {
  '#ebedf0': 'lightest',
  '#c6e48b': 'lighter',
  '#7bc96f': 'normal',
  '#239a3b': 'darker',
  '#196127': 'darkest'
}

const reducer = (out, key) => {
  if (!out.includes(key)) return out

  return out.replace(/class="(.*?)"/g, `class="$1 ${colors[key]}"`)
}
