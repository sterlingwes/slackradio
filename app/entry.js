import riot from 'riot'
import ReduxMixin from './store/riotRedux.mixin'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import createLogger from './utils/logger'

import playlistReducer from './store/playlist.reducer'
import statsReducer from './store/stats.reducer'
import windowReducer from './store/window.reducer'

import './fonts/fonts.scss'
import './playlist/loader.scss'
import './player/player.scss'
import './player/player.tag.html'
import './playlist/playlist.tag.html'
import './player/track-circle.tag.html'
import './player/pie.tag.html'

var RootReducer = combineReducers({
  songs: playlistReducer.fn,
  stats: statsReducer.fn,
  window: windowReducer.fn
})

var logger = createLogger({
  ignore: ['song progress']
})

var Store = ReduxMixin(
  createStore(
    RootReducer,
    {},
    applyMiddleware(logger)
  )
)

window.SlackRadio.registerStore(Store)
playlistReducer.init(Store)
statsReducer.init(Store)
windowReducer.init(Store)

riot.mount('player')
riot.mount('playlist')

riot.route.base('/')
riot.route.start(true)
