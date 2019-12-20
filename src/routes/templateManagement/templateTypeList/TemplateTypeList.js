import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';

import { Button, Form, Col, Row, Input, Icon, Select, message } from 'antd';
import buttonStyle from '../../../antdTheme/button/style/index.less';
import formStyle from '../../../antdTheme/form/style/index.less';
import gridStyle from '../../../antdTheme/grid/style/index.less';
import inputStyle from '../../../antdTheme/input/style/index.less';
import iconStyle from '../../../antdTheme/icon/style/index.less';
import selectStyle from '../../../antdTheme/select/style/index.less';
import messageStyle from '../../../antdTheme/message/style/index.less';
import { connect } from '../../../store/redux';
import { commonReducer } from '../../../store/common.reducer';
import { commonAction } from '../../../store/common.action';
import s from './TemplateTypeList.css';
import Query from '../../../components/Query';
import Xtable from '../../../components/XTable';
import XDrawer from '../../../components/XDrawer';
import Link from '../../../components/Link';
import ScrollArea from '../../../components/ScrollBar/js/ScrollAreaWithCss';

const StateName = 'templateTypeList';
const defaultState = {
  table: {
    current: 1,
    pageSize: 10,
  },
  drawer: {
    visible: false,
  },
  enName: '',
  tag: '',
};

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  wrapperCol: {
    span: 10,
  },
  labelCol: {
    span: 3,
  },
};

// 修改变量
class TemplateForm extends React.Component {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    this.props.form.validateFields(err => {
      if (!err) {
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat({ myKey: Math.random() });
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
    });
  };

  savetemplate = () => {
    const { templateDetail } = this.props;
    const originalId = get(templateDetail, 'data.data.tplTypeId', '');
    this.props.handleSubmit(this.props.form.getFieldsValue(), originalId);
  };

  nameChange = e => {
    const name = e.currentTarget.value;
    const index = parseInt(e.currentTarget.dataset.index, 10);
    const tag = this.props.form.getFieldValue('tag');
    tag[index] = `<span class="${name}">`+'${'+name+'}</span>'; // eslint-disable-line
    this.props.form.setFieldsValue({ tag });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, templateDetail, templateType } = this.props;
    const type = get(templateType, 'data.data', []);
    const detail = get(templateDetail, 'data.data', '');

    const variable = get(detail, 'variableList', []);
    getFieldDecorator('keys', {
      initialValue: variable || [],
    });
    //    getFieldDecorator()
    const keys = getFieldValue('keys');
    const formItems = keys.map((item, index) => (
      <tr key={`row_${item.id || item.myKey}`}>
        <td>
          <FormItem>
            {getFieldDecorator(`names[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '变量名称不能为空！',
                },
              ],
              initialValue: (item && item.cnName) || '',
            })(<Input placeholder="请输入变量名称" style={{ width: '90%' }} />)}
          </FormItem>
        </td>
        <td>
          <FormItem>
            {getFieldDecorator(`enName[${index}]`, {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '变量标识不能为空！',
                },
              ],
              initialValue: (item && item.enName) || '',
            })(
              <Input
                placeholder="请输入变量标识"
                style={{ width: '90%' }}
                data-index={index}
                onChange={this.nameChange}
              />,
            )}
          </FormItem>
        </td>
        <td>
          <FormItem>
            {getFieldDecorator(`tag[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '替换标识不能为空！',
                },
              ],
              initialValue: (item && item.tag) || '',
            })(<Input placeholder="请输入替换标识" style={{ width: '90%' }} />)}
          </FormItem>
        </td>
        <td className={s.formDel}>
          <a
            onClick={this.remove.bind(this, item)}
          >
            删除
          </a>
        </td>
      </tr>
    ));

    return (
      <ScrollArea
        stopScrollPropagation
        smoothScrolling="true"
        speed={10}
        className="detail-container"
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Form>
          <table className="edit-table" style={{ width: '80%' }}>
            <tbody>
              <tr>
                <td className="required label" style={{ width: 110 }}>
                  模板分类名称：
                </td>
                <td>
                  <FormItem>
                    {getFieldDecorator('templateType', {
                      rules: [
                        { required: true, message: '请选择模板分类名称!' },
                      ],
                      initialValue: `${get(detail, 'tplTypeId')}` || '1',
                    })(
                      <Select style={{ width: 240 }}>
                        {type.map(b => (
                          <Option key={b.id} value={b.id}>
                            {b.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">可选变量：</td>
                <td style={{ textAlign: 'right' }}>
                  <Button onClick={this.add}>
                    <Icon type="plus" /> 新增
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table
                    className={s.editableTable}
                    style={{ width: '100%', borderCollapse: 'collapse' }}
                  >
                    <tbody>
                      <tr className={`${s.formTable} ${s.formTableHrader}`}>
                        <th>变量名称</th>
                        <th>变量标识</th>
                        <th>替换标识</th>
                        <th style={{ width: 120 }}>操作</th>
                      </tr>
                      {formItems}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <Button
            onClick={this.savetemplate}
            style={{ marginRight: 30, marginBottom: 40 }}
            type="primary"
            size="large"
          >
            保存
          </Button>
        </Form>
      </ScrollArea>
    );
  }
}

const AddTemplateForm = Form.create()(TemplateForm);

class TemplateTypeList extends React.Component {
  templateFormAct = (visible, value) => {
    const actionOpts = { type: `${StateName}.drawer`, isGlobal: true };
    this.props.commonAction({ visible: !visible }, actionOpts);
    // 清空树
    this.props.commonAction({
      drawer: {
        key: Math.random(),
      },
    });
    if (value) {
      try {
        this.getTemplateDetail.fetch({
          data: {
            templateTypeId: value && value.id,
          },
        });
      } catch (ex) {
        console.error(`failed:${ex}`);
      }
    }
  };

  handleSubmit = async (formData, originalId) => {
    console.log('formData:', formData);
    const data = {};
    const variableDTO = [];
    for (let i = 0; i < formData.keys.length; i++) {
      variableDTO.push({
        id: formData.keys[i].id || '',
        tplTypeId: formData.keys[i].tplTypeId || '',
        cnName: formData.names[i] || '',
        enName: formData.enName[i] || '',
        tag: formData.tag[i] || '',
        isDel: formData.keys[i].isDel || '',
        operator: formData.keys[i].operator || '',
      });
      data.variableDTO = JSON.stringify({ variableList: variableDTO });
      data.originalId = originalId;
      data.templateTypeId = formData.templateType || '';
      // data[`variableList[${i}].id`] = formData.keys[i].id || '';
      // data[`variableList[${i}].tplTypeId`] = formData.keys[i].tplTypeId || '';
      // data[`variableList[${i}].cnName`] = formData.names[i] || '';
      // data[`variableList[${i}].enName`] = formData.enName[i] || '';
      // data[`variableList[${i}].tag`] = formData.tag[i] || '';
      // data[`variableList[${i}].isDel`] = formData.keys[i].isDel || '';
      // data[`variableList[${i}].createTime`] = '';
      // data[`variableList[${i}].updateTime`] = '';
      // data[`variableList[${i}].operator`] = formData.keys[i].operator || '';

      /* variableList.push({
        id: formData.keys[i].id || '',
        tplTypeId: formData.keys[i].tplTypeId || '',
        cnName: formData.names[i] || '',
        enName: formData.enName[i] || '',
        tag: formData.tag[i] || '',
        isDel: formData.keys[i].isDel || '',
        createTime: '',
        updateTime: '',
        operator: formData.keys[i].operator || '',
      }); */
    }
    console.log('data:', data);
    try {
      const result = await this.editTemplate.fetch({
        data,
      });
      if (result && result.code === 200) {
        message.success(result.message);
        this.props.commonAction(
          { visible: false },
          { type: `${StateName}.drawer`, isGlobal: true },
        );
      } else {
        message.error(result.message);
      }
    } catch (ex) {
      console.error(`failed:${ex}`);
    }
  };

  render() {
    const {
      drawer = defaultState.drawer,
      templateDetail,
      templateType,
      enName,
      tag,
    } = this.props;
    const visible = get(drawer, 'visible', false);

    const tableColumns = [
      {
        title: '模板类型编号',
        dataIndex: 'id',
        key: 'id',
        width: 150,
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '模板类型名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '模板变量个数',
        dataIndex: 'size',
        key: 'size',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'type',
        key: 'buid',
        render: (type, record) => (
          <div>
            {type === '1' && (
              <Link onClick={this.templateFormAct.bind(this, false, record)}>
                编辑
              </Link>
            )}
          </div>
        ),
        width: 100,
        align: 'center',
        fixed: 'right',
      },
    ];

    return (
      <div className={s.container}>
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/type/templateTypeList"
          statePath={`${StateName}.table`}
          onRef={query => {
            this.tableQuery = query;
          }}
        />
        <Query
          method="get"
          auto={false}
          url="{apiUrl}/op/v1/template/type/getTemplateTypeDetails"
          statePath={`${StateName}.templateDetail`}
          onRef={query => {
            this.getTemplateDetail = query;
          }}
        />
        <Query
          method="post"
          auto={false}
          url="{apiUrl}/op/v1/template/type/editTemplateType"
          statePath={`${StateName}.editTemplateSatus`}
          onRef={query => {
            this.editTemplate = query;
          }}
        />
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getTemplates"
          statePath={`${StateName}.templateType`}
        />
        <Xtable
          statePath={`${StateName}.table`}
          columns={tableColumns}
          rowKey="id"
          className={s.full}
          needPagination={false}
          needRowSelection={false}
        />
        {/* 编辑模板分类 */}
        <XDrawer
          statePath={`${StateName}.drawer`}
          title="编辑模板分类"
          visible={visible || false}
        >
          <AddTemplateForm
            templateFormAct={this.templateFormAct}
            key={get(drawer, 'key', 'drawer')}
            visible={visible}
            enName={enName}
            tag={tag}
            templateDetail={templateDetail}
            templateType={templateType}
            handleSubmit={this.handleSubmit}
            commonAction={this.props.commonAction}
          />
        </XDrawer>
      </div>
    );
  }
}

const mapState = state => ({
  layout: state.layout,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(
    s,
    buttonStyle,
    formStyle,
    gridStyle,
    inputStyle,
    iconStyle,
    selectStyle,
    messageStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(TemplateTypeList);
