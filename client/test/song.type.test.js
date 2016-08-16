/* globals describe, it */

const expect = require('expect.js')
const Song = require('../components/types/song')

const fixture = require('./fixtures/playlist')
const expectedNames = require('./fixtures/scrubbedNames')

describe('', () => {
  it('should scrub names', () => {
    fixture.playlist.forEach((song, i) => {
      var s = new Song(song)
      expect(s.artist).to.be(expectedNames[i][0])
      expect(s.title).to.be(expectedNames[i][1])
    })
  })
})
