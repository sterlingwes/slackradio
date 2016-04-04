// require('./api')

import riot from 'riot'
import ReduxMixin from './store/riotRedux.mixin'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import createLogger from './utils/logger'

import appReducer from './store/app.reducer'
import radioReducer from './store/radio.reducer'
import playlistReducer from './store/playlist.reducer'
import statsReducer from './store/stats.reducer'
import windowReducer from './store/window.reducer'

import './fonts/fonts.scss'
import './fonts/icons.scss'
import './player/player.scss'

import './layout/pages.tag.html'
import './layout/panel.tag.html'
import './layout/panelSection.tag.html'

import './player/player.tag.html'
import './player/track-circle.tag.html'
import './player/pie.tag.html'

import './playlist/playlist.tag.html'
import './radio/radio.tag.html'
import './settings/settings.tag.html'

import './widgets/loader.scss'
import './widgets/loadingBars.tag.html'
import './widgets/loadingCircles.tag.html'

var RootReducer = combineReducers({
  app: appReducer.fn,
  radio: radioReducer.fn,
  userSongs: playlistReducer.fn,
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
appReducer.init(Store)
radioReducer.init(Store)
playlistReducer.init(Store)
statsReducer.init(Store)
windowReducer.init(Store)

riot.mount('player')
riot.mount('pages')
