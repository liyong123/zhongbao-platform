import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import qs from 'query-string';
import {
  Button,
  Form,
  Input,
  Select,
  Collapse,
  DatePicker,
  Col,
  Row,
} from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import collapseStyle from '../../antdTheme/collapse/style/index.less';
import dateStyle from '../../antdTheme/date-picker/style/index.less';
import animateStyle from '../../antdTheme/style/core/motion.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './ProcurementList.css';
import Query from '../../components/Query';
import Xtable from '../../components/XTable';
import DateRange from '../../components/DateRange';
import XQuery from '../../components/XQuery';

const StateName = 'procurementList';
const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const defaultState = {
  test: 'default',
  table: {
    current: 1,
    pageSize: 10,
    xmbh: ' ',
    gg_name: ' ',
    pchaseType: '',
    phcaseMoney: '',
    fb_start_date: '',
    fb_end_date: '',
    guzhu: '',
  },
};
const FormItem = Form.Item;

const colWidth = 8; // 两列
const formItemLayout = {
  wrapperCol: {
    span: 18,
  },
  labelCol: {
    span: 6,
  },
  style: {
    width: '100%',
  },
};

const formItemLayout2 = {
  wrapperCol: {
    span: 14,
  },
  labelCol: {
    span: 10,
  },
  style: {
    width: '100%',
  },
};

// 查询表单
class QueryForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { yunjiList } = this.props;

    const pchaseType = [
      {
        name: '全部',
        key: 'TYPE00',
      },
      {
        name: '采购信息公告',
        key: 'TYPE01',
      },
      {
        name: '采购信息更正公告',
        key: 'TYPE02',
      },
      {
        name: '采购结果公告',
        key: 'TYPE03',
      },
      {
        name: '采购结果更正公告',
        key: 'TYPE04',
      },
    ];
    const phcaseMoney = [
      {
        name: '全部',
        key: 'TYPE01',
      },
      {
        name: '5万以下',
        key: 'TYPE02',
      },
      {
        name: '5万-10万',
        key: 'TYPE03',
      },
      {
        name: '10万-20万',
        key: 'TYPE04',
      },
      {
        name: '20万-50万',
        key: 'TYPE05',
      },
      {
        name: '50万以上',
        key: 'TYPE06',
      },
    ];
    return (
      <Form layout="inline" style={{ padding: '0 10px' }}>
        <XQuery>
          <FormItem label="项目名称" {...formItemLayout2}>
            {getFieldDecorator('GG_NAME')(
              <Input style={{ width: '100%' }} autoFocus />,
            )}
          </FormItem>
          <FormItem label="项目编号" {...formItemLayout}>
            {getFieldDecorator('XMBH')(<Input style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="公告类型" {...formItemLayout}>
            {getFieldDecorator('pchaseType', {
              initialValue: 'TYPE00',
            })(
              <Select getPopupContainer={() => document.querySelector(`.root`)}>
                {pchaseType.map(b => (
                  <Option key={b.key} value={b.key}>
                    {b.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="预算和成交金额" {...formItemLayout2}>
            {getFieldDecorator('phcaseMoney', {
              initialValue: 'TYPE01',
            })(
              <Select getPopupContainer={() => document.querySelector(`.root`)}>
                {phcaseMoney.map(b => (
                  <Option key={b.key} value={b.key}>
                    {b.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="发布时间" colSpan={2} {...formItemLayout}>
            {getFieldDecorator('fb_start_date')(
              <DateRange
                getCalendarContainer={() => document.querySelector(`.root`)}
                style={{ width: '80%' }}
              />,
            )}
          </FormItem>
          <FormItem label="所属云集" {...formItemLayout}>
            {getFieldDecorator('guzhu', {
              initialValue: yunjiList[0] ? yunjiList[0].key : '',
            })(
              <Select
                style={{ width: '100%' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {yunjiList.map(b => (
                  <Option key={b.key} value={b.key}>
                    {b.value}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.query} type="primary">
              查询
            </Button>
            <a
              href="javascript:void 0"
              className="query-reset-btn"
              onClick={this.resetForm}
            >
              重置
            </a>
          </FormItem>
        </XQuery>
      </Form>
      /* <Form layout="inline" style={this.props.style}>
        <table className="query-table">
          <tbody>
            <tr>
              <td style={{ width: 86 }} className="label">
                项目编号：
              </td>
              <td>
                {getFieldDecorator('XMBH')(<Input style={{ width: 180 }} />)}
              </td>
              <td style={{ width: 86 }} className="label">
                项目名称：
              </td>
              <td>
                {getFieldDecorator('GG_NAME')(<Input style={{ width: 180 }} />)}
              </td>
              <td style={{ width: 86 }} className="label">
                公告类型：
              </td>
              <td>
                {getFieldDecorator('pchaseType', {
                  initialValue: 'TYPE00',
                })(
                  <Select style={{ width: 180 }}>
                    {pchaseType.map(b => (
                      <Option key={b.key} value={b.key}>
                        {b.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </td>
              <td className="label" style={{ width: 128 }}>
                预算和成交金额：
              </td>
              <td>
                {getFieldDecorator('phcaseMoney', {
                  initialValue: 'TYPE01',
                })(
                  <Select style={{ width: 180 }}>
                    {phcaseMoney.map(b => (
                      <Option key={b.key} value={b.key}>
                        {b.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </td>
            </tr>
            <tr>
              <td className="label">发布时间：</td>
              <td colSpan={3}>
                {getFieldDecorator('fb_start_date')(
                  <DateRange style={{ width: 385 }} />,
                )}
              </td>
              <td className="label">所属云集：</td>
              <td>
                {getFieldDecorator('guzhu', {
                  initialValue: yunjiList[0] ? yunjiList[0].key : '',
                })(
                  <Select style={{ width: 180 }}>
                    {yunjiList.map(b => (
                      <Option key={b.key} value={b.key}>
                        {b.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </td>
              <td style={{ textAlign: 'right' }} colSpan={2}>
                <Button onClick={this.query} type="primary">
                  查询
                </Button>
                <Button onClick={this.resetForm}>重置</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form> */
    );
  }
  resetForm = () => {
    this.props.form.resetFields();
  };
  query = () => {
    this.props.query(this.props.form.getFieldsValue());
  };
}

const WrappedQueryForm = Form.create()(QueryForm);

class ProcurementList extends React.Component {
  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  handleVisible(drawer) {
    console.log('xDrawer state', drawer);
    const { visible } = drawer;
    const actionOpts = { type: `home.drawer`, isGlobal: true };
    this.props.commonAction({ visible: !visible }, actionOpts);
  }

  query = fieldsValue => {
    const start = fieldsValue.fb_start_date;
    const values = {
      ...fieldsValue,
      fb_start_date: [
        start && start.start && start.start.format('YYYY-MM-DD'),
        start && start.end && start.end.format('YYYY-MM-DD'),
      ],
    };

    this.props.commonAction({
      table: {
        xmbh: values.XMBH || ' ',
        gg_name: values.GG_NAME || ' ',
        pchaseType: values.pchaseType || 'TYPE00',
        phcaseMoney: values.phcaseMoney || 'TYPE01',
        fb_start_date: values.fb_start_date[0] || '',
        fb_end_date: values.fb_start_date[1] || '',
        guzhu: values.guzhu || '',
      },
    });
  };

  render() {
    const { table = {}, yunjiList } = this.props;

    const tableColumns = [
      {
        title: '项目编号',
        dataIndex: 'pchaseNo',
        key: 'pchaseNo',
        width: 150,
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '项目名称',
        dataIndex: 'pchaseName',
        key: 'pchaseName',
        width: 450,
      },
      {
        title: '采购信息类型',
        dataIndex: 'showType',
        key: 'showType',
        width: 155,
      },
      {
        title: '所属云集',
        dataIndex: 'guzhu',
        key: 'guzhu',
        width: 100,
      },
      {
        title: '发布时间',
        dataIndex: 'fbDate',
        key: 'fbDate',
        width: 132,
      },
      {
        title: '成交金额（元）',
        dataIndex: 'commitPay',
        key: 'commitPay',
        width: 125,
      },
      {
        title: '预算金额（元）',
        dataIndex: 'prePay',
        key: 'prePay',
        width: 125,
      },
      {
        title: '采购单位',
        dataIndex: 'pchaseCp',
        key: 'pchaseCp',
        width: 250,
      },
      {
        title: '采购联系人',
        dataIndex: 'payAContact',
        key: 'payAContact',
        width: 110,
      },
      {
        title: '采购单位电话',
        dataIndex: 'payAPhone',
        key: 'payAPhone',
        width: 110,
      },
      {
        title: '成交单位',
        dataIndex: 'commitCp',
        key: 'commitCp',
        width: 250,
      },
      {
        title: '成交单位联系人',
        dataIndex: 'payBContact',
        key: 'payBContact',
        width: 130,
      },
      {
        title: '成交单位电话',
        dataIndex: 'payBPhone',
        key: 'payBPhone',
        width: 110,
      },
    ];

    const _yunjiList = Object.entries(get(yunjiList, 'data.data', {})).map(
      v => ({ key: v[0], value: v[1] }),
    );
    const yunjiCode = get(yunjiList, 'data.code', 0);

    if (_yunjiList.length > 0 && table.guzhu === undefined) {
      this.props.commonAction({
        table: {
          guzhu: _yunjiList[0].key,
        },
      });
    }
    const queryData = {
      xmbh: table.xmbh || ' ',
      gg_name: table.gg_name || ' ',
      pchaseType: table.pchaseType || '',
      phcaseMoney: table.phcaseMoney || '',
      fb_start_date: table.fb_start_date || '',
      fb_end_date: table.fb_end_date || '',
      guzhu: table.guzhu
        ? table.guzhu
        : _yunjiList[0] ? _yunjiList[0].key : 'XXX',
    };
    return (
      <div className="root">
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/getYunjiList"
          statePath={`${StateName}.yunjiList`}
        />
        {yunjiCode === 200 && (
          <Query
            method="get"
            url="{apiUrl}/op/v1/pchaseinfo/showPcharseInfo"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              ...queryData,
            }}
          />
        )}
        <Collapse
          defaultActiveKey="1"
          accordion
          onChange={this.onChangeCollapse}
        >
          <Panel header="筛选条件" key="1">
            <WrappedQueryForm query={this.query} yunjiList={_yunjiList} />
          </Panel>
        </Collapse>
        <div className="toolBar">
          {global.App && (
            <Button
              icon="upload"
              type="primary"
              href={`${get(
                global,
                'App.apiUrl',
              )}/op/v1/pchaseinfo/excelExport?${qs.stringify(queryData)}`}
            >
              导出Excel
            </Button>
          )}
        </div>
        <Xtable
          onRef={inst => {
            this.tableInst = inst;
          }}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          needRowSelection={false}
          className={s.full}
          data={this.props.table}
        />
      </div>
    );
  }

  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
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
  withStyles(
    s,
    buttonStyle,
    formStyle,
    gridStyle,
    inputStyle,
    iconStyle,
    selectStyle,
    collapseStyle,
    dateStyle,
    animateStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(ProcurementList);
