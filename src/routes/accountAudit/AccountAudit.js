import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Form, Button, Input, message } from 'antd';

// import Link from '../../components/Link';

import formStyle from '../../antdTheme/form/style/index.less';
import buttonStyle from '../../antdTheme/button/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less'; // eslint-disable-line

import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './AccountAudit.css';

// 状态名
const StateName = 'accountAudit';
const FormItem = Form.Item;
const { TextArea } = Input;

// 默认状态
const defaultState = {
  test: 'default',
};

const stateAudit = {
  auditStatus: 2,
  accountStart: 0,
};

// 多行文本输入框
class RemarkTextArea extends React.Component {
  // 触发标签事件的函数声明

  handleSubmit = status => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result;
        try {
          result = await this.query.fetch({
            data: {
              buIdSecret: this.props.buIdSecret,
              userId: get(
                this.props.runtime,
                'user.userId',
                'zhouyidong@chinasofti.com',
              ),
              status,
              ...values,
            },
          });
        } catch (ex) {
          message.error('提交失败，请重试。');
        }
        if (result) {
          if (get(result, 'code', '') === 200) {
            if (get(result, 'data.result', '') === '审核提交成功') {
              message.success('审核提交成功');
              this.handleClose();
              this.props.successCallBack();
            } else {
              message.error(get(result, 'data.msg', '审核提交失败!'));
            }
          } else {
            message.error(get(result, 'message', '审核失败！'));
          }
        }
      }
    });
  };
  state = {
    // value: 1,
  };

  handleClose() {
    const actionOpts = { type: `accountManagement.drawer`, isGlobal: true };
    this.props.commonAction({ visible: false }, actionOpts);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Query
          onRef={query => {
            this.query = query;
          }}
          auto={false}
          url={`{apiUrl}/op/v1/supplier/saveAudit`}
          statePath={`${StateName}.submitData`}
        />
        <div className="section">
          <span>运营备注</span>
        </div>
        <FormItem style={{ marginTop: 15 }}>
          {getFieldDecorator('note', {})(
            <TextArea
              rows={4}
              maxLength={250}
              placeholder="这部分信息仅供内部查看的，不超过250字"
            />,
          )}
        </FormItem>

        <Button
          type="primary"
          className={s.button}
          size="large"
          onClick={() => {
            this.handleSubmit(1);
          }}
        >
          审核通过
        </Button>

        <Button
          className={s.button}
          size="large"
          onClick={() => {
            this.handleSubmit(2);
          }}
        >
          审核不通过
        </Button>

        {/* <Button */}
        {/* className={s.button} */}
        {/* type="primary" */}
        {/* onClick={this.handleClose.bind(this)} */}
        {/* > */}
        {/* 返回 */}
        {/* </Button> */}
      </Form>
    );
  }
}

const WrappedNormalTextArea = Form.create()(RemarkTextArea);

// 页面类
class AccountAudit extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
  };

  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  render() {
    const {
      accountManagement = {},
      buIdSecret,
      auditStatus,
      runtime,
      data,
    } = this.props;
    const detail = get(accountManagement, 'drawer.data') || {};
    const visible = get(accountManagement, 'drawer.visible', false);
    const note = get(data, 'data.data.serviceAccount.note', '');
    const applayfrom = get(data, 'data.data.serviceAccount.applayfrom', '');
    return (
      <div>
        <Query
          url="{apiUrl}/op/v1/supplier/getSuppluerAuditDetails"
          data={{
            buIdSecret,
          }}
          statePath={`${StateName}.data`}
        />
        <div className="detail-sub-title">{detail.buName}</div>
        <div className="detail-container">
          <div className="section">
            <span>单位信息</span>
          </div>
          <table className="detail-table" style={{ height: 170 }}>
            <tbody>
              <tr>
                <td style={{ width: 140 }}>供应商名称：</td>
                <td className="last">
                  <span>{detail.buName}</span>
                  <a
                    className={s.look}
                    href={`${get(runtime, 'config.apiUrl', '').replace(
                      '/jfyjop',
                      '',
                    )}${detail.buInfoUrl}`}
                    target="_blank"
                  >
                    查看企业刻画
                  </a>
                </td>
                <td style={{ paddingLeft: 25 }}>企业认证：</td>
                <td>
                  {detail.authSatus !== 1 && (
                    <span className="status-tag orange">待认证</span>
                  )}
                  {detail.authSatus === 1 && (
                    <span className="status-tag green">已认证</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>统一社会信用代码：</td>
                <td className="last">
                  <span>{detail.bulicenseCode}</span>
                </td>
                <td style={{ paddingLeft: 25 }}>账户状态：</td>
                <td>
                  {stateAudit.accountStart === 0 && (
                    <span className="status-tag green">正常</span>
                  )}
                  {stateAudit.accountStart === 1 && (
                    <span className="status-tag orange">异常</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>联系人：</td>
                <td className="last">
                  <span>{detail.ownerName}</span>
                  <a
                    className={s.look}
                    href={`${get(runtime, 'config.apiUrl', '').replace(
                      '/jfyjop',
                      '',
                    )}${detail.buInfoUrl}`}
                    target="_blank"
                  >
                    查看数据DD刻画
                  </a>
                </td>
                <td colSpan={2} style={{ opacity: 0 }} />
              </tr>
              <tr>
                <td>联系方式：</td>
                <td className="last">
                  <span>{detail.ownerMobile}</span>
                </td>
                <td colSpan={2} style={{ opacity: 0 }} />
              </tr>
              <tr>
                <td>注册地：</td>
                <td className="last">
                  <span>{applayfrom}</span>
                </td>
                <td colSpan={2} style={{ opacity: 0 }} />
              </tr>
            </tbody>
          </table>
          {auditStatus * 1 !== 0 ? (
            <div>
              <div className="section">
                <span>运营备注</span>
              </div>
              <div className={s.content_label}>{detail.note || note}</div>
            </div>
          ) : (
            <WrappedNormalTextArea
              visible={visible}
              commonAction={this.props.commonAction}
              buIdSecret={this.props.buIdSecret}
              successCallBack={this.props.successCallBack}
            />
          )}
        </div>
      </div>
    );
  }
}

// 状态映射
const mapState = state => ({
  accountManagement: state.accountManagement,
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

// 功能组合
export default compose(
  withStyles(s, formStyle, buttonStyle, inputStyle, messageStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(AccountAudit);
