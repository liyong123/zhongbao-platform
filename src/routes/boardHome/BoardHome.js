import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import { Button } from 'antd';

// import buttonStyle from '../../antdTheme/button/style/index.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './BoardHome.css';

// 状态名
const StateName = 'boardHome';

// 默认状态
const defaultState = {
  test: 'default',
};

// 页面类
class BoardHome extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
  };

  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  render() {
    return <div className={s.root}>后台页面</div>;
  }
}

// 状态映射
const mapState = state => ({
  layout: state.layout,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

// 功能组合
export default compose(
  withStyles(
    s,
    // buttonStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(BoardHome);
