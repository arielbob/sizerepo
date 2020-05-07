import React from 'react'
import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';
import { createBrowserHistory } from 'history'
import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from '../env'
import Navbar from './Navbar/Navbar'
import Browse from '../views/Browse/Browse'
import SearchPage from '../views/SearchPage/SearchPage'
import NewPost from '../views/NewPost/NewPost'
import PostPage from '../views/PostPage/PostPage'
import { UNITS } from '../../common/constants'

ReactGA.initialize(GA_TRACKING_ID)

const history = createBrowserHistory()
let prevLocationStr = history.location.pathname + history.location.search
ReactGA.set({ page: prevLocationStr }) // Update the user's current page
ReactGA.pageview(prevLocationStr) // Record a pageview for the given page

history.listen(location => {
  const locationStr = location.pathname + location.search
  // don't log navigation to same route
  if (locationStr == prevLocationStr) return 
  
  prevLocationStr = locationStr
  ReactGA.set({ page: locationStr })
  ReactGA.pageview(locationStr)
})

interface RootState {
  units: UNITS
}

class Root extends React.Component<any, RootState> {
  constructor(props) {
    super(props)
    const storedUnits = localStorage.getItem('units')
    this.state = {
      units: (storedUnits in UNITS) ? UNITS[storedUnits] : UNITS.METRIC
    }
  }

  handleUnitsChange(units: UNITS) {
    this.setState({ units })
    localStorage.setItem('units', units.toUpperCase())
  }

  render () {
    return (
      <Router history={history}>
        <div className='text-gray-900'>
          <Navbar units={this.state.units} onUnitsChange={(units: UNITS) => this.handleUnitsChange(units)}/>
          <Switch>
              <Route exact path='/' render={
                (props) => <Browse {...props} units={this.state.units} />
              } />
              <Route path='/search' render={
                (props) => <SearchPage {...props} units={this.state.units} />
              } />
              <Route path='/post' component={NewPost} />
              <Route path='/posts/:id' render={
                (props) => <PostPage {...props} units={this.state.units} />
              } />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default Root
