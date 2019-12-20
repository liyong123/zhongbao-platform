import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Collapse } from 'antd';

import collapseStyle from '../../antdTheme/collapse/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './AuditManagement.css';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';
import QueryForm from './AuditManagementQueryForm';
import XDrawer from '../../components/XDrawer';

const StateName = 'auditManagement';
const { Panel } = Collapse;
const defaultState = {
  test: 'default',
  table: {
    current: 1,
    pageSize: 10,
  },
  detail: {
    visible: false,
  },
};

class AuditManagement extends React.Component {
  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
  };

  onClickDetail = () => {
    this.props.commonAction({
      detail: {
        visible: true,
      },
    });
  };

  onClickCloseDetail = () => {
    this.props.commonAction({
      detail: false,
    });
  };

  render() {
    const {
      table = defaultState.table,
      detail = defaultState.detail,
    } = this.props;

    const tableColumns = [
      {
        title: '企业法人',
        dataIndex: 'buName',
        key: 'buName',
        width: 100,
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '企业显示名称',
        dataIndex: 'displayNme',
        key: 'displayNme',
        width: 100,
      },
      {
        title: '法定代表人',
        dataIndex: 'juridicalPerson',
        key: 'juridicalPerson',
      },
      {
        title: '注册平台',
        dataIndex: 'applyFrom',
        key: 'applyFrom',
      },
      {
        title: '企业账户',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '申请人联系方式',
        dataIndex: 'contactTel',
        key: 'contactTel',
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          switch (text) {
            case '0':
              return '待审核';
            case '1':
              return '通过';
            case '-1':
              return '未通过';
            default:
              return '';
          }
        },
      },
      {
        title: '审核时间',
        dataIndex: 'checkTime',
        key: 'checkTime',
      },
      {
        title: '备注',
        dataIndex: 'fromType',
        key: 'fromType',
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: () => (
          <a onClick={this.onClickDetail} href="javascript:void(0)">
            审核
          </a>
        ),
        width: 200,
        fixed: 'right',
      },
    ];

    return (
      <div className={s.flexV}>
        <Query
          method="get"
          url="{apiUrl}/op/v1/supplier/queryAuditList"
          statePath={`${StateName}.table`}
          data={{
            pageSize: table.pageSize || 10,
            pageNum: table.current || 1,
          }}
          onRef={query => {
            this.query = query;
          }}
        />

        <Collapse accordion onChange={this.onChangeCollapse}>
          <Panel header="筛选条件" key="1">
            <QueryForm query={this.query} />
          </Panel>
        </Collapse>

        <Xtable
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          rowKey="id"
          className={s.full}
          onRef={inst => {
            this.tableInst = inst;
          }}
        />

        <XDrawer
          statePath={`${StateName}.detail`}
          title="认证资料"
          closable
          visible={detail.visible}
        >
          detail
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
  withStyles(s, collapseStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(AuditManagement);
