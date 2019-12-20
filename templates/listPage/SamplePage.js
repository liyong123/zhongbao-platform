import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Collapse } from 'antd';

import collapseStyle from '../../antdTheme/collapse/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';
import QueryForm from './SamplePageQueryForm';
import DetailForm from './SamplePageDetailForm';
import XDrawer from '../../components/XDrawer';

const StateName = 'samplePage';
const { Panel } = Collapse;
const defaultState = {
  test: 'default',
  table: {
    current: 1,
    pageSize: 10,
  },
  detail: {
    visible: false,
    formSeed: Math.random(),
  },
};

class SamplePage extends React.Component {
  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
  };

  onClickEdit = () => {
    if (this.detailForm) this.detailForm.resetFields();
    this.props.commonAction({
      detail: {
        visible: true,
        formSeed: Math.random(),
      },
    });
  };

  render() {
    const {
      table = defaultState.table,
      detail = defaultState.detail,
    } = this.props;

    const tableColumns = [
      {
        title: '企业名称',
        dataIndex: 'buName',
        key: 'buName',
        width: 100,
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '法人电话',
        dataIndex: 'ownerMobile',
        key: 'ownerMobile',
        width: 100,
      },
      {
        title: '认证状态',
        dataIndex: 'authSatusStr',
        key: 'authSatusStr',
      },
      {
        title: '认证状态',
        dataIndex: 'authSatusStr1',
        key: 'authSatusStr1',
        width: 500,
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: () => (
          <a onClick={this.onClickEdit} href="javascript:void(0)">
            编辑
          </a>
        ),
        width: 200,
        fixed: 'right',
      },
    ];

    return (
      <div className="root">
        {/* 列表接口 */}
        <Query
          method="get"
          // url="{apiUrl}/op/v1/supplier/queryApplyList"
          url="/listSample.json"
          statePath={`${StateName}.table`}
          data={{
            pageSize: table.pageSize || 10,
            pageNum: table.current || 1,
          }}
          refreshKey={this.props.listRefreshKey}
        />

        <div className="searchArea">
          <Collapse accordion onChange={this.onChangeCollapse}>
            <Panel header="筛选条件" key="1">
              <QueryForm query={this.query} />
            </Panel>
          </Collapse>
        </div>

        <Xtable
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          rowKey="id"
          className="full"
          onRef={inst => {
            this.tableInst = inst;
          }}
        />

        {/* 详情 */}
        <XDrawer
          statePath={`${StateName}.detail`}
          title="采购单位管理"
          closable
          visible={detail.visible}
        >
          <DetailForm formSeed={detail.formSeed} />
        </XDrawer>
      </div>
    );
  }
}

const mapState = state => ({
  layout: state.layout,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(
    collapseStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(SamplePage);
