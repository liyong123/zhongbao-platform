import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, Form, Col, Row, Input } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './AuditManagementQueryForm.css';

const StateName = 'auditManagement';
const FormItem = Form.Item;
const colWidth = 12; // 两列
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

// 查询表单
class AuditManagementQueryForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" style={this.props.style}>
        <Row>
          <Col span={colWidth}>
            <FormItem label="项目编号" {...formCol}>
              {getFieldDecorator('XMBH')(<Input />)}
            </FormItem>
          </Col>
          <Col span={colWidth}>
            <FormItem label="项目名称" {...formCol}>
              {getFieldDecorator('GG_NAME')(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              onClick={this.query}
              style={{ marginRight: 20 }}
              type="primary"
            >
              查询
            </Button>
            <Button onClick={this.resetForm}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
  resetForm = () => {
    this.props.form.resetFields();
  };
  query = () => {
    this.props.query.fetch({ data: this.props.form.getFieldsValue() });
  };
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle, formStyle, gridStyle, inputStyle, iconStyle),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
  Form.create(),
)(AuditManagementQueryForm);
