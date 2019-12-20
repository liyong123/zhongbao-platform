import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Form, Button, Input, Select, Row, Col } from 'antd';

import formStyle from '../../antdTheme/form/style/index.less';
import buttonStyle from '../../antdTheme/button/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import tableStyle from '../../antdTheme/table/style/index.less';

// import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './CreateOrganization.css';

// 状态名
const StateName = 'createOrganization';
const FormItem = Form.Item;
const { Option } = Select;

// 默认状态
const defaultState = {
  test: 'default',
};

// 创建新单位
class CreateNew extends React.Component {
  // 触发标签事件的函数声明
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleSelectChange = value => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };

    const formItemLayoutA = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <h3 className={s.title}>添加采购单位</h3>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem
              {...formItemLayoutA}
              label="登陆账号："
              extra="账号由省份简称（江苏-js）+ 行政区号（ 南京市-雨花区-320114 ）+ 财政预算管理系统-预算单位编码 （998333024） 组成。"
            >
              {getFieldDecorator('loginAccount', {
                rules: [{ required: true, message: '请填写预算单位编码' }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入登录账号"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="primary">检测账号</Button>
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="单位名称：">
              {getFieldDecorator('organizationName', {
                rules: [{ required: true, message: '请填写企业名称' }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入单位名称"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="primary">检测</Button>
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="社会信用代码：">
              {getFieldDecorator('socialCreditCode', {
                rules: [{ required: false }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入社会信用代码"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="联系人：">
              {getFieldDecorator('linkman', {
                rules: [{ required: true, message: '请填写联系人' }],
              })(
                <Input style={{ width: '100%' }} placeholder="请输入联系人" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="联系人手机号：">
              {getFieldDecorator('linkmanPhone', {
                rules: [{ required: false }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入联系人手机号"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="邮箱：">
              {getFieldDecorator('E-mail', {
                rules: [{ required: false }],
              })(<Input style={{ width: '100%' }} placeholder="请输入邮箱" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="所属云集：">
              {getFieldDecorator('belongYun', {
                rules: [{ required: true, message: '请选择所属云集' }],
                defaultValue: '0',
              })(
                <Select style={{ width: '100%' }} onChange={this.selectChange}>
                  <Option value="0">南京云集</Option>
                  <Option value="1">西安云集</Option>
                  <Option value="2">镇江云集</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={1} />
          <Col span={3}>
            <FormItem {...formItemLayout}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem {...formItemLayout}>
              <Button>返回列表</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

// 查看单位详情
class ViewDetails extends React.Component {
  // 触发标签事件的函数声明

  render() {
    return (
      <div onSubmit={this.handleSubmit}>
        <h3 className={s.title}>采购单位-北京飞天互联信息技术有限公司</h3>
        <div className={s.block}>
          <h4>
            单位信息 <span>编辑&gt;&gt;</span>
          </h4>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
          <p>
            <span>单位名称：</span>
            <span> 北京飞天互联信息技术有限公司</span>
          </p>
        </div>
        <div className={s.block} />
        <div className={s.block} />
      </div>
    );
  }
}

// 页面类
class CreateOrganization extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
  };

  onClickChange = () => {
    this.props.commonAction(
      {
        test: Math.random(),
      },
      'myAction',
    );
  };

  render() {
    // const {  } = this.props;
    const WrappedCreateNew = Form.create()(CreateNew);
    return (
      <div className={s.root}>
        <h3 className={s.topic}>采购单位管理</h3>
        {false && <WrappedCreateNew />}
        <ViewDetails />
      </div>
    );
  }
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
  withStyles(
    s,
    formStyle,
    buttonStyle,
    inputStyle,
    selectStyle,
    gridStyle,
    tableStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(CreateOrganization);
