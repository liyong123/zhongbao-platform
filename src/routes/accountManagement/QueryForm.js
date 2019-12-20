import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, Form, Input, Select, Col, Row } from 'antd';

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
import XQuery from '../../components/XQuery';

const StateName = 'accountManagement';
const { Option } = Select;
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
const formItemLayou2 = {
  wrapperCol: {
    span: 16,
  },
  labelCol: {
    span: 8,
  },
  style: {
    width: '100%',
  },
};
// 审核状态
const Status = [
  {
    name: '全部',
    key: -1,
  },
  {
    name: '待审核',
    key: 0,
  },
  {
    name: '通过',
    key: 1,
  },
  {
    name: '未通过',
    key: 2,
  },
];

// 查询表单
class QueryForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props;
    return (
      <Form layout="inline" style={{ padding: '0 10px' }}>
        <XQuery>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('buName')(
              <Input autoFocus style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem label="社会信用代码" {...formItemLayou2}>
            {getFieldDecorator('bulicenseCode')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem label="联系人" {...formItemLayout}>
            {getFieldDecorator('ownerName')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem label="联系方式" {...formItemLayout}>
            {getFieldDecorator('ownerMobile')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem label="审核状态" {...formItemLayou2}>
            {getFieldDecorator('auditStatus')(
              <Select
                style={{ width: '100%' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {Status.map(b => (
                  <Option key={b.key} value={b.key}>
                    {b.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="注册平台" {...formItemLayout}>
            {getFieldDecorator('applayfrom', {
              initialValue: list[0] ? list[0].code : '',
            })(
              <Select
                style={{ width: '100%' }}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {list.map(b => (
                  <Option key={b.memo} value={b.code}>
                    {b.cnname}
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
              <td className="label" style={{ width: 73 }}>
                名称：
              </td>
              <td colSpan={3}>
                {getFieldDecorator('buName')(<Input style={{ width: 460 }} />)}
              </td>
              <td className="label" style={{ width: 143 }}>
                统一社会信用代码：
              </td>
              <td colSpan={3}>
                {getFieldDecorator('bulicenseCode')(
                  <Input style={{ width: 460 }} />,
                )}
              </td>
            </tr>
            <tr>
              <td className="label" style={{ width: 73 }}>
                联系人：
              </td>
              <td>
                {getFieldDecorator('ownerName')(
                  <Input style={{ width: 180 }} />,
                )}
              </td>
              <td className="label" style={{ width: 86 }}>
                联系方式：
              </td>
              <td>
                {getFieldDecorator('ownerMobile')(
                  <Input style={{ width: 180 }} />,
                )}
              </td>
              <td className="label" style={{ width: 86 }}>
                审核状态：
              </td>
              <td>
                {getFieldDecorator('auditStatus')(
                  <Select style={{ width: 180 }}>
                    {Status.map(b => (
                      <Option key={b.key} value={b.key}>
                        {b.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </td>
              <td className="label" style={{ width: 86 }}>
                注册平台：
              </td>
              <td>
                {getFieldDecorator('applayfrom', {
                  initialValue: list[0] ? list[0].code : '',
                })(
                  <Select style={{ width: 180 }}>
                    {list.map(b => (
                      <Option key={b.memo} value={b.code}>
                        {b.cnname}
                      </Option>
                    ))}
                  </Select>,
                )}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right' }} colSpan={8}>
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
    const values = this.props.form.getFieldsValue();
    const data = {};
    for (const key in values) {
      if (values[key] !== undefined) {
        data[key] = values[key];
      } else {
        data[key] = '';
      }
    }
    this.props.commonAction({ table: { current: 1, conditions: data } });
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
