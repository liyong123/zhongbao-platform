/* eslint-disable import/prefer-default-export */
import { SET_RUNTIME_VARIABLE } from '../constants';

export function commonAction(type) {
  /**
   * 支持三种格式
   * 1，commonAction(value, type1, isGlobal); 当向别的页面发送事件时，type1应为：${目标页面StateName}(_type1)?
   * 2，commonAction(value, {type, isGlobal});
   * 3, commonAction(callback(dispatch, getState, { client, history }), type1, isGlobal);
   */
  return (value, p1, p2) => async (dispatch, getState, { client, history }) => {
    let type1;
    let isGlobal;
    let options = {};
    if (typeof p1 === 'boolean') {
      throw new Error(`CommonAction'isGlobal muse be third arg.`);
    }
    if (typeof p1 === 'string') {
      type1 = p1;
      isGlobal = p2;
    } else {
      options = p1 || {};
      type1 = options.type;
      isGlobal = options.isGlobal;
    }
    let newState = null;
    if (typeof value === 'function') {
      value = value(dispatch, getState, { client, history });
    } else if (value !== null) {
      if (isGlobal && type1.startsWith('runtime.')) {
        newState = {
          name: type1.match(/runtime\.(\w*)/)[1],
          value,
        };
        type1 = SET_RUNTIME_VARIABLE;
      } else {
        newState = value;
      }
    }
    dispatch({
      type: isGlobal ? type1 : `${type}_${type1}`,
      payload: newState,
      isGlobal,
    });
  };
}
