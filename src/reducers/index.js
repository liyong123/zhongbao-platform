import { combineReducers } from 'redux';
import runtime from './runtime';

export default function createRootReducer(reducers) {
  return combineReducers({
    ...reducers,
    runtime,
  });
}
