import mergeWith from 'lodash/mergeWith'; // eslint-disable-line
import set from 'lodash.set';

const forceArr = (objValue, srcValue) => {
  if (Array.isArray(srcValue)) {
    return srcValue;
  } else if (
    Array.isArray(objValue) &&
    typeof srcValue === 'object' &&
    srcValue !== null
  ) {
    let isFind = false;
    Object.keys(srcValue).forEach(p => {
      if (/\d*/.test(p)) {
        isFind = true;
        if (Array.isArray(objValue[p])) {
          objValue[p] = mergeWith([], objValue[p], srcValue[p], forceArr);
        } else {
          objValue[p] = mergeWith({}, objValue[p], srcValue[p], forceArr);
        }
      }
    });
    return isFind ? objValue : srcValue;
  }
};

const reducers = new Map();
export function commonReducer(type, defaultValue = {}) {
  let reducer;
  if (reducers.has(type)) {
    reducer = reducers.get(type);
  } else {
    reducer = (state, action) => {
      if (state === undefined) return defaultValue;
      switch (true) {
        case new RegExp(`^${type}$`).test(action.type):
        case new RegExp(`^${type}_`).test(action.type): // eslint-disable-line
          let newOne;
          if (action.payload === undefined) {
            newOne = defaultValue;
          } else if (action.payload === null) {
            newOne = null;
          } else {
            newOne = mergeWith({}, state, action.payload, forceArr);
          }
          return newOne;
        case new RegExp(`^${type}\.`).test(action.type): // eslint-disable-line
          const path = action.isGlobal
            ? action.type.replace(/^\w*\./, '')
            : action.type;
          if (action.payload === null) {
            newOne = set({}, path, defaultValue);
          } else {
            const newValue = set({}, path, action.payload);
            newOne = mergeWith({}, state, newValue, forceArr);
          }
          return newOne;
        default:
          return state;
      }
    };

    reducers.set(type, reducer);
  }
  return reducer;
}
