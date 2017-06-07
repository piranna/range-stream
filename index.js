const Transform = require('stream').Transform

const inherits = require('inherits')


class RangeStream extends Transform {
  constructor(start, end) {
    super()

    this._start = start
    this._end = typeof end === 'number' ? end + 1 : Infinity

    this._bytesReceived = 0
    this._lastByteFound = false
  }

  _transform(chunk, enc, next) {
    this._bytesReceived += chunk.length

    if (!this._lastByteFound && this._bytesReceived >= this._start) {
      if (this._start - (this._bytesReceived - chunk.length) > 0)
        chunk = chunk.slice(this._start - (this._bytesReceived - chunk.length))

      if (this._end <= this._bytesReceived) {
        this.push(chunk.slice(0, chunk.length - (this._bytesReceived - this._end)))
        this._lastByteFound = true
      } else
        this.push(chunk)
    }

    next()
  }
}


module.exports = RangeStream
