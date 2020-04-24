import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navbar from './Navbar/Navbar'
import Browse from './Browse/Browse'
import SearchPage from './SearchPage/SearchPage'
import NewPost from './NewPost/NewPost'
import PostPage from './PostPage/PostPage'
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
        <Navbar onUnitsChange={(units: UNITS) => this.handleUnitsChange(units)}/>
        <Switch>
          <Route exact path='/' render={
            (props) => <Browse {...props} units={this.state.units} />
          } />
          <Route path='/search' component={SearchPage} />
          <Route path='/post' component={NewPost} />
          <Route path='/posts/:id' render={
            (props) => <PostPage {...props} units={this.state.units} />
          } />
        </Switch>
      </Router>
    )
  }
}

export default Root
