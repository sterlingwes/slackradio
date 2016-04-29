module.exports = {
  songTitle: {
    // common tags in video titles
    // order by most to less specific
    removable: [
      'Official Video',
      'Official Music Video',
      'Official Version',
      'Original Mix',
      'Official Audio',
      'Lyric Video',
      'Music Video',
      'HQ Audio',
      'Lyrics',
      'Lyric',
      'Audio',
      'Official',
      'Original',
      'HD'
    ]
  },

  messages: {
    unknown: ['error', 'Something happened. Not sure what. We need better messaging!'],
    connectionLost: ['warn', 'Unable to connect to SlackRadio, retrying...']
  }
}
