import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './components/Root'

import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
// import rootReducer from './reducers'

// import normalize from 'normalize.css'
import './styles/style.scss'

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
