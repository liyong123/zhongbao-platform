import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';

import messageStyle from '../../antdTheme/message/style/index.less'; // eslint-disable-line
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './OldOp.css';

// 状态名
const StateName = 'oldOp';

// 默认状态
const defaultState = {};

// 页面类
class OldOp extends React.Component {
  static contextTypes = {
    history: PropTypes.any,
  };

  render() {
    const { runtime: { config: { oldOpUrl }, currentMenu } } = this.props;
    const url = get(currentMenu, 'oldOpUrl', '').replace('{OLD_OP}', oldOpUrl);
    return (
      <div className={s.root}>
        <iframe
          className={s.iframe}
          title="oldOp"
          style={{ width: '100%', height: '100%' }}
          src={url}
        />
      </div>
    );
  }
}

// 状态映射
const mapState = state => ({
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

// 功能组合
export default compose(
  withStyles(s, messageStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(OldOp);
