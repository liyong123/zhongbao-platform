import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import qs from 'query-string';
// import get from 'lodash.get';
import { Button } from 'antd';
import get from 'lodash.get';

import buttonStyle from '../../antdTheme/button/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './ToolBar.css';

const StateName = 'accountManagement';

// 查询表单
class ToolBar extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
  };

  render() {
    const { queryData = {} } = this.props;

    return (
      <div className="toolBar">
        {global.App && (
          <Button
            type="primary"
            icon="download"
            href={`${get(
              global,
              'App.apiUrl',
            )}/op/v1/supplier/excelApplyExport?${qs.stringify(queryData)}`}
          >
            Excel导出
          </Button>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
)(ToolBar);
