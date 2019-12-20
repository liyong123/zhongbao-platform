import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { message } from 'antd';

import messageStyle from '../../antdTheme/message/style/index.less'; // eslint-disable-line
import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './SamplePage.css';

// 状态名
const StateName = 'samplePage';

// 默认状态
const defaultState = {
  test: 'default',
  refreshKey: undefined,
};

// 页面类
class SamplePage extends React.Component {
  static contextTypes = {
    history: PropTypes.any,
  };

  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  onClickQuery = async () => {
    this.props.commonAction({
      refreshKey: Math.random(),
    });
  };

  render() {
    const { test = defaultState.test } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>请求数据测试</h1>
          <Query
            method="post"
            url="{apiUrl}/op/test"
            statePath={`${StateName}.someApi`}
            refreshKey={this.props.refreshKey}
          >
            {({ fetching, failed, data, error }) => {
              if (fetching) {
                return <div>Loading data...</div>;
              }

              if (failed) {
                console.error('query failed:', error);
                return <div>The request did not succeed.</div>;
              }

              if (data) {
                if (get(data, 'code', '') === 200) {
                  message.success('NN成功');
                } else {
                  message.error(get(data, 'message', 'NN失败！'));
                }
                return <div>remote data: {JSON.stringify(data)}</div>;
              }

              return null;
            }}
          </Query>

          <a onClick={this.onClickQuery} href="javascript:void(0)">
            再次请求
          </a>

          <h2>状态树测试: {test}</h2>
          <a onClick={this.onClickChange}>Change</a>
        </div>
      </div>
    );
  }
}

// 状态映射
const mapState = state => ({
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
)(SamplePage);
