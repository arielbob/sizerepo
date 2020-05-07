import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './components/Root'
import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from './env'

import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
// import rootReducer from './reducers'

// import normalize from 'normalize.css'
import './styles/style.scss'

ReactGA.initialize(GA_TRACKING_ID)

const loggerMiddleware = createLogger()
const store = createStore(
  // rootReducer,
  (state, action) => state,
  applyMiddleware(
    thunk,
    loggerMiddleware
  )
)

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)
