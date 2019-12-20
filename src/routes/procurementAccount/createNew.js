import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Form, Button, Input, Select, message } from 'antd';

import formStyle from '../../antdTheme/form/style/index.less';
import buttonStyle from '../../antdTheme/button/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import tableStyle from '../../antdTheme/table/style/index.less';
import paginationStyle from '../../antdTheme/pagination/style/index.less';
import uploadStyle from '../../antdTheme/upload/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less'; // eslint-disable-line

import Query from '../../components/Query';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './createNew.css';

const StateName = 'CreateNew';
const FormItem = Form.Item;
const { Option } = Select;
const defaultState = {
  importBulk: 0,
  table: {
    current: 1,
    pageSize: 10,
  },
  cityCodeValue: '320100',
  cityCodeName: '南京市',
};

// 操作栏
class CreateNew extends React.Component {
  // 触发标签事件的函数声明
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.commonAction({
          userData: values,
        });
        const dataQuery = values;
        let result;
        try {
          result = await this.saveQueryFun.fetch({
            data: dataQuery,
          });
        } catch (e) {
          message.error('保存失败！', 1);
        }
        // 新增单位
        if (result) {
          if (get(result, 'code', '') === 200) {
            if (get(result, 'data.resultcode', '') === '0') {
              message.success('保存成功', 1);
              const questData = {
                pageSize: this.props.table.pageSize || 10,
                pageNum: this.props.table.current || 1,
              };
              this.props.query.fetch({ data: questData });
              const actionOpts = {
                type: `procurementAccount.drawer`,
                isGlobal: true,
              };
              this.props.commonAction({ visible: false }, actionOpts);
            } else {
              message.error(get(result, 'data.msg', '保存失败！'));
            }
          } else {
            message.error('保存失败！', 1);
          }
        }
      }
    });
  };

  handleSelectChange = value => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };

  // 检测账号
  testAccount = () => {
    this.props.form.validateFields(['unitNo'], {}, (errors, values) => {
      if (!errors) {
        const dataQuery = values;

        this.props.commonAction({
          userData: dataQuery,
        });

        // 调用检测账号接口
        this.testAccountQuery
          .fetch({
            data: dataQuery,
          })
          .then(result => {
            if (result.code !== 200) {
              message.error(result.message, 1);
            }
          });
      }
    });
  };

  // 检测
  testFun = () => {
    this.props.form.validateFields(['buName'], {}, (errors, values) => {
      if (!errors) {
        const dataQuery = values;

        this.props.commonAction({
          userData: dataQuery,
        });

        this.testQuery
          .fetch({
            data: dataQuery,
          })
          .then(result => {
            if (result.code !== 200) {
              message.error(result.message, 1);
            }
          });
      }
    });
  };

  // 返回列表
  returnList = () => {
    const actionOpts = { type: `procurementAccount.drawer`, isGlobal: true };
    this.props.commonAction({ visible: false }, actionOpts);
  };

  selectChange = value => {
    const cityData = get(this.props.cityData, 'data.data') || [];
    if (value !== 4) {
      for (const item of cityData) {
        if (value === item.locationId) {
          this.props.commonAction({
            cityCodeValue: item.locationCode,
            cityCodeName: item.locationName,
          });
          this.props.form.setFieldsValue({
            city: item.locationCode,
            county: '0',
          });
          this.countySelect.fetch({
            data: {
              code: item.locationCode,
            },
          });
        }
      }
    } else if (value === 4) {
      this.props.commonAction({
        cityCodeValue: '',
        cityCodeName: '',
      });
      this.props.form.setFieldsValue({
        city: '',
        county: '0',
      });
      this.countySelect.fetch({
        data: {
          code: '4',
        },
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      testData,
      testNameData,
      optionList,
      cityCodeValue,
      cityCodeName,
    } = this.props;
    const countyDataTrue = get(this.props.countyData, 'data.data') || [];

    const testDataMsg = JSON.parse(get(testData, 'data.message', '{}') || '{}');
    const testNameDataMsg = JSON.parse(
      get(testNameData, 'data.message', '{}') || '{}',
    );

    return (
      <Form onSubmit={this.handleSubmit} className={s.createContentL}>
        <Query
          onRef={query => {
            this.testAccountQuery = query;
          }}
          auto={false}
          method="get"
          statePath={`${StateName}.testData`}
          url="{apiUrl}/op/v1/buyers/chkUnitNo"
        />
        {/* 检测单位名称 */}
        <Query
          onRef={query => {
            this.testQuery = query;
          }}
          auto={false}
          method="post"
          statePath={`${StateName}.testNameData`}
          url="{apiUrl}/op/v1/buyers/checkBuHasReg"
        />
        {/* 所属区域市级 */}
        <Query
          onRef={query => {
            this.citySelect = query;
          }}
          method="get"
          statePath={`${StateName}.cityData`}
          url="{apiUrl}/op/v1/buyers/selCityByCode"
        />
        {/* 所属区域区级 */}
        <Query
          onRef={query => {
            this.countySelect = query;
          }}
          data={{
            code: '320100',
          }}
          method="get"
          statePath={`${StateName}.countyData`}
          url="{apiUrl}/op/v1/buyers/selCountyByCode"
        />
        {/* 保存添加 */}
        <Query
          onRef={query => {
            this.saveQueryFun = query;
          }}
          auto={false}
          method="post"
          statePath={`${StateName}.saveQuery`}
          url="{apiUrl}/op/v1/buyers/accountSave"
        />
        <div className="detail-container">
          <table className="edit-table" style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className="required label" style={{ width: 109 }}>
                  登陆账号：
                </td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('unitNo', {
                      rules: [
                        { required: true, message: '请填写预算单位编码' },
                      ],
                    })(
                      <Input
                        style={{ width: 400 }}
                        placeholder="请输入登录账号"
                      />,
                    )}
                  </FormItem>
                  <Button type="primary" onClick={this.testAccount}>
                    检测账号
                  </Button>
                  {get(testData, 'data.code', '') === 200 && (
                    <p
                      className={`${s.redHint} ${
                        testDataMsg.resultcode !== '0' ? s.alert : ''
                      }`}
                    >
                      {testDataMsg.msg}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td />
                <td colSpan={3}>
                  <p className={s.extra}>
                    账号由省份简称（江苏-js）+ 行政区号（ 南京市-雨花区-320114
                    ）财政预算管理系统-预算单位编码 （998333024） 组成。
                  </p>
                </td>
              </tr>
              <tr>
                <td className="required label">单位名称：</td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('buName', {
                      rules: [{ required: true, message: '请填写单位名称' }],
                    })(
                      <Input
                        style={{ width: 400 }}
                        placeholder="请输入单位名称"
                      />,
                    )}
                  </FormItem>
                  <Button type="primary" onClick={this.testFun}>
                    检测
                  </Button>
                  {get(testNameData, 'data.code', '') === 200 && (
                    <p
                      className={`${s.redHint} ${
                        testNameDataMsg.resultcode !== '200' ? s.alert : ''
                      }`}
                    >
                      {testNameDataMsg.msg}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="label">社会信用代码：</td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('buLicenseId', {
                      rules: [{ required: false }],
                      initialValue: '',
                    })(
                      <Input
                        style={{ width: 400 }}
                        placeholder="请输入社会信用代码"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label" style={{ width: 70 }}>
                  联系人：
                </td>
                <td style={{ width: 250 }}>
                  <FormItem>
                    {getFieldDecorator('contractName', {
                      rules: [{ required: true, message: '请填写联系人' }],
                    })(
                      <Input
                        style={{ width: 180 }}
                        placeholder="请输入联系人"
                      />,
                    )}
                  </FormItem>
                </td>
                <td className="label" style={{ width: 109 }}>
                  联系人手机号：
                </td>
                <td>
                  <FormItem>
                    {getFieldDecorator('contractPhone', {
                      initialValue: '',
                      rules: [
                        { required: false },
                        { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
                      ],
                    })(
                      <Input
                        type="phone"
                        style={{ width: 180 }}
                        placeholder="请输入联系人手机号"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">邮箱：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('contractEmail', {
                      initialValue: '',
                      rules: [
                        { required: false },
                        {
                          pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                          message: '邮箱格式不正确',
                        },
                      ],
                    })(
                      <Input style={{ width: 180 }} placeholder="请输入邮箱" />,
                    )}
                  </FormItem>
                </td>
                <td className="required label">所属云集：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('guzhu', {
                      rules: [{ required: true, message: '请选择所属云集' }],
                      initialValue: 1,
                    })(
                      <Select
                        style={{ width: 180 }}
                        onChange={this.selectChange}
                      >
                        {optionList}
                      </Select>,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">所属地域：</td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('city', {
                      initialValue: '320100',
                    })(
                      <Select style={{ width: 180 }}>
                        <Option value={cityCodeValue}>{cityCodeName}</Option>
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('county', {
                      initialValue: '0',
                    })(
                      <Select style={{ width: 180, marginLeft: 25 }}>
                        <Option key="county_1" value="0">
                          --请选择--
                        </Option>
                        {countyDataTrue.length > 0 &&
                          countyDataTrue.map(item => (
                            <Option
                              key={`county_${item.locationCode}`}
                              value={item.locationCode}
                            >
                              {item.locationName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>

          <Button type="primary" htmlType="submit" size="large">
            保存
          </Button>

          <span className={s.returnListClass} onClick={this.returnList}>
            返回列表
          </span>
        </div>
      </Form>
    );
  }
}

const WrappedCreateNew = Form.create()(CreateNew);

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(
    s,
    formStyle,
    buttonStyle,
    inputStyle,
    selectStyle,
    paginationStyle,
    uploadStyle,
    tableStyle,
    messageStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(WrappedCreateNew);
