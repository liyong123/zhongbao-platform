import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Button, Form } from 'antd';
import qs from 'query-string';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './toolBar.css';
import BulkImport from '../../components/BulkImport';

const StateName = 'procurementAccount';

const defaultState = {
  importBulk: 0,
  table: {
    current: 1,
    pageSize: 10,
  },
  showLookEdit: {
    value: 0,
    content: '采购单位管理',
  },
};

// 操作栏
class ToolBar extends React.Component {
  // 批量导入
  bulkImport = () => {
    const actionOpts = { type: `${StateName}`, isGlobal: true };
    this.props.commonAction(
      {
        importBulk: {
          importBulk: 1,
        },
      },
      actionOpts,
    );
  };
  render() {
    const { importBulk = {}, table, yunJiList } = this.props;
    const queryData = {
      guzhu: yunJiList[0] ? yunJiList[0].count : 'XXX',
      ...(table.status !== -1 && table.status !== undefined
        ? { status: table.status }
        : {}),
      userId: table.userId || '',
      buName: table.buName || '',
      socialCreditCode: table.socialCreditCode || '',
      contractName: table.contractName || '',
      contractPhone: table.contractPhone || '',
    };
    return (
      <div className="toolBar">
        <Button type="primary" icon="plus" onClick={this.props.handleVisible}>
          创建新单位
        </Button>

        <Button type="primary" icon="download" onClick={this.bulkImport}>
          批量导入
        </Button>

        {global.App && (
          <Button
            icon="download"
            href={`${get(
              global,
              'App.apiUrl',
            )}/op/v1/buyers/excelExport?${qs.stringify(queryData)}`}
          >
            导出Excel
          </Button>
        )}

        {global.App && (
          <Button
            icon="download"
            href={`${get(
              global,
              'App.apiUrl',
            )}/op/v1/buyers/downloadImportTemlate`}
          >
            导入模板下载
          </Button>
        )}

        {/*  批量导入 Modal  */}
        {importBulk.importBulk === 1 && (
          <BulkImport
            statePath={`${StateName}.importBulk`}
            importBulk={importBulk}
            selectShow={false}
            query={this.props.query}
            importURL="/op/v1/buyers/uploadOrderUnitFile"
            optionList={[]}
          />
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
  withStyles(s, buttonStyle, formStyle, gridStyle, inputStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(ToolBar);
