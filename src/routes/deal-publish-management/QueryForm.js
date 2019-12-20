import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, Form, Col, Row, Input, Select } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './QueryForm.css';

import DateRange from '../../components/DateRange';
import XQuery from '../../components/XQuery';

const StateName = 'DealPublishManagement';
const FormItem = Form.Item;
const { Option } = Select;
const formCol = {
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

const formCol2 = {
  wrapperCol: {
    span: 21,
  },
  labelCol: {
    span: 3,
  },
  style: {
    width: '100%',
  },
};

// 查询表单
class QueryForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { yunjis } = this.props;
    return (
      <Form layout="inline" style={{ ...this.props.style, padding: '0 10px' }}>
        <XQuery>
          <FormItem label="公告标题" {...formCol}>
            {getFieldDecorator('noticeName')(<Input autoFocus />)}
          </FormItem>
          <FormItem label="项目编号" {...formCol}>
            {getFieldDecorator('projectId')(<Input />)}
          </FormItem>
          <FormItem label="采购单位" {...formCol}>
            {getFieldDecorator('projectName')(<Input />)}
          </FormItem>
          <FormItem label="采购方式" {...formCol}>
            {getFieldDecorator('orderType')(<Input />)}
          </FormItem>
          <FormItem label="云集归属" {...formCol}>
            {getFieldDecorator('yunjis', {
              initialValue: yunjis[0] ? yunjis[0].code : '',
            })(
              <Select getPopupContainer={() => document.querySelector(`.root`)}>
                {yunjis.map(y => (
                  <Option key={y.memo} value={y.code}>
                    {y.cnname}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="发布时间" colSpan={2} {...formCol}>
            {getFieldDecorator('putTime')(
              <DateRange
                style={{ width: '80%'}}
                getCalendarContainer={() => document.querySelector(`.root`)}
              />,
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
    );
  }
  resetForm = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({ putTime: { start: null, end: null } });
  };
  query = () => {
    const values = this.props.form.getFieldsValue();
    const data = {};
    for (const key in values) {
      if (key === 'putTime') {
        if (values[key] && values[key].start) {
          data.orderTime = values[key].start.format('YYYY-MM-DD');
        }
        if (values[key] && values[key].end) {
          data.orderEndTime = values[key].end.format('YYYY-MM-DD');
        }
      } else if (values[key] !== undefined) {
        data[key] = values[key];
      } else {
        data[key] = '';
      }
    }
    this.props.commonAction({ table: { conditions: data } });
  };
}

const mapState = state => ({
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
  ),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
  Form.create(),
)(QueryForm);
