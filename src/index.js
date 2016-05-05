import ReactDOM from 'react-dom'
import React, { PropTypes } from 'react'
import { useRouterHistory, Router, Route, IndexRoute, Redirect } from 'react-router'
import { createHistory } from 'history'
import injectTapEventPlugin from 'react-tap-event-plugin';
import "babel-polyfill";
import { Provider } from 'react-redux'
// import materialCustomTheme from '../styles/materialCustomTheme';
//import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { applyMiddleware, compose, createStore } from 'redux'
import { syncHistory } from 'redux-simple-router'
import thunk from 'redux-thunk'
import { persistState } from 'redux-devtools';
import rootReducer from './redux'
import App from './containers/App';

var routes = <Route path='*' component={App}>
  </Route>

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

function withDevTools (middleware) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : require('./containers/DevTools').instrument()
  return compose(middleware, devTools, persistState(getDebugSessionKey()))
}


function configureStore ({ initialState = {}, history }) {
  // Sync with router via history instance (main.js)
  const routerMiddleware = syncHistory(history)

  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk, routerMiddleware)
  if (process.env.NODE_ENV !== 'production') middleware = withDevTools(middleware)

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState)
  if (process.env.NODE_ENV !== 'production') routerMiddleware.listenForReplays(store, ({ router }) => router)

  if (module.hot) {
    module.hot.accept('./redux', () => {
      const nextRootReducer = require('./redux').default

      store.replaceReducer(nextRootReducer)
    })
  }

  if (process.env.NODE_ENV !== 'production') window.__redux_store__ = store

  return store
}


class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  };

  // getChildContext() {
  //   return {
  //     muiTheme: ThemeManager.getMuiTheme(materialCustomTheme),
  //   };
  // }


  get content () {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    )
  }

  get devTools () {
    if (process.env.NODE_ENV !== 'production') {
      if (false) {
        if (!window.devToolsExtension) {
          require('../redux/utils/createDevToolsWindow')(this.props.store)
        } else {
          window.devToolsExtension.open()
        }
      } else if (!window.devToolsExtension) {
        const DevTools = require('./containers/DevTools')
        return <DevTools />
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    )
  }
}

Root.childContextTypes = {
    muiTheme: React.PropTypes.object,
  };


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const historyConfig = { basename: '' }
const history = useRouterHistory(createHistory)(historyConfig)

const initialState = window.__INITIAL_STATE__
const store = configureStore({ initialState, history })
const DOMNodeToRenderTo = document.createElement('div');
document.body.appendChild(DOMNodeToRenderTo);
// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  DOMNodeToRenderTo
)
// ReactDOM.render(
//   <div>Heeelllo world!</div>,
//   DOMNodeToRenderTo
// )
