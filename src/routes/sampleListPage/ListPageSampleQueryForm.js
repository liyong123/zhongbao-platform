import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Button, Form, Col, Row, Input } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';

const StateName = 'listPageSample';
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
class ListPageSampleQueryForm extends React.Component {
  resetForm = () => {
    this.props.form.resetFields();
  };

  query = () => {
    this.props.commonAction({
      listRefreshKey: Math.random(),
    });
  };

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
        <Row className="searchBts">
          <Col span={24}>
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
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(buttonStyle, formStyle, gridStyle, inputStyle, iconStyle),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
  Form.create(),
)(ListPageSampleQueryForm);
