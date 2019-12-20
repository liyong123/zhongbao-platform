import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Button } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './TableDemo.css';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';

const StateName = 'tableDemo';
const defaultState = {
  test: 'default',
  table: {
    current: 1,
    pageSize: 10,
  },
};

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
    dataIndex: 'aa',
    key: 'aa',
    render: () => <a href="">编辑</a>,
    width: 200,
    fixed: 'right',
  },
];

class Home extends React.Component {
  render() {
    const { table = {}, height = '70%' } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <h2>例子：</h2>
        <Button
          onClick={() => {
            this.props.commonAction({
              height: height === '70%' ? '50%' : '70%',
            });
            this.props.commonAction({
              table: {
                resizeKey: Math.random(),
              },
            });
          }}
        >
          改变高度
        </Button>
        <Query
          method="get"
          url="{apiUrl}/op/v1/supplier/queryApplyList"
          statePath={`${StateName}.table`}
          data={{
            pageSize: table.pageSize || 10,
            pageNum: table.current || 1,
          }}
        />
        <Xtable
          resizeKey={table.resizeKey}
          style={{ height }}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          rowKey="id"
        />
        <h2>参数说明：</h2>
        <ul style={{ fontSize: 20, lineHeight: 1.7 }}>
          <li>statePath: 字符串：store中存储列表数据的位置（必填）</li>
          <li>
            columns:
            数组：列属性，同antdesign，可选择添加sort,fixed等属性（必填）
          </li>
          <li>rowKey: 字符串：行键值（必填）</li>
          <li>resizeKey: 任意值：通过修改可以触发列表重新计算高度</li>
          <li>style: 容器样式</li>
          <li>className: 容器类名</li>
          <li>needRowSelection: 是否显示check框 默认true</li>
          <li>rowSelectionCallback: 点击check框触发回调函数</li>
          <li>其他参数 同antdesign</li>
        </ul>
        <h2>待解决问题：</h2>
        <ul style={{ fontSize: 20, lineHeight: 1.7 }}>
          <li>浏览器频繁resize后页面卡死（已解决）</li>
          <li>加入到模板页面（进行中）</li>
        </ul>
        <h2>注意：</h2>
        <ul style={{ fontSize: 20, lineHeight: 1.7 }}>
          <li>columns中设置fixed固定的列必须给定width</li>
          <li>columns中的width 不要小于100</li>
        </ul>
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
  withStyles(s, buttonStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(Home);
