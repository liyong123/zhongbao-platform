import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Collapse } from 'antd';

import collapseStyle from '../../antdTheme/collapse/style/index.less';
import animateStyle from '../../antdTheme/style/core/motion.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './SupplierExamList.css';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';
import XDrawer from '../../components/XDrawer';
import Auditing from './auditing/Auditing';
import QueryForm from './SupplierExamListQueryForm';
import moment from 'moment/moment';
import get from 'lodash.get';

const StateName = 'supplierExamList';
const { Panel } = Collapse;
const defaultState = {
  table: {
    current: 1,
    pageSize: 10,
  },
  drawer: {
    visible: false,
    key: Math.random(),
  },
};

class SupplierExamList extends React.Component {
  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
  };
  toAudit = record => {
    const { visible } = this.props.drawer;
    this.props.commonAction({
      drawer: {
        visible: !visible,
        key: Math.random(),
        buIdSecret: record.buIdSecret,
        auditStatus: record.status,
      },
    });
  };
  render() {
    const { table = {}, drawer = defaultState.drawer, yunjiList } = this.props;
    const tableColumns = [
      {
        title: '企业法人',
        dataIndex: 'buName',
        key: 'buName',
        fixed: 'left',
        sorter: (a, b) => a > b,
        width: 160,
      },
      {
        title: '企业显示名称',
        dataIndex: 'displayNme',
        key: 'displayNme',
        width: 250,
      },
      {
        title: '法定代表人',
        dataIndex: 'juridicalPerson',
        key: 'juridicalPerson',
        width: 200,
      },
      {
        title: '注册平台',
        dataIndex: 'applyFrom',
        key: 'applyFrom',
        render: (text, record) => {
          const applyFroms = record.applyFrom;
          if (applyFroms === '') {
            return '全部';
          } else if (applyFroms === 'NJ') {
            return '南京云集';
          } else if (applyFroms === 'XA') {
            return '西安云集';
          } else if (applyFroms === 'ZJ') {
            return '镇江云集';
          }
          return '--';
        },
        width: 100,
      },
      {
        title: '企业账户',
        dataIndex: 'userId',
        key: 'userId',
        width: 200,
      },
      {
        title: '申请人联系方式',
        dataIndex: 'contactTel',
        key: 'contactTel',
        width: 132,
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: v => moment(v).format('YYYY年MM月DD日'),
        width: 132,
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          const sta = record.status;
          if (sta === 0) {
            return '待审核';
          } else if (sta === 1) {
            return '审核通过';
          } else if (sta === -1) {
            return '审核未通过';
          }
          return '--';
        },
      },
      {
        title: '审核时间',
        dataIndex: 'checkTime',
        key: 'checkTime',
        render: v => moment(v).format('YYYY年MM月DD日'),
        width: 132,
      },
      {
        title: '备注',
        dataIndex: 'result',
        key: 'result',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'buIdSecret',
        key: 'buIdSecret',
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          const sta = record.status;
          if (sta === 0) {
            return (
              <a
                onClick={() => {
                  this.toAudit(record);
                }}
                href="javascript:void(0)"
              >
                审核
              </a>
            );
          } else if (sta === 1) {
            return (
              <a
                onClick={() => {
                  this.toAudit(record);
                }}
                href="javascript:void(0)"
              >
                查看审核材料
              </a>
            );
          } else if (sta === 2) {
            return '--';
          }
          return '--';
        },
        width: 110,
      },
    ];
    const _yunjiList = get(yunjiList, 'data.data', []);
    const yunjiCode = get(yunjiList, 'data.code', 0);
    return (
      <div className="root">
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getYunjisites"
          statePath={`${StateName}.yunjiList`}
        />
        {yunjiCode === 200 && (
          <Query
            method="get"
            url="{apiUrl}/op/v1/supplier/queryAuditList"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              applyFrom: _yunjiList[0] ? _yunjiList[0].code : 'XXX',
            }}
            onRef={query => {
              this.query = query;
            }}
          />
        )}

        <Collapse
          defaultActiveKey="1"
          accordion
          onChange={this.onChangeCollapse}
        >
          <Panel header="筛选条件" key="1">
            <QueryForm query={this.query} list={_yunjiList} />
          </Panel>
        </Collapse>

        <Xtable
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          data={this.props.table}
          style={{ marginTop: 15 }}
          needRowSelection={false}
          rowKey="buid"
          className="full"
          onRef={inst => {
            this.tableInst = inst;
          }}
        />
        {/* 审核弹出层 */}
        <XDrawer
          statePath={`${StateName}.drawer`}
          title={drawer.auditStatus === 0 ? '审核' : '查看审核材料'}
          visible={drawer.visible}
        >
          <Auditing
            key={drawer.key}
            buIdSecret={drawer.buIdSecret}
            auditStatus={drawer.auditStatus}
            successCallBack={() => {
              this.query.fetch();
            }}
          />
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
  withStyles(s, collapseStyle, animateStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(SupplierExamList);
