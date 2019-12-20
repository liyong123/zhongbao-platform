import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Button, Collapse, Select, Modal, message } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import collapseStyle from '../../antdTheme/collapse/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import tableStyle from '../../antdTheme/table/style/index.less';
import paginationStyle from '../../antdTheme/pagination/style/index.less';
import modalStyle from '../../antdTheme/modal/style/index.less';
import uploadStyle from '../../antdTheme/upload/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less'; // eslint-disable-line
import animateStyle from '../../antdTheme/style/core/motion.less';

import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './ProcurementAccount.css';
import Xtable from '../../components/XTable';
import XDrawer from '../../components/XDrawer';
import QueryForm from './ProcurementAccountQueryForm';
import ToolBar from './toolBar';
import WrappedCreateNew from './createNew';
import WrappedRedactModifier from './editPage';
import LookPage from './lookPage';
import AuditPage from './auditPage';

// 状态名
const StateName = 'procurementAccount';
const { Panel } = Collapse;
const { Option } = Select;

// 默认状态
const defaultState = {
  test: 'default',
  addNewUnit: false,
  importBulk: 0,
  someProp: ['qq'],
  table: {
    current: 1,
    pageSize: 10,
  },
  userData: {},
  showLookEdit: {
    value: 0,
    content: '采购单位管理',
  },
  buidID: '',
};

// 页面类
class ProcurementAccount extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    history: PropTypes.any,
    scrollArea: PropTypes.object,
  };

  state = {
    reastModal: false,
  };

  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  onChangeCollapse = () => {
    if (this.tableInst) {
      this.tableInst.resize();
    }
    setTimeout(() => {
      this.context.scrollArea.refresh();
    }, 200);
  };

  // 创建新单位
  handleVisible = (string, buidID) => {
    const { visible } = this.props.drawer;
    const actionOpts = { type: `procurementAccount.drawer`, isGlobal: true };
    this.props.commonAction({ visible: !visible }, actionOpts);
    this.props.commonAction({
      testData: null,
      testNameData: null,
      saveQuery: null,
    });

    if (string === '1') {
      this.props.commonAction({
        showLookEdit: {
          value: 1,
          content: '采购单位管理',
        },
      });

      const dataLookQuery = {
        buidSecret: buidID,
      };

      // 调用检测账号接口
      this.lookDetail.fetch({
        data: dataLookQuery,
      });
    } else if (string === '3') {
      this.props.commonAction({
        showLookEdit: {
          value: 3,
          content: '采购单位管理',
        },
      });

      const dataLookQuery = {
        buidSecret: buidID,
      };

      // 调用检测账号接口
      this.lookDetail.fetch({
        data: dataLookQuery,
      });
    } else if (string === '2') {
      this.props.commonAction({
        editFormKey: Math.random(),
        showLookEdit: {
          value: 2,
          content: '采购单位管理',
        },
      });

      const dataEditQuery = {
        buidSecret: buidID,
      };

      // 修改用户信息接口
      this.editDetailFun.fetch({
        data: dataEditQuery,
      });
    } else {
      this.props.commonAction({
        newFormKey: Math.random(),
        showLookEdit: {
          value: 0,
          content: '采购单位管理',
        },
      });
    }
  };

  // 重置密码
  resetPasswords = buidID => {
    console.log(buidID);
    // this.setState({
    //   reastModal: true,
    // });
    this.props.commonAction({
      buidID,
    });
    Modal.confirm({
      title: '重置密码',
      content: '是否要重置密码？',
      onOk: this.reastPass,
      okText: '是',
      cancelText: '否',
    });
  };

  // handleCancel = e => {
  //   console.log(e);
  //   this.setState({
  //     reastModal: false,
  //   });
  // };

  reastPass = () => {
    this.props.commonAction({
      resetPasswordsData: null,
    });
    if (this.props.buidID !== '') {
      const resetQuery = {
        buidSecret: this.props.buidID,
      };

      // 重置密码 async
      setTimeout(async () => {
        let resultPassword;
        try {
          resultPassword = await this.resetPasswordsQuery.fetch({
            data: resetQuery,
          });
        } catch (e) {
          message.error('保存失败！', 1);
        }

        // 重置密码成功{"resultcode":"0","msg":"重置成功"}
        if (resultPassword) {
          const msg = get(resultPassword, 'data')
            .split(',"msg":"')[1]
            .split('"')[0];
          const code = get(resultPassword, 'data')
            .split('"resultcode":"')[0]
            .split('"')[0];
          if (code === '0') {
            message.success(msg, 1);
          } else {
            message.success(msg, 1);
          }
        }
      }, 0);
    }
  };

  render() {
    const {
      importBulk,
      table = {},
      drawer,
      userData,
      showLookEdit = defaultState.showLookEdit,
      lookDetailData,
      editDetailData,
      modificationDetailData,
      yunjiList,
    } = this.props;

    const yunJiListObj = get(yunjiList, 'data.data', {});
    const yunjiCode = get(yunjiList, 'data.code', 0);
    const yunJiList = [];
    if (yunJiListObj !== {}) {
      for (const i in yunJiListObj) { // eslint-disable-line
        yunJiList.push({yunjitext: yunJiListObj[i], count: parseInt(i)}); // eslint-disable-line
      }
    }

    let optionList;
    if (yunJiList.length > 0) {
      optionList = yunJiList.map(item => (
        <Option key={item.count} value={item.count}>
          {item.yunjitext}
        </Option>
      ));
    }

    const visible = get(drawer, 'visible', false);
    const APIURL = `${get(global, 'App.apiUrl')}`.split('jfyjop')[0];

    const tableColumns = [
      {
        title: '单位名称',
        dataIndex: 'buName',
        key: 'buName',
        fixed: 'left',
        width: 230,
        render: (text, record) => (
          <div>
            <a
              title={text}
              target="_blank"
              href={`${APIURL}${get(record, 'buNameUrl')}`}
            >
              {text}
            </a>
          </div>
        ),
      },
      {
        title: '账号信息',
        dataIndex: 'userId',
        key: 'userId',
        width: 180,
      },
      {
        title: '联系人',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 130,
        render: (text, record) => (
          <div>
            <a
              title={text}
              target="_blank"
              href={`${APIURL}${get(record, 'fullNameUrl')}`}
            >
              {text}
            </a>
          </div>
        ),
      },
      {
        title: '联系人手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 120,
      },
      {
        title: '注册来源',
        dataIndex: 'codeType',
        key: 'codeType',
        width: 100,
        render: text => {
          switch (text) {
            case '':
              return '';
            case -1:
              return '自助注册';
            case 0:
              return '短信邀请码';
            case 1:
              return '团队邀请';
            case 2:
              return '运营注册';
            default:
              return '运营注册';
          }
        },
        // (
        //   <div>
        //     {text === '' && <span />}
        //     {text === -1 && <span>自助注册</span>}
        //     {text === 0 && <span>短信邀请码</span>}
        //     {text === 1 && <span>团队邀请</span>}
        //     {text === 2 && <span>运营注册</span>}
        //   </div>
        // ),
      },
      {
        title: '所属云集',
        dataIndex: 'guzhuname',
        key: 'guzhuname',
        width: 100,
      },
      {
        title: '所属地域',
        dataIndex: 'city',
        key: 'city',
        render: (text, record) => {
          if (record.city !== '0' && record.county !== '0') {
            if (record.city && record.county) {
              return `${record.city}-${record.county}`;
            } else if (record.city && !record.county) {
              return record.city;
            } else if (!record.city && record.county) {
              return record.county;
            }
          } else if (record.city === '0' && record.county === '0') {
            return '--';
          }
          return '--';
        },
        width: 130,
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        width: 100,
        key: 'auditStatus',
        render: text => {
          switch (text) {
            case '1':
              return '通过';
            case '0':
              return '未通过';
            default:
              return '待审核';
          }
        },
        // (
        //   <div>
        //     {text === '-1' && <span>全部</span>}
        //     {text === '0' && <span>待审核</span>}
        //     {text === '1' && <span>通过</span>}
        //     {text === '2' && <span>未通过</span>}
        //     {!text && <span>待审核</span>}
        //   </div>
        // ),
      },
      {
        title: '社会信用代码',
        dataIndex: 'bulicenseId',
        key: 'bulicenseId',
        render: (text, record) => (
          <div>
            <a
              title={text}
              target="_blank"
              href={`${APIURL}${get(record, 'bulicenseIdUrl')}`}
            >
              {text}
            </a>
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'actionBar',
        key: 'actionBar',
        render: (text, record) => (
          <span>
            {visible !== undefined &&
              !record.auditStatus && (
                <span
                  className={s.lookSpan}
                  onClick={this.handleVisible.bind(
                    this,
                    '3',
                    record.buidSecret,
                  )}
                >
                  审核
                </span>
              )}

            {visible !== undefined &&
              record.auditStatus && (
                <span
                  className={s.lookSpan}
                  onClick={this.handleVisible.bind(
                    this,
                    '1',
                    record.buidSecret,
                  )}
                >
                  查看
                </span>
              )}

            {visible !== undefined && (
              <span
                className={s.lookSpan}
                onClick={this.handleVisible.bind(this, '2', record.buidSecret)}
              >
                编辑
              </span>
            )}

            {visible !== undefined && (
              <span
                className={s.buttonSpan}
                onClick={this.resetPasswords.bind(this, record.buidSecret)}
              >
                重置密码
              </span>
            )}
          </span>
        ),
        width: 170,
        align: 'center',
        fixed: 'right',
      },
    ];

    const drawerTitles = [
      '创建采购单位',
      '查看采购单位',
      '编辑采购单位',
      '审核采购单位',
    ];

    return (
      <div className="root">
        {/* getYunjiList */}
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/getYunjiList"
          statePath={`${StateName}.yunjiList`}
        />

        {yunjiCode === 200 && (
          <Query
            method="get"
            url="{apiUrl}/op/v1/buyers/queryBuyersList"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              guzhu: yunJiList[0] ? yunJiList[0].count : 'XXX',
              ...(table.status !== -1 && table.status !== undefined
                ? { status: table.status }
                : {}),
              userId: table.userId || '',
              buName: table.buName || '',
              socialCreditCode: table.socialCreditCode || '',
              contractName: table.contractName || '',
              contractPhone: table.contractPhone || '',
            }}
            onRef={query => {
              this.query = query;
            }}
          />
        )}

        <Collapse
          defaultActiveKey="1"
          accordion
          onChange={this.onChangeCollapse}
        >
          <Panel header="筛选条件" key="1">
            <QueryForm query={this.query} yunJiList={yunJiList} />
          </Panel>
        </Collapse>

        <ToolBar
          statePath={`${StateName}`}
          importBulk={importBulk}
          table={table}
          query={this.query}
          drawer={`${StateName}.drawer`}
          yunJiList={yunJiList}
          showLookEdit={showLookEdit}
          handleVisible={this.handleVisible}
        />

        <Xtable
          className="full"
          resizeKey={table.resizeKey}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          needRowSelection={false}
          rowKey="actionBar"
          data={this.props.table}
          onRef={inst => {
            this.tableInst = inst;
          }}
        />

        {/* 重置密码 */}
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/updatePassword"
          statePath={`${StateName}.resetPasswordsData`}
          onRef={query => {
            this.resetPasswordsQuery = query;
          }}
        />

        {/* 查看详情接口 */}
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/showBuyAccountDetail"
          statePath={`${StateName}.lookDetailData`}
          onRef={query => {
            this.lookDetail = query;
          }}
        />

        {/* 修改用户信息接口 */}
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/showBuyerUpd"
          statePath={`${StateName}.editDetailData`}
          onRef={query => {
            this.editDetailFun = query;
          }}
        />

        {/* 查看详情 */}
        <XDrawer
          statePath={`${StateName}.drawer`}
          title={drawerTitles[showLookEdit.value]}
          closable
          visible={visible || false}
          closeHook={() => {
            this.props.commonAction(
              {
                testData: null,
                testNameData: null,
              },
              {
                type: 'CreateNew',
                isGlobal: true,
              },
            );
          }}
        >
          {showLookEdit.value === 0 && (
            <WrappedCreateNew
              statePath={`${StateName}.drawer`}
              commonAction={this.props.commonAction}
              table={table}
              userData={userData}
              testData={this.props.testData}
              testNameData={this.props.testNameData}
              saveQuery={this.props.saveQuery}
              key={this.props.newFormKey}
              query={this.query}
              optionList={optionList}
              visible={visible || false}
              drawer={`${StateName}.drawer`}
            />
          )}
          {showLookEdit.value === 1 && (
            <LookPage lookDetailData={lookDetailData} />
          )}
          {showLookEdit.value === 2 && (
            <WrappedRedactModifier
              editDetailData={editDetailData}
              modificationDetailData={modificationDetailData}
              key={this.props.editFormKey}
              table={table}
              query={this.query}
              drawer={`${StateName}.drawer`}
              optionList={optionList}
            />
          )}
          {showLookEdit.value === 3 && (
            <AuditPage
              lookDetailData={lookDetailData}
              query={this.query}
              table={table}
            />
          )}
        </XDrawer>

        {/* 重置密码 弹框 */}
        {/* <Modal */}
        {/* title="密码重置" */}
        {/* visible={this.state.reastModal} */}
        {/* onCancel={this.handleCancel} */}
        {/* footer={null} */}
        {/* > */}
        {/* <p className={s.modalReast}>密码重置</p> */}
        {/* <Button */}
        {/* type="primary" */}
        {/* onClick={this.reastPass} */}
        {/* className={s.modalButton} */}
        {/* > */}
        {/* 确定 */}
        {/* </Button> */}
        {/* </Modal> */}
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
    buttonStyle,
    collapseStyle,
    selectStyle,
    paginationStyle,
    modalStyle,
    uploadStyle,
    tableStyle,
    messageStyle,
    animateStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(ProcurementAccount);
