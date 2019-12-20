import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Collapse, Modal, message } from 'antd';
import moment from 'moment';

import collapseStyle from '../../antdTheme/collapse/style/index.less';
import modalStyle from '../../antdTheme/modal/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less';
import animateStyle from '../../antdTheme/style/core/index.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './DealPublishManagement.css';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';
import XDrawer from '../../components/XDrawer';
import QueryForm from './QueryForm';
import ToolBar from './ToolBar';
import EditNotice from './EditNotice';
import get from 'lodash.get';// eslint-disable-line

const StateName = 'DealPublishManagement';
const { Panel } = Collapse;
const defaultState = {
  test: 'default',
  table: {
    current: 1,
    pageSize: 10,
  },
  importBulk: 0,
};

const yunjis = [
  {
    name: '南京云集',
    key: 'NANJING_CLOUD',
    queryKey: 'NJ',
  },
  {
    name: '西安云集',
    key: 'XIAN_CLOUD',
    queryKey: 'XA',
  },
  {
    name: '镇江云集',
    key: 'ZHENJIANG_CLOUD',
    queryKey: 'ZJ',
  },
];

class DealPublishManagement extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    scrollArea: PropTypes.object,
  };

  render() {
    const {
      table = {},
      drawer = { visible: false },
      drawer2 = { visible: false },
      editFormData = {},
      collapse = false,
      formDataKey,
      yunjiList,
      isUpdating = false,
      attachs = [],
    } = this.props;

    const _yunjiList = get(yunjiList, 'data.data', []);
    const yunjiCode = get(yunjiList, 'data.code', 0);
    const list = get(table, `data.data.list`, []);
    let maxWidth = 24;
    list.forEach(l => {
      let count = 0;
      let num = 0;
      if (l.updateBtn === 1) {
        count += 2;
        num++;
      }
      if (l.publishBtn === 1) {
        count += 2;
        num++;
      }
      if (l.deleteBtn === 1) {
        count += 2;
        num++;
      }
      if (l.createProBtn === 1) {
        count += 4;
        num++;
      }
      if (l.showProBtn === 1) {
        count += 4;
        num++;
      }
      if (l.linkProBtn === 1) {
        count += 5;
        num++;
      }
      if (l.linkProRetBtn === 1) {
        count += 7;
        num++;
      }
      if (l.linkRetUpBtn === 1) {
        count += 4;
        num++;
      }
      const splitWidth = num > 0 ? (num - 1) * 14 : 0;
      if (count * 14 + splitWidth + 24 > maxWidth) {
        maxWidth = count * 14 + splitWidth + 24;
      }
    });
    const tableColumns = [
      {
        title: '项目编号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 170,
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '公告标题名称',
        dataIndex: 'noticeName',
        key: 'noticeName',
        width: 270,
      },
      {
        title: '采购单位名称',
        dataIndex: 'buName',
        key: 'buName',
        width: 270,
      },
      {
        title: '中标单位',
        dataIndex: 'bidBuName',
        key: 'bidBuName',
        width: 250,
      },
      {
        title: '中标金额',
        dataIndex: 'bidPrice',
        key: 'bidPrice',
        width: 100,
      },
      {
        title: '采购方式',
        dataIndex: 'purchaseWay',
        key: 'purchaseWay',
      },
      {
        title: '采购时间',
        dataIndex: 'putTime',
        key: 'putTime',
        width: 122,
        render: v => moment(v).format('YYYY年MM月DD日'),
      },
      {
        title: '所属云集',
        dataIndex: 'source',
        key: 'source',
        width: 100,
        render: v =>
          yunjis.filter(y => y.key === v)
            ? yunjis.filter(y => y.key === v)[0].name
            : '',
      },
      {
        title: '公告类型',
        dataIndex: 'noticeType',
        key: 'noticeType',
        width: 130,
      },
      {
        title: '数据来源',
        dataIndex: 'dataSource',
        key: 'dataSource',
      },
      {
        title: '结果类型',
        dataIndex: 'resultType',
        key: 'resultType',
        render: resultType => resultType || '暂无类型',
      },
      {
        title: '是否变更',
        dataIndex: 'isUpdataNotices',
        key: 'isUpdataNotices',
        render: isUpdataNotices => (isUpdataNotices === 1 ? '是' : '否'),
      },
      {
        title: '发布状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (status === 0 ? '已发布' : '未发布'),
      },
      {
        title: '项目状态',
        dataIndex: 'oweTempStatusName',
        key: 'oweTempStatusName',
      },
      {
        title: '操作',
        dataIndex: 'jbonId',
        key: 'jbonId',
        render: (jbonId, record) => {
          const arr = [];
          if (record.updateBtn === 1) {
            arr.push(
              <a
                href="javascript: void 0"
                onClick={() => {
                  this.editNotice(jbonId);
                }}
              >
                编辑
              </a>,
            );
          }

          if (record.publishBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href="javascript: void 0"
                onClick={() => {
                  this.publish(jbonId);
                }}
              >
                发布
              </a>,
            );
          }

          if (record.deleteBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href="javascript: void 0"
                onClick={() => {
                  Modal.confirm({
                    title: '确认删除成交公告',
                    content: '删除后将无法恢复',
                    onOk: () => {
                      this.deleteRow(jbonId);
                    },
                  });
                }}
              >
                删除
              </a>,
            );
          }

          if (record.createProBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href={`${record.oweUrl}/project/inviteGuzhu?noticeId=${
                  record.jbonId
                }`}
              >
                创建项目
              </a>,
            );
          }
          if (record.showProBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href={`${record.oweUrl}/project/order/info?noticeId=${
                  record.jbonId
                }`}
              >
                查看项目
              </a>,
            );
          }
          if (record.linkProBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href={`${
                  record.oweUrl
                }/project/order/info?Editflag=1&noticeId=${record.jbonId}`}
              >
                关联供应商
              </a>,
            );
          }
          if (record.linkProRetBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href={`${
                  record.oweUrl
                }/project/order/info?Editflag=1&noticeId=jbonId`}
              >
                重新关联供应商
              </a>,
            );
          }
          if (record.linkRetUpBtn === 1) {
            arr.push(
              <span
                style={{
                  padding: '0 5px',
                  transform: 'scaleX(0.5)',
                  color: 'rgba(0,0,0,0.09)',
                }}
              >
                |
              </span>,
            );
            arr.push(
              <a
                href={`${
                  record.oweUrl
                }/project/order/info?Editflag=1&noticeId=${record.jbonId}`}
              >
                重新编辑
              </a>,
            );
          }
          return arr;
        },
        width: maxWidth,
        align: 'center',
        fixed: 'right',
      },
    ];
    if (this.maxWidth !== maxWidth) {
      this.props.commonAction({
        table: {
          resizeKey: new Date(),
        },
      });
      this.maxWidth = maxWidth;
    }

    if (
      _yunjiList.length > 0 &&
      get(table, 'conditions.yunjis') === undefined
    ) {
      this.props.commonAction({
        table: {
          conditions: {
            yunjis: _yunjiList[0].code,
          },
        },
      });
    }

    return (
      <div className="root">
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getYunjisites"
          statePath={`${StateName}.yunjiList`}
          onRef={query => {
            this.query = query;
          }}
        />
        {yunjiCode === 200 && (
          <Query
            method="get"
            url="{apiUrl}/op/v1/publish/notice/list"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              ...(table.conditions || {}),
              yunjis: get(table, 'conditions.yunjis', '')
                ? table.conditions.yunjis
                : _yunjiList[0] ? _yunjiList[0].code : 'XXX',
            }}
            refreshKey={table.refreshKey || ''}
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
            <QueryForm query={this.query} yunjis={_yunjiList} />
          </Panel>
        </Collapse>
        <ToolBar
          yunJiList={(_yunjiList || []).map(y => ({
            count: y.code,
            yunjitext: y.cnname,
          }))}
          query={this.query}
          isUpdating={isUpdating}
        />
        <Xtable
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          data={this.props.table}
          needRowSelection={false}
          rowKey="id"
          className="full"
          onRef={inst => {
            this.tableInst = inst;
          }}
        />
        <XDrawer
          statePath={`${StateName}.drawer`}
          title="编辑成交公告"
          closable
          closeHook={() => {
            this.props.commonAction({ content: null });
          }}
          visible={drawer.visible || false}
          key={drawer.key}
        >
          <EditNotice
            collapse={collapse}
            drawer2={drawer2}
            initData={editFormData}
            attachs={attachs}
            key={formDataKey}
            fetch={this.context.fetch}
          />
        </XDrawer>
      </div>
    );
  }

  publish = async noticeId => {
    const result = await this.context.fetch(
      '{apiUrl}/op/v1/publish/notice/uploadNoticeStatus',
      {
        method: 'POST',
        data: { noticeId },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const json = await result.json();
    if (json.code === 200) {
      message.success('成交公告发布成功');
      this.props.commonAction({ table: { refreshKey: new Date() } });
    } else {
      // 失败提示
      message.error('成交公告发布失败');
    }
  };

  deleteRow = async noticeId => {
    const result = await this.context.fetch(
      '{apiUrl}/op/v1/publish/notice/deleteNoticeStatus',
      {
        method: 'POST',
        data: { noticeId },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const json = await result.json();
    if (json.code === 200) {
      message.success('成交公告删除成功');
      this.props.commonAction({ table: { refreshKey: new Date() } });
    } else {
      // 失败提示
      message.error('成交公告删除失败');
    }
  };

  editNotice = async noticeId => {
    // this.props.commonAction({
    //   drawer: { visible: true },
    //   editFormData: { name: '孙氏企业' },
    // });

    const result = await this.context.fetch(
      '{apiUrl}/op/v1/publish/notice/getNoticeDetails',
      {
        method: 'GET',
        data: { projectId: noticeId },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const json = await result.json();
    if (json.code === 200) {
      const attachs = JSON.parse(json.data.attachs || '[]');
      this.props.commonAction({
        drawer: { visible: true },
        editFormData: json.data,
        attachs: attachs.map(a => ({ ...a, uid: a.key })),
        formDataKey: Math.random(),
      });
    }
  };

  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
    setTimeout(() => {
      this.context.scrollArea.refresh();
    }, 200);
  };
}

const mapState = state => ({
  layout: state.layout,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, collapseStyle, modalStyle, messageStyle, animateStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(DealPublishManagement);
