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
import s from './SampleAuthor.css';

// 状态名
const StateName = 'sample';

// 默认状态
const defaultState = {
  url: 'https://njdev.jfh.com/jfyjop/op/test',
};

// 页面类
class Sample extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
  };

  onClickChange = () => {
    this.props.commonAction(
      {
        test: Math.random(),
      },
      'myAction',
    );
  };

  onClickQuery = async () => {
    this.props.commonAction({
      url: document.getElementById('url').value,
      queryKey: Math.random(),
    });
  };

  onClickFetch = () => {
    fetch(document.getElementById('url').value, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        console.log('result', response);
        document.getElementById('result').value = `status:${response.status}`;
      })
      .catch(response => {
        console.error('error', response);
        document.getElementById('result').value = response;
      });
  };

  render() {
    const { url = defaultState.url } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h4>请求数据测试(项目Cros版)</h4>
          url:<input
            style={{ width: 500 }}
            id="url"
            defaultValue={url}
            type="text"
          />
          <Query
            auto={false}
            method="get"
            url={url}
            statePath={`${StateName}.someApi`}
            refreshKey={this.props.queryKey}
          >
            {({ fetching, failed, data, error }) => {
              if (fetching) {
                return <div>Loading data...</div>;
              }

              if (failed) {
                console.error('failed:', error);
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
          <h4>Ajax请求数据测试(原生fetch版)(不跨域)</h4>
          <a onClick={this.onClickFetch} href="javascript:void(0)">
            fetch
          </a>
          <div>
            <textarea style={{ width: 500, height: 300 }} id="result" />
          </div>
        </div>
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
)(Sample);
