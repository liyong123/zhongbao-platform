import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';

import buttonStyle from '../../antdTheme/button/style/index.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './Home.css';
import OldOp from '../oldOp/OldOp';
import Query from '../../components/Query';

const StateName = 'home';
const defaultState = {};

const homeMenu = {
  name: '首页',
  url: '/',
  oldOpUrl: '',
};

class Home extends React.Component {
  static contextTypes = {
    scrollArea: PropTypes.object,
    store: PropTypes.any,
  };

  render() {
    const { runtime: { currentMenu } } = this.props;
    const defaultHomePage = (
      <div className={s.root}>
        <div className={s.title}>
          <h1>云集运营管理平台</h1>
        </div>
        <div className={s.subtitle}>V2.0.0</div>
      </div>
    );

    if (currentMenu && currentMenu.oldOpUrl) {
      return <OldOp />;
    }

    return (
      <Query
        method="post"
        url="{apiUrl}/op/v1/smartbi/getSmartbiURL"
        statePath={`${StateName}.oldOpHome`}
      >
        {({ fetching, failed, data, error }) => {
          if (fetching) {
            return <div>Loading data...</div>;
          }

          if (failed) {
            console.error('query failed:', error);
            return defaultHomePage;
          }

          if (data) {
            if (data.code !== 200 || !data.data) {
              return defaultHomePage;
            }
            homeMenu.oldOpUrl = data.data;
            this.props.commonAction(homeMenu, {
              type: 'runtime.currentMenu',
              isGlobal: true,
            });

            const preMenu = this.props.runtime.currentMenu;
            if (preMenu && !preMenu.autoClear) {
              const name =
                preMenu.stateName || preMenu.url.match(/\/(\w*)$/)[1];
              // 清理旧状态(整个项目有两处)
              if (name && this.context.store.getState()[name]) {
                this.props.commonAction(null, {
                  type: name,
                  isGlobal: true,
                });
              }
            }
            return <OldOp />;
          }

          return null;
        }}
      </Query>
    );
  }
}

const mapState = state => ({
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(Home);
