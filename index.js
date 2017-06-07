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
    if(this._lastByteFound) return next()

    let consumed = this._bytesReceived + chunk.length
    if (consumed >= this._start) {
      let remaining = this._start - this._bytesReceived
      if (remaining > 0) chunk = chunk.slice(remaining)

      let overconsumed = consumed - this._end
      if (overconsumed >= 0) {
        if (overconsumed) chunk = chunk.slice(0, chunk.length - overconsumed)
        this._lastByteFound = true
      }

      this.push(chunk)
    }

    this._bytesReceived = consumed
    next()
  }
}


module.exports = RangeStream
