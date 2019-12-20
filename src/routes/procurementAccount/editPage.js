import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import { Button, Form, Input, message, Select } from 'antd';

import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './editPage.css';

import Query from '../../components/Query';
import memorize from 'memoize-one';

const StateName = 'EditPage';
const { Option } = Select;
const FormItem = Form.Item;

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
  cityCodeValue: '',
  cityCodeName: '',
};

// 操作栏
class EditPage extends React.Component {
  componentDidMount() {}
  // 触发标签事件的函数声明
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // ...(values.accountInfo ? { userId: values.accountInfo } : {}),
        const datamodificationQuery = {
          ...(values.organizationName
            ? { buName: values.organizationName }
            : {}),
          ...(values.socialCreditCode
            ? { buLicenseId: values.socialCreditCode }
            : {}),
          ...(values.linkman ? { contractName: values.linkman } : {}),
          ...(values.belongYun ? { guzhu: values.belongYun } : {}),
          city: values.city,
          county: values.county,
          buidSecret: this.props.editDetailData.data.data.buidSecret,
          contractPhone: values.linkmanPhone || '',
          contractEmail: values.contractEmail || '',
        };
        // 调用检测账号接口

        let resultEdit;
        try {
          resultEdit = await this.modificationDetailFun.fetch({
            data: datamodificationQuery,
          });
        } catch (e) {
          message.error('保存失败！', 1);
        }

        if (resultEdit) {
          if (get(resultEdit, 'data.resultcode', '') === '200') {
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
          }
        } else {
          message.error(get(resultEdit, 'data.msg', '保存失败!'), 1);
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

  initState = memorize((a, b) => {
    this.props.commonAction({
      cityCodeValue: a,
      cityCodeName: b,
    });
  });

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editDetailData, optionList, cityData } = this.props;
    const guzhu = get(editDetailData, 'data.data.guzhu', '');
    const city = get(cityData, 'data.data', []);
    let cityCode = '0';
    let cityName = '0';
    city.forEach(c => {
      if (c.locationId === guzhu * 1) {
        cityCode = c.locationCode;
        cityName = c.locationName;
      }
    });
    this.initState(
      get(editDetailData, 'data.data.cityCode', '') || cityCode,
      get(editDetailData, 'data.data.city', '') || cityName,
    );
    const { cityCodeValue, cityCodeName } = this.props;
    const countyDataTrue = get(this.props.countyData, 'data.data') || [];
    const editCountyCode =
      get(editDetailData, 'data.data.countyCode', '') || '';
    return (
      <Form onSubmit={this.handleSubmit} className={s.editContentL}>
        <Query
          method="post"
          url="{apiUrl}/op/v1/buyers/accountUpdate"
          statePath={`${StateName}.modificationDetailData`}
          onRef={query => {
            this.modificationDetailFun = query;
          }}
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
            code: get(editDetailData, 'data.data.cityCode', '') || cityCode,
          }}
          method="get"
          statePath={`${StateName}.countyData`}
          url="{apiUrl}/op/v1/buyers/selCountyByCode"
        />
        <div className="detail-container">
          <table className="edit-table" style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className="label" style={{ width: 82 }}>
                  单位账号：
                </td>
                <td colSpan={3} style={{ width: 400 }}>
                  {getFieldDecorator('organ')(
                    <span> {get(editDetailData, 'data.data.userId', '')}</span>,
                  )}
                </td>
              </tr>
              <tr>
                <td className="label" style={{ width: 82 }}>
                  单位名称：
                </td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('organizationName')(
                      <span> {get(editDetailData, 'data.data.buName', '')}</span>,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label" style={{ width: 109 }}>
                  社会信用代码：
                </td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('socialCreditCode', {
                      rules: [{ required: false }],
                      initialValue: get(
                        editDetailData,
                        'data.data.bulicenseId',
                        '',
                      ),
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
                <td className="required label">联系人：</td>
                <td style={{ width: 250 }}>
                  <FormItem>
                    {getFieldDecorator('linkman', {
                      rules: [{ required: true, message: '请填写联系人' }],
                      initialValue: get(
                        editDetailData,
                        'data.data.contractName',
                        '',
                      ),
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
                    {getFieldDecorator('linkmanPhone', {
                      rules: [
                        { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
                      ],
                      initialValue: get(
                        editDetailData,
                        'data.data.contractPhone',
                        '',
                      ),
                    })(
                      <Input
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
                      rules: [
                        {
                          pattern: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                          message: '邮箱格式不正确',
                        },
                      ],
                      initialValue: get(
                        editDetailData,
                        'data.data.contractEmail',
                        '',
                      ),
                    })(
                      <Input style={{ width: 180 }} placeholder="请输入邮箱" />,
                    )}
                  </FormItem>
                </td>
                <td className="required label">所属云集：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('belongYun', {
                      rules: [{ required: true, message: '请选择所属云集' }],
                      initialValue: get(editDetailData, 'data.data.guzhu', ''),
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
                      initialValue:
                        get(editDetailData, 'data.data.cityCode', '') ||
                        cityCode,
                    })(
                      <Select style={{ width: 180 }}>
                        <Option
                          value={cityCodeValue === '0' ? '' : cityCodeValue}
                        >
                          {cityCodeName === '0' ? '' : cityCodeName}
                        </Option>
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('county', {
                      initialValue:
                        editCountyCode === '' ? '0' : editCountyCode,
                    })(
                      <Select style={{ marginLeft: 25, width: 180 }}>
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
          <Button
            style={{ margin: '20px 0 0 30px' }}
            type="primary"
            htmlType="submit"
            size="large"
          >
            保存修改
          </Button>
        </div>
      </Form>
    );
  }
}
const WrappedRedactModifier = Form.create()(EditPage);

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle, formStyle, inputStyle),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
  Form.create(),
)(WrappedRedactModifier);
