import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Button, Form, Icon, Input, message } from 'antd';
import buttonStyle from '../../../antdTheme/button/style/index.less';
import formStyle from '../../../antdTheme/form/style/index.less';
import iconStyle from '../../../antdTheme/icon/style/index.less';
import inputStyle from '../../../antdTheme/input/style/index.less';
import messageStyle from '../../../antdTheme/message/style/index.less'; // eslint-disable-line
import { connect } from '../../../store/redux';
import { commonReducer } from '../../../store/common.reducer';
import { commonAction } from '../../../store/common.action';
import Query from '../../../components/Query';
import ScrollArea from '../../../components/ScrollBar/js/ScrollAreaWithCss';
import moment from 'moment/moment';
import s from './Auditing.css';

const StateName = 'supplierAuditing';
const defaultState = {
  test: 'default',
};
const InputTextArea = Input.TextArea;
const FormItem = Form.Item;

// 多行文本输入框
class AuditingTextArea extends React.Component {
  // 触发标签事件的函数声明

  handleSubmit = status => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result;
        try {
          result = await this.query.fetch({
            data: {
              buIdSecret: this.props.buIdSecret,
              // userId: get(
              //   this.props.runtime,
              //   'user.userId',
              //   'zhouyidong@chinasofti.com',
              // ),
              status,
              contactPhone: this.props.contactPhone,
              ...values,
            },
          });
        } catch (ex) {
          message.error('提交失败，请重试。');
        }
        if (result) {
          if (get(result, 'code', '') === 200) {
            if (get(result, 'data.resultType', '') === '200') {
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

  handleClose() {
    const actionOpts = { type: `supplierExamList.drawer`, isGlobal: true };
    this.props.commonAction({ visible: false }, actionOpts);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{ marginBottom: 20 }}>
        <Query
          onRef={query => {
            this.query = query;
          }}
          auto={false}
          url={`{apiUrl}/op/v1/supplier/saveApply`}
          statePath={`${StateName}.submitData`}
        />
        <div className="section">
          <span>备注</span>
        </div>
        <FormItem style={{ marginTop: 20 }}>
          {getFieldDecorator('note', {})(
            <InputTextArea
              rows={4}
              maxLength={250}
              placeholder="当退出时，该信息将通知申请人"
            />,
          )}
        </FormItem>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            this.handleSubmit(1);
          }}
        >
          审核通过
        </Button>
        <Button
          size="large"
          onClick={() => {
            this.handleSubmit(2);
          }}
        >
          审核不通过
        </Button>
      </Form>
    );
  }
}

const WrappedAuditingTextArea = Form.create()(AuditingTextArea);

class SupplierAuditing extends React.Component {
  render() {
    const { buIdSecret, auditStatus } = this.props;
    const detail = get(this.props.detail, 'data.data.contactInfo') || {};
    const auditLogList = get(this.props.detail, 'data.data.auditLogList') || [];
    const serviceAccount =
      get(this.props.detail, 'data.data.serviceAccount') || {};
    const sfzzmUrl = get(detail, 'idCardObverse')
      ? `${get(this.props.runtime, 'config.apiUrl', '').replace(
          /\/\w*\/?$/,
          '/yjusers',
        )}/buauth/download/${buIdSecret}/${detail.idCardObverse}`
      : './images/sfzzm.png';
    const sfzfmUrl = get(detail, 'idCardReverse')
      ? `${get(this.props.runtime, 'config.apiUrl', '').replace(
          /\/\w*\/?$/,
          '/yjusers',
        )}/buauth/download/${buIdSecret}/${detail.idCardReverse}`
      : './images/sfzfm.png';
    const yyzzUrl = get(detail, 'licImg')
      ? `${get(this.props.runtime, 'config.apiUrl', '').replace(
          /\/\w*\/?$/,
          '/yjusers',
        )}/buauth/download/${buIdSecret}/${detail.licImg}`
      : './images/yyzz.png';
    return (
      <div>
        <Query
          url="{apiUrl}/op/v1/supplier/getSuppluerAuditDetails"
          data={{
            buIdSecret,
          }}
          statePath={`${StateName}.detail`}
        />
        <div className="detail-sub-title">
          <span style={{ color: '#4a4a4a', fontSize: 16, fontWeight: 500 }}>
            {detail.buName}
          </span>
          <span style={{ marginLeft: 20 }}>
            <Icon type="idcard" />
            <span style={{ fontSize: 12 }}>认证资料</span>
          </span>
          <span className={s.topBarMsg}>
            <span>姓名:</span>
            <span>{detail.juridicalPerson}</span>
          </span>
          <span className={s.topBarMsg}>
            <span>账户:</span>
            <span>{detail.userId}</span>
          </span>
          <span className={s.topBarMsg}>
            <span>手机号:</span>
            <span>{detail.contactTel}</span>
          </span>
        </div>
        <ScrollArea
          stopScrollPropagation
          smoothScrolling="true"
          speed={10}
          className="detail-container"
          style={{
            position: 'absolute',
            top: 111,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <table style={{ width: '80%' }} className="detail-table">
            <tbody>
              <tr style={{ height: 30 }}>
                <td style={{ width: 180 }}>港澳台及外国企业入驻：</td>
                <td>{detail.overeeas === 0 ? '否' : '是'}</td>
                <td style={{ width: 180 }}>法定代表人姓名：</td>
                <td>{detail.juridicalPerson}</td>
              </tr>
              <tr style={{ height: 30 }}>
                <td>企业法人名称：</td>
                <td>{detail.buName}</td>
                <td>法定代表人身份证号：</td>
                <td>{detail.jurCode}</td>
              </tr>
              <tr style={{ height: 30 }}>
                <td>统一社会信用代码：</td>
                <td colSpan={3}>{serviceAccount.bulicenseCode}</td>
              </tr>
              <tr valign="top">
                <td>法人代表身份证：</td>
                <td colSpan={3}>
                  <div className={s.eachImgDiv}>
                    <img src={sfzzmUrl} alt="身份证正照" />
                  </div>
                  <div
                    className={s.eachImgDiv}
                    style={{
                      marginLeft: 40,
                    }}
                  >
                    <img src={sfzfmUrl} alt="身份证反照" />
                  </div>
                </td>
              </tr>
              <tr valign="top">
                <td>营业执照</td>
                <td colSpan={3}>
                  <div className={s.eachImgDiv}>
                    <img src={yyzzUrl} alt="营业执照图片" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section">
            <span>平台审核</span>
          </div>
          <div className={s.platformAuditSteps}>
            <table>
              <tbody>
                {auditLogList.length > 0
                  ? auditLogList.map(item => (
                      <tr>
                        <td>
                          {moment(item.auditTime).format('YYYY-MM-DD HH:mm:ss')}
                        </td>
                        <td>{item.actorName}</td>
                        <td>{item.action}</td>
                      </tr>
                    ))
                  : '暂无审核'}
              </tbody>
            </table>
          </div>
          {auditStatus === 0 && (
            <div>
              <WrappedAuditingTextArea
                contactPhone={detail.contactTel}
                commonAction={this.props.commonAction}
                buIdSecret={this.props.buIdSecret}
                successCallBack={this.props.successCallBack}
              />
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }
}

const mapState = state => ({
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle, formStyle, iconStyle, inputStyle, messageStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(SupplierAuditing);
