import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';

import { Form, Button, message } from 'antd';
import Query from '../../components/Query';
import formStyle from '../../antdTheme/form/style/index.less';
import buttonStyle from '../../antdTheme/button/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './lookPage.css';

const StateName = 'LookPage';

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

// 操作栏
class LookPage extends React.Component {
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
        <Query
          onRef={query => {
            this.query = query;
          }}
          auto={false}
          url={`{apiUrl}/op/v1/buyers/openAccount`}
          statePath={`${StateName}.submitData`}
        />
        <div className="detail-sub-title">
          采购单位 - <span style={{ fontSize: 13 }}>{lookData.buName}</span>
        </div>
        <div className="detail-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td valign="top">
                  <div className="section">
                    <span>单位信息</span>
                  </div>
                  <table
                    style={{ height: 200, width: '90%' }}
                    className="detail-table"
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: 170 }}>单位名称：</td>
                        <td className="last">{lookData.buName}</td>
                      </tr>
                      <tr>
                        <td>统一社会信息代码：</td>
                        <td className="last">{lookData.bulicenseCode}</td>
                      </tr>
                      <tr>
                        <td>负责人：</td>
                        <td className="last">{lookData.ownerName}</td>
                      </tr>
                      <tr>
                        <td>负责人手机号：</td>
                        <td className="last">{lookData.ownerMobile}</td>
                      </tr>
                      <tr>
                        <td>注册来源：</td>
                        <td className="last">
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
                        <td className="last">{lookData.registerTime}</td>
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
                    style={{ height: 135, width: '100%' }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: 120 }}>个人认证：</td>
                        <td style={{ width: 120 }}>
                          {!lookData.perStatus ? (
                            <span className="status-tag orange">未认证</span>
                          ) : (
                            <span className="status-tag green">已认证</span>
                          )}
                        </td>
                        <td style={{ width: 120 }}>账户状态：</td>
                        <td>
                          {lookData.accountStatus == 4 ? (
                            <span className="status-tag red">禁止</span>
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
                                return (
                                  <span className="status-tag green">
                                    南京云集
                                  </span>
                                );
                              case 2:
                                return (
                                  <span className="status-tag green">
                                    西安云集
                                  </span>
                                );
                              case 3:
                                return (
                                  <span className="status-tag green">
                                    镇江云集
                                  </span>
                                );
                              default:
                                return (
                                  <span className="status-tag orange">
                                    暂无
                                  </span>
                                );
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
                      <tr>
                        <td style={{ opacity: 0 }} />
                        <td colSpan={3}>
                          <Button
                            style={{ margin: 0 }}
                            icon="property-safety"
                            type="primary"
                            onClick={() => {
                              this.openAccount(get(lookData, 'buIdSecret', ''));
                            }}
                          >
                            开通资金账户
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ height: 65 }} />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section">
            <span>运营备注：</span>
          </div>
          {get(lookData, 'note', '') === null && (
            <p className={s.contentList}>暂无</p>
          )}
          {get(lookData, 'note', '') !== null && (
            <p className={s.contentList}>{get(lookData, 'note', '暂无')}</p>
          )}
        </div>
      </div>
    );
  }

  async openAccount(buIdSecret) {
    let result;
    try {
      result = await this.query.fetch({
        method: 'GET',
        data: {
          buidSecret: buIdSecret,
        },
      });
      if (result.code === 200) {
        const messageData = JSON.parse(result.message || '{}');
        if (messageData.status === '01') {
          message.error('企业开户失败:系统错误！');
        } else {
          message.success('企业开户成功！');
          const actionOpts = {
            type: `procurementAccount.lookDetailData.data.data`,
            isGlobal: true,
          };
          this.props.commonAction({ isOpenAccount: 1 }, actionOpts);
        }
      } else {
        message.error('企业开户失败:系统错误！');
      }
    } catch (ex) {
      message.error('提交失败，请重试。');
    }
  }
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, formStyle, buttonStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(LookPage);
