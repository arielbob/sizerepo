import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navbar from './Navbar'
import Browse from './Browse/Browse'
import SearchPage from './SearchPage/SearchPage'
import NewPost from './NewPost/NewPost'
import PostPage from './PostPage/PostPage'

const Root = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Browse} />
        <Route path='/search' component={SearchPage} />
        <Route path='/post' component={NewPost} />
        <Route path='/posts/:id' component={PostPage} />
      </Switch>
    </Router>
  )
  return <NewPost />
}

export default Root
