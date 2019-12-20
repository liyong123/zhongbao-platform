import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';

import { Form, message, Input, Button } from 'antd';
import formStyle from '../../antdTheme/form/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import Query from '../../components/Query';
import s from './auditPage.css';

const StateName = 'procurementAccount';
const FormItem = Form.Item;
const { TextArea } = Input;

const defaultState = {
  importBulk: 0,
  table: {
    current: 1,
    pageSize: 10,
  },
  showLookEdit: {
    value: 0,
    content: '采购单位管理',
  },
};

class RemarkTextArea extends React.Component {
  // 触发标签事件的函数声明

  handleSubmit = status => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result;
        try {
          result = await this.query.fetch({
            method: 'POST',
            data: {
              buidSecret: this.props.buIdSecret,
              status,
              ...values,
            },
          });
        } catch (ex) {
          message.error('提交失败，请重试。');
        }
        if (result) {
          if (get(result, 'code', '') === 200) {
            // 此处判断条件需要优化
            if (get(result, 'message', '').indexOf('处理成功') !== -1) {
              message.success('审核提交成功');
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Query
          onRef={query => {
            this.query = query;
          }}
          auto={false}
          url={`{apiUrl}/op/v1/buyers/saveAudit`}
          statePath={`${StateName}.submitData`}
        />
        <FormItem>
          {getFieldDecorator('note', {})(
            <TextArea
              rows={4}
              maxLength={250}
              placeholder="这部分信息仅供内部查看的，不超过250字"
            />,
          )}
        </FormItem>

        <div>
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
              this.handleSubmit(0);
            }}
          >
            审核不通过
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedNormalTextArea = Form.create()(RemarkTextArea);

// 操作栏
class AuditPage extends React.Component {
  render() {
    const { lookDetailData } = this.props;
    const lookData = get(lookDetailData, 'data.data', {}) || {};
    for (const key in lookData) {
      if (lookData[key] === null || lookData[key] === undefined) {
        lookData[key] = '暂无';
      }
    }

    return (
      <div onSubmit={this.handleSubmit}>
        <div className="detail-sub-title">
          采购单位 - <span style={{ fontSize: 13 }}>{lookData.buName}</span>
        </div>
        <div className="detail-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td valign="top" style={{ width: 500 }}>
                  <div className="section">
                    <span>单位信息</span>
                  </div>
                  <table style={{ height: 200 }} className="detail-table">
                    <tbody>
                      <tr>
                        <td style={{ width: 200 }}>单位名称：</td>
                        <td>{lookData.buName}</td>
                      </tr>
                      <tr>
                        <td>统一社会信息代码：</td>
                        <td>{lookData.bulicenseCode}</td>
                      </tr>
                      <tr>
                        <td>负责人：</td>
                        <td>{lookData.ownerName}</td>
                      </tr>
                      <tr>
                        <td>负责人手机号：</td>
                        <td>{lookData.ownerMobile}</td>
                      </tr>
                      <tr>
                        <td>注册来源：</td>
                        <td>
                          {(() => {
                            switch (lookData.codetype) {
                              case 0:
                                return '短信邀请码';
                              case 1:
                                return '团队邀请';
                              case 2:
                                return '运营注册';
                              case '':
                              case -1:
                              default:
                                return '自助注册';
                            }
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td>注册时间：</td>
                        <td>{lookData.registerTime}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td valign="top">
                  <div className="section">
                    <span>账户状态</span>
                  </div>
                  <table
                    className="detail-table"
                    style={{ height: 104, width: '100%' }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: 130 }}>个人认证：</td>
                        <td style={{ width: 130 }}>
                          {!lookData.perStatus ? (
                            <span className="status-tag orange">未认证</span>
                          ) : (
                            <span className="status-tag green">已认证</span>
                          )}
                        </td>
                        <td style={{ width: 130 }}>账户状态：</td>
                        <td style={{ width: 130 }}>
                          {lookData.accountStatus == 4 ? (
                            <span className="status-tag orange">禁止</span>
                          ) : (
                            <span className="status-tag green">正常</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>企业认证：</td>
                        <td>
                          {lookData.authSatus ? (
                            <span className="status-tag orange">待认证</span>
                          ) : (
                            <span className="status-tag green">已认证</span>
                          )}
                        </td>
                        <td>所属云集：</td>
                        <td>
                          {(() => {
                            switch (lookData.guzhu) {
                              case 1:
                                return <span>南京云集</span>;
                              case 2:
                                return <span>西安云集</span>;
                              case 3:
                                return <span>镇江云集</span>;
                              default:
                                return <span>暂无</span>;
                            }
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td>资金账户状态：</td>
                        <td colSpan={3}>
                          {!lookData.isOpenAccount ? (
                            <span className="status-tag orange">未开通</span>
                          ) : (
                            <span className="status-tag green">已开通</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ height: 96 }} />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section">
            <span>运营备注：</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <WrappedNormalTextArea
              commonAction={this.props.commonAction}
              buIdSecret={(lookData || {}).buIdSecret}
              successCallBack={this.close.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  close() {
    const questData = {
      pageSize: this.props.table.pageSize || 10,
      pageNum: this.props.table.current || 1,
    };
    this.props.query.fetch({ data: questData });
    const actionOpts = { type: `procurementAccount.drawer`, isGlobal: true };
    this.props.commonAction({ visible: false }, actionOpts);
  }
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, formStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(AuditPage);
