import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { name, version } from '../../package.json';
import createRootReducer from '../reducers';
import createHelpers from './createHelpers';
import createLogger from './logger';

let _injectAsyncReducer;
let _getAsyncReducer;
let _getStore;

export default function configureStore(initialState, helpersConfig) {
  const helpers = createHelpers(helpersConfig);
  const middleware = [thunk.withExtraArgument(helpers)];

  let enhancer;

  if (__DEV__) {
    middleware.push(createLogger());

    const composeEnhancers = composeWithDevTools({
      name: `${name}@${version}`,
    });

    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const rootReducer = createRootReducer({});
  const store = createStore(rootReducer, initialState, enhancer);
  store.asyncReducers = {};

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('../reducers', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers').default),
    );
  }

  _injectAsyncReducer = (name, ...asyncReducers) => {
    let rootReducer = store.asyncReducers[name];
    if (!rootReducer) {
      store.asyncReducers[name] = (state, action) => {
        store.asyncReducers[name].reducers.forEach(reducer => {
          state = reducer(state, action);
        });
        return state;
      };
      rootReducer = store.asyncReducers[name];
    } else {
      console.warn(`Reducer named '${name}' has exit.`);
      return;
    }

    let { reducers } = rootReducer;
    if (!reducers) {
      rootReducer.reducers = [];
      reducers = rootReducer.reducers;
    }

    asyncReducers.forEach(asyncReducer => {
      if (reducers.indexOf(asyncReducer) === -1) {
        reducers.push(asyncReducer);
      }
    });

    store.replaceReducer(
      createRootReducer({
        ...store.asyncReducers,
      }),
    );
  };

  _getAsyncReducer = name => store.asyncReducers[name];

  _getStore = () => store;

  return store;
}

export function injectAsyncReducer(name, ...asyncReducers) {
  _injectAsyncReducer(name, ...asyncReducers);
}

export function getAsyncReducer(name) {
  return _getAsyncReducer(name);
}

export function getStore() {
  return _getStore();
}
