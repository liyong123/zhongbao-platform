import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, Form, Input, Select, Col, Row } from 'antd';

import XQuery from '../../components/XQuery';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './ProcurementAccountQueryForm.css';

const StateName = 'ProcurementAccountPages';
const { Option } = Select;

const FormItem = Form.Item;

const colWidth = 8; // 两列
const formItemLayout = {
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

const formItemLayout2 = {
  wrapperCol: {
    span: 12,
  },
  labelCol: {
    span: 12,
  },
  style: {
    width: '100%',
  },
};
const defaultState = {
  table: {
    current: 1,
    pageSize: 10,
  },
};

// 查询表单
class ListPageSampleQueryForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { yunJiList } = this.props;
    return (
      <Form layout="inline" style={{ padding: '0 10px' }}>
        <XQuery>
          <FormItem {...formItemLayout} label="单位名称">
            {getFieldDecorator('organizationName')(
              <Input autoFocus style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="社会信用代码">
            {getFieldDecorator('socialCreditCode')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="账号信息">
            {getFieldDecorator('accountInfo')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人">
            {getFieldDecorator('linkman')(<Input style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人手机号">
            {getFieldDecorator('linkmanPhone')(
              <Input style={{ width: '100%' }} />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="审核状态">
            {getFieldDecorator('auditStatus', {
              initialValue: -1,
            })(
              <Select
                style={{ width: '100%' }}
                onChange={this.selectChange}
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                <Option value={-1}>全部</Option>
                <Option value={0}>待审核</Option>
                <Option value={1}>通过</Option>
                <Option value={2}>审核不通过</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属云集">
            {getFieldDecorator('belongYun', {
              initialValue: yunJiList[0] ? yunJiList[0].count : '',
            })(
              <Select
                style={{ width: '100%' }}
                getPopupContainer={() => document.querySelector(`.root`)}
                onChange={this.selectChange}
              >
                {yunJiList.map(yj => (
                  <Option value={yj.count}>{yj.yunjitext}</Option>
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
        {/* <Form layout="inline" style={this.props.style}> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>单位名称：</label> */}
        {/* {getFieldDecorator('organizationName')( */}
        {/* <Input className={s.itemWrapperCol} />, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>社会信用代码：</label> */}
        {/* {getFieldDecorator('socialCreditCode')( */}
        {/* <Input className={s.itemWrapperCol} />, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>账号信息：</label> */}
        {/* {getFieldDecorator('accountInfo')( */}
        {/* <Input className={s.itemWrapperCol} />, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>联系人：</label> */}
        {/* {getFieldDecorator('linkman')( */}
        {/* <Input className={s.itemWrapperCol} />, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>联系人手机号：</label> */}
        {/* {getFieldDecorator('linkmanPhone')( */}
        {/* <Input className={s.itemWrapperCol} />, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>审核状态：</label> */}
        {/* {getFieldDecorator('auditStatus', { */}
        {/* initialValue: -1, */}
        {/* })( */}
        {/* <Select */}
        {/* className={s.itemWrapperCol} */}
        {/* onChange={this.selectChange} */}
        {/* getPopupContainer={() => document.querySelector(`.root`)} */}
        {/* > */}
        {/* <Option value={-1}>全部</Option> */}
        {/* <Option value={0}>待审核</Option> */}
        {/* <Option value={1}>通过</Option> */}
        {/* <Option value={2}>审核不通过</Option> */}
        {/* </Select>, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemCol}> */}
        {/* <label className={s.itemLabelCol}>所属云集：</label> */}
        {/* {getFieldDecorator('belongYun', { */}
        {/* initialValue: yunJiList[0] ? yunJiList[0].count : '', */}
        {/* })( */}
        {/* <Select */}
        {/* className={s.itemWrapperCol} */}
        {/* getPopupContainer={() => document.querySelector(`.root`)} */}
        {/* onChange={this.selectChange} */}
        {/* > */}
        {/* {yunJiList.map(yj => ( */}
        {/* <Option value={yj.count}>{yj.yunjitext}</Option> */}
        {/* ))} */}
        {/* </Select>, */}
        {/* )} */}
        {/* </div> */}
        {/* <div className={s.formItemBtnCol}> */}
        {/* <Button onClick={this.query} type="primary"> */}
        {/* 查询 */}
        {/* </Button> */}
        {/* <Button onClick={this.resetForm} style={{ marginRight: '2%' }}> */}
        {/* 重置 */}
        {/* </Button> */}
        {/* </div> */}
      </Form>
    );
  }
  resetForm = () => {
    this.props.form.resetFields();
  };
  query = () => {
    const values = this.props.form.getFieldsValue();
    const questData = {
      userId: values.accountInfo || '',
      buName: values.organizationName || '',
      buLicenseId: values.socialCreditCode || '',
      contractName: values.linkman || '',
      contractPhone: values.linkmanPhone || '',
      ...(values.auditStatus !== -1 && values.auditStatus !== undefined
        ? { status: values.auditStatus }
        : {}),
      guzhu: values.belongYun || '',
      pageSize: this.props.table.pageSize || 10,
      pageNum: this.props.table.current || 1,
    };
    this.props.commonAction(
      {
        table: {
          ...questData,
        },
      },
      { type: `procurementAccount`, isGlobal: true },
    );
    this.props.query.fetch({ data: questData });
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
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(ListPageSampleQueryForm);
