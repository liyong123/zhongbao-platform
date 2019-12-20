import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';

import { Collapse } from 'antd';
import get from 'lodash.get';
import moment from 'moment';

// import Link from '../../components/Link';
import collapseStyle from '../../antdTheme/collapse/style/index.less';
import animateStyle from '../../antdTheme/style/core/motion.less';
// import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';

import XDrawer from '../../components/XDrawer';
import AccountAudit from '../accountAudit';

import s from './AccountManagement.css';
import Xtable from '../../components/XTable';
import Query from '../../components/Query';
import QueryForm from './QueryForm';
import ToolBar from './ToolBar';

const { Panel } = Collapse;

// 状态名
const StateName = 'accountManagement';

// 默认状态
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

// 页面类
class AccountManagement extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
    scrollHeight: PropTypes.number,
  };

  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  onClickDetail = record => {
    const { visible } = this.props.drawer;
    this.props.commonAction({
      drawer: {
        visible: !visible,
        buIdSecret: record.buIdSecret,
        auditStatus: record.auditStatus,
        data: record,
        key: Math.random(),
      },
    });
  };

  render() {
    const {
      drawer = defaultState.drawer,
      table = defaultState.table,
      yunjiList,
    } = this.props;
    const columns = [
      {
        title: '供应商名称',
        dataIndex: 'buName',
        key: 'buName',
        fixed: 'left',
        width: 230,
      },
      {
        title: '联系人',
        dataIndex: 'ownerName',
        key: 'ownerName',
        width: 100,
      },
      {
        title: '联系方式',
        dataIndex: 'ownerMobile',
        key: 'ownerMobile',
        width: 140,
      },
      {
        title: '注册平台',
        dataIndex: 'applayfrom',
        key: 'applayfrom',
        render: text => {
          switch (text.trim()) {
            case '':
              return '全部';
            case 'NJ':
              return '南京云集';
            case 'XA':
              return '西安云集';
            case 'ZJ':
              return '镇江云集';
            default:
              return '';
          }
        },
        width: 110,
      },
      {
        title: '企业认证状态',
        dataIndex: 'authSatusStr',
        key: 'authSatusStr',
        render: text => {
          text += '';
          switch (text) {
            case '0':
              return '待认证';
            case '1':
              return '已认证';
            default:
              return text;
          }
        },
        width: 130,
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        render: text => {
          text += '';
          switch (text) {
            case '0':
              return '待审核';
            case '1':
              return '通过';
            case '2':
              return '未通过';
            default:
              return '';
          }
        },
        width: 100,
      },
      {
        title: '注册时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
        width: 150,
        render: v => (v ? moment(v).format('YYYY年MM月DD日') : ''),
      },
      {
        title: '企业法人',
        dataIndex: 'corporate',
        key: 'corporate',
      },
      {
        title: '社会信用代码',
        dataIndex: 'bulicenseCode',
        key: 'bulicenseCode',
      },
      {
        title: '地区',
        dataIndex: 'location',
        key: 'location',
        render: (v, record) =>
          record.city && record.county ? `${record.city}-${record.county}` : '',
        width: 130
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (text, record) => {
          if (record.buIdSecret) {
            if (record.auditStatus * 1 !== 0) {
              return (
                <a
                  onClick={() => {
                    this.onClickDetail(record);
                  }}
                  href="javascript:void(0)"
                >
                  查看账户详情
                </a>
              );
            }
            return (
              <a
                onClick={() => {
                  this.onClickDetail(record);
                }}
                href="javascript:void(0)"
              >
                审核
              </a>
            );
          }
          return null;
        },
        fixed: 'right',
        align: 'center',
        width: 120,
      },
    ];
    const _yunjiList = get(yunjiList, 'data.data', []);
    const yunjiCode = get(yunjiList, 'data.code', 0);
    if (
      _yunjiList.length > 0 &&
      get(table, 'conditions.applayfrom') === undefined
    ) {
      this.props.commonAction({
        table: {
          conditions: {
            applayfrom: _yunjiList[0].code,
          },
        },
      });
    }
    const queryData = {
      ...(table.conditions || {}),
      applayfrom: get(table, 'conditions.applayfrom', '')
        ? table.conditions.applayfrom
        : _yunjiList[0] ? _yunjiList[0].code : 'XXX',
    };
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
            url="{apiUrl}/op/v1/supplier/queryApplyList"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              ...queryData,
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
            <QueryForm list={_yunjiList} />
          </Panel>
        </Collapse>

        <ToolBar queryData={queryData} />

        <Xtable
          needRowSelection={false}
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={columns}
          rowKey="id"
          className="full"
          onRef={inst => {
            this.tableInst = inst;
          }}
        />

        {/* 审核弹出层 */}
        <XDrawer
          statePath={`${StateName}.drawer`}
          title={
            drawer.auditStatus * 1 === 0 ? '审核供应商账户' : '查看供应商账户'
          }
          visible={drawer.visible}
        >
          <AccountAudit
            key={drawer.key}
            buIdSecret={drawer.buIdSecret}
            auditStatus={drawer.auditStatus}
            yunjiList={_yunjiList}
            successCallBack={() => {
              this.query.fetch();
            }}
          />
        </XDrawer>
      </div>
    );
  }

  /* query = formData => {
    console.log(formData);
  }; */

  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
  };
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
  withStyles(s, collapseStyle, animateStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(AccountManagement);
