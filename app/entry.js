import riot from 'riot'
import Reducer from './store/playlist.reducer'
import ReduxMixin from './store/riotRedux.mixin'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import createLogger from './utils/logger'

import './fonts/fonts.scss'
import './playlist/loader.scss'
import './player/player.scss'
import './player/player.tag'
import './playlist/playlist.tag'
import './player/audio.tag'
import './player/track-circle.tag'
import './player/pie.tag'

var RootReducer = combineReducers({
  songs: Reducer.fn
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

Reducer.init(Store)

riot.mount('player')
riot.mount('playlist')

riot.route.base('/')
riot.route.start(true)
