import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, Form, Col, Row, Input, Radio, Select } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';
import radioStyle from '../../antdTheme/radio/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './SupplierExamListQueryForm.css';
import XQuery from '../../components/XQuery';

const StateName = 'supplierExamList';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;

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
    span: 20,
  },
  labelCol: {
    span: 0,
  },
  style: {
    width: '100%',
  },
};

// 查询表单
class SupplierExamListQueryForm extends React.Component {
  resetForm = () => {
    this.props.form.resetFields();
  };
  querySearch = () => {
    this.props.query.fetch({ data: this.props.form.getFieldsValue() });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props;
    return (
      <Form layout="inline" style={{ ...this.props.style, padding: '0 10px' }}>
        <XQuery>
          <FormItem label="提交时间" colSpan={colNum =>colNum === 6 ? 3 : 2 } {...formItemLayout2}>
            {getFieldDecorator('serviceOrder', { initialValue: '' })(
              <RadioGroup buttonStyle="solid">
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="one">今天</RadioButton>
                <RadioButton value="two">最近一周</RadioButton>
                <RadioButton value="three">最近一月</RadioButton>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem label="审核时间" colSpan={colNum => colNum === 6 ? 3 : 2 } {...formItemLayout2}>
            {getFieldDecorator('payflag', { initialValue: '' })(
              <RadioGroup buttonStyle="solid">
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="one">今天</RadioButton>
                <RadioButton value="two">最近一周</RadioButton>
                <RadioButton value="three">最近一月</RadioButton>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem label="注册平台" {...formItemLayout2}>
            {getFieldDecorator('applyFrom', {
              initialValue: list[0] ? list[0].code : '',
            })(
              <Select
                style={{ maxWidth: '458px' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {list.map(l => (
                  <Option key={l.memo} value={l.code}>
                    {l.cnname}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="审核状态" {...formItemLayout2}>
            {getFieldDecorator('status', {
              initialValue: '',
            })(
              <Select
                style={{ maxWidth: '458px' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                <Option key="" value="">
                  全部
                </Option>
                <Option key="0" value="0">
                  待审核
                </Option>
                <Option key="1" value="1">
                  审核通过
                </Option>
                <Option key="-1" value="-1">
                  审核未通过
                </Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="搜索"
            colSpan={2}
            style={{ width: '100%' }}
            {...formItemLayout2}
          >
            {getFieldDecorator('limited', {
              initialValue: '',
            })(
              <Select
                style={{ width: '26%', maxWidth: '119.08px' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                <Option value="2">企业法人</Option>
                <Option value="1">企业显示名称</Option>
                <Option value="0">法定代表人</Option>
              </Select>,
            )}
            {getFieldDecorator('displayNme')(
              <Input
                type="text"
                style={{
                  width: '73.5%',
                  marginLeft: '0.5%',
                  maxWidth: '336.63px',
                }}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.querySearch} type="primary">
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
    radioStyle,
    selectStyle,
  ),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
  Form.create(),
)(SupplierExamListQueryForm);
