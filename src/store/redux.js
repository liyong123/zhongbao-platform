import { connect as reduxConnect } from 'react-redux';
import { injectAsyncReducer } from './configureStore';

export function connect(statePath, reducer, ...props) {
  if (statePath && reducer) {
    injectAsyncReducer(statePath, reducer);
  }
  return reduxConnect(...props);
}
