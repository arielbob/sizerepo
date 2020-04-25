import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navbar from './Navbar/Navbar'
import Browse from '../views/Browse/Browse'
import SearchPage from '../views/SearchPage/SearchPage'
import NewPost from '../views/NewPost/NewPost'
import PostPage from '../views/PostPage/PostPage'
import { UNITS } from '../../common/constants';

interface RootState {
  units: UNITS
}

class Root extends React.Component<{}, RootState> {
  constructor(props) {
    super(props)
    this.state = {
      units: UNITS.METRIC
    }
  }

  handleUnitsChange(units: UNITS) {
    this.setState({ units })
    console.log('units changed to', units)
  }

  render () {
    return (
      <Router>
        <div className='text-gray-900'>
          <Navbar onUnitsChange={(units: UNITS) => this.handleUnitsChange(units)}/>
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
