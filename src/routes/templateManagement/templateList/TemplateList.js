import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import get from 'lodash.get';

import {
  Button,
  Form,
  Input,
  Icon,
  Select,
  Upload,
  Collapse,
  Radio,
  Popconfirm,
  Row,
  Col,
  message,
} from 'antd';
import buttonStyle from '../../../antdTheme/button/style/index.less';
import formStyle from '../../../antdTheme/form/style/index.less';
import inputStyle from '../../../antdTheme/input/style/index.less';
import iconStyle from '../../../antdTheme/icon/style/index.less';
import selectStyle from '../../../antdTheme/select/style/index.less';
import uploadStyle from '../../../antdTheme/upload/style/index.less';
import collapseStyle from '../../../antdTheme/collapse/style/index.less';
import radioStyle from '../../../antdTheme/radio/style/index.less';
import gridStyle from '../../../antdTheme/grid/style/index.less';
import animateStyle from '../../../antdTheme/style/core/motion.less';
import messageStyle from '../../../antdTheme/message/style/index.less'; // eslint-disable-line
import popconfirmStyle from '../../../antdTheme/popover/style/index.less';
import { connect } from '../../../store/redux';
import { commonReducer } from '../../../store/common.reducer';
import { commonAction } from '../../../store/common.action';
import s from './TemplateList.css';
import Query from '../../../components/Query';
import Xtable from '../../../components/XTable';
import XDrawer from '../../../components/XDrawer';
import ScrollArea from '../../../components/ScrollBar/js/ScrollAreaWithCss';
import TextEditor from '../../../components/TextEditor';
import XQuery from '../../../components/XQuery';

const StateName = 'templateList';
const defaultState = {
  content: '',
  radioValue: '',
  selectValue: '',
  fileError: false,
  file: '',
  table: {
    current: 1,
    pageSize: 10,
    name: '',
    type: '',
    platform: '',
  },
  drawer: {
    visible: false,
  },
};

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;
const RadioGroup = Radio.Group;
const formCol = {
  wrapperCol: {
    span: 18,
  },
  labelCol: {
    span: 6,
  },
  style: {
    width: '100%',
  },
};

// 查询表单
class QueryForm extends React.Component {
  render() {
    const { templateType, yunjiList } = this.props;
    const type = get(templateType, 'data.data', []);
    const yunji = get(yunjiList, 'data.data', []);

    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" style={{ padding: '0 10px' }}>
        <XQuery>
          <FormItem label="模板名称" {...formCol}>
            {getFieldDecorator('templateName')(<Input autoFocus />)}
          </FormItem>
          <FormItem label="模板分类" {...formCol}>
            {getFieldDecorator('templateType', {
              initialValue: '1',
            })(
              <Select
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {type.map(b => (
                  <Option key={b.id} value={b.id}>
                    {b.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="所属云集" {...formCol}>
            {getFieldDecorator('opPlatform', {
              initialValue: yunji[0] ? yunji[0].code : '',
            })(
              <Select
                getPopupContainer={() => document.querySelector(`.root`)}
              >
                {yunji.map(b => (
                  <Option key={b.code} value={b.code}>
                    {b.cnname}
                  </Option>
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
      </Form>
    );
  }

  resetForm = () => {
    this.props.form.resetFields();
  };
  query = () => {
    this.props.query(this.props.form.getFieldsValue());
  };
}
const WrappedQueryForm = Form.create()(QueryForm);

// 新增模板
class TemplateForm extends React.Component {
  // 模板分类
  selectChange = e => {
    const typeList = get(this.props, 'templateType.data.data', []);
    for (let i = 0; i < typeList.length; i++) {
      if (e === typeList[i].id) {
        this.props.commonAction({
          radioValue: typeList[i].type,
          selectValue: e,
        });
        this.props.variableQuery.fetch({
          data: { tplTypeId: typeList[i].id },
        });
        break;
      }
    }
  };

  // 变量选择
  variableClick = tag => {
    this.editor.execCommand('inserthtml', tag);
    this.props.commonAction({
      content: this.editor.getContent(),
    });
  };

  // 上传附件
  uploadChange = info => {
    if (info.file.status === 'done') {
      const uploadSeverStatus = info.file.response;
      if (uploadSeverStatus !== '') {
        this.props.commonAction(
          {
            templateDetail: {
              data: { data: { templateFilePath: uploadSeverStatus.data.url } },
            },
          },
          { isGlobal: true, type: StateName },
        );
        this.props.commonAction({ file: uploadSeverStatus });
        message.success(`${info.file.name} 上传成功！`);
      } else {
        message.error(`${info.file.name} 上传失败！`);
        this.props.commonAction({ file: '' });
      }
    } else if (info.file.status === 'error') {
      this.props.commonAction({ file: '' });
      message.error(`${info.file.name} 上传失败！`);
    }
  };

  removeFile = () => {
    this.props.commonAction({ file: '' });
    this.deleteFile();
  };

  save = () => {
    let result;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /* 富文本数据的处理start */
        values.myEditorValue = this.props.content;
        /* 富文本数据的处理end */

        /* 附件地址start */
        const fileUrl = get(this.props, 'file.data.url', '');
        if (fileUrl) {
          values.tplFilePath = fileUrl;
          this.props.commonAction({ fileError: false });
        } else {
          this.props.commonAction({ fileError: true });
        }
        /* 附件地址end */

        if (values.myEditorValue || fileUrl) {
          result = values;
          this.props.saveTemplateFormAct(result);
        }
      }
    });
  };

  deleteFile = () => {
    this.props.commonAction({ file: {} });
    this.props.commonAction(
      {
        templateDetail: {
          data: { data: { templateFilePath: '' } },
        },
      },
      { isGlobal: true, type: StateName },
    );
    // this.props.form.validateFields((err, formData) => {
    //   if (!err) {
    //     formData.tplFilePath = '';
    //     this.props.deleteFileAct(formData);
    //   }
    // });
  };

  editorChange = content => {
    this.props.commonAction({ content });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      templateDetail,
      templateType,
      yunjiList,
      variableList,
      content,
      radioValue,
      selectValue,
      fileError,
      file,
    } = this.props;
    const detail = get(templateDetail, 'data', '');
    const type = get(templateType, 'data.data', []);
    const yunji = get(yunjiList, 'data.data', []);
    const variable = get(variableList, 'data.data', []);

    if (templateDetail && get(detail, 'code', '') !== 200) {
      return <div>loading......</div>;
    }

    const upload = {
      customRequest: ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        this.props
          .fetch('{apiUrl}/op/v1/template/upload', {
            method: 'POST',
            data: formData,
            headers: {
              'Content-Type': null,
            },
          })
          .then(res => res.json(), onError)
          .then(data => {
            if (data.code === 200) {
              onSuccess(data);
            } else {
              onError(new Error(data.message));
            }
          });
        return {
          abort() {
            message.error('文件上传中断');
          },
        };
      },
      beforeUpload: file => {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error('20M以内!');
        }
        return isLt2M;
      },
      onChange: this.uploadChange,
      onRemove: this.removeFile,
    };
    return (
      <Form style={{ overflow: 'hidden' }}>
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
          <table style={{ width: '100%' }} className="edit-table">
            <tbody>
              <tr>
                <td className="required label" style={{ width: 86 }}>
                  模板名称：
                </td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('templateName', {
                      rules: [
                        { required: true, message: '请输入采购单位名称!' },
                      ],
                      initialValue: get(detail, 'data.name', ''),
                    })(
                      <Input
                        style={{ width: 385 }}
                        placeholder="请输入采购单位名称"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">模板分类：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('templateTypeId', {
                      rules: [{ required: true, message: '请选择模板分类!' }],
                      initialValue: `${selectValue}`,
                    })(
                      <Select
                        style={{ width: 180 }}
                        onChange={this.selectChange}
                      >
                        {type.map(b => (
                          <Option key={b.id} value={b.id}>
                            {b.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
                <td className="required label" style={{ width: 86 }}>
                  所属云集：
                </td>
                <td>
                  <FormItem>
                    {getFieldDecorator('platform', {
                      rules: [{ required: true, message: '请选择所属云集!' }],
                      initialValue: get(detail, 'data.platform', 'NJ'),
                    })(
                      <Select style={{ width: 180 }}>
                        {yunji.map(b => (
                          <Option key={b.code} value={b.code}>
                            {b.cnname}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">模板类型：</td>
                <td colSpan={3}>
                  {getFieldDecorator('templateTypeRadio', {
                    initialValue: `${radioValue}`,
                  })(
                    <RadioGroup disabled>
                      <Radio value="1">可编辑</Radio>
                      <Radio value="2">模板</Radio>
                      <Radio value="3">多个模板</Radio>
                    </RadioGroup>,
                  )}
                </td>
              </tr>
              {(radioValue === null || radioValue === '1') && (
                <tr>
                  <td className="label">变量选择：</td>
                  <td colSpan={3}>
                    {getFieldDecorator('variableDiv', {
                      rules: [
                        { required: false, message: '请输入采购单位名称!' },
                      ],
                    })(
                      <div style={{ lineHeight: '40px' }}>
                        {variable && variable.length > 1
                          ? variable.map(item => (
                              <Button
                                onClick={this.variableClick.bind(
                                  this,
                                  item.tag,
                                )}
                              >
                                {item.cnName || '暂无数据'}
                              </Button>
                            ))
                          : '暂无变量'}
                      </div>,
                    )}
                  </td>
                </tr>
              )}
              {(radioValue === null || radioValue === '1') && (
                <tr>
                  <td className="label">模板内容：</td>
                  <td colSpan={3}>
                    <TextEditor
                      onRef={editor => {
                        this.editor = editor ? editor.ue : null;
                      }}
                      value={content}
                      onChange={this.editorChange}
                    />
                  </td>
                </tr>
              )}
              {(!radioValue || radioValue === '2' || radioValue === '3') && (
                <tr>
                  <td className="label">模板文件：</td>
                  <td>
                    {get(detail, 'data.templateFilePath') ? (
                      <div>
                        {global.App && (
                          <span>
                            <a
                              href={`${get(
                                global,
                                'App.apiUrl',
                              )}/op/v1/template/downloadFile?fileName=${get(
                                detail,
                                'data.name',
                                '模板文件',
                              )}&key=${get(
                                detail,
                                'data.templateFilePath',
                                '',
                              )}`}
                              className={s.file}
                              target="_blank"
                            >
                              模板文件
                            </a>
                            <Icon
                              style={{ cursor: 'pointer' }}
                              type="close"
                              onClick={this.deleteFile}
                            />
                          </span>
                        )}
                        {/* <span style={{ cursor: 'pointer' }}>下载查看</span> */}
                      </div>
                    ) : (
                      <div>
                        <Upload {...upload}>
                          <Button icon="upload">添加附件</Button>
                        </Upload>
                        <small>（请上传DOC，DOCX，PDF，HTML格式的文件）</small>
                        {fileError && (
                          <div className="form-tip">请上传模板文件！</div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Button
            size="large"
            onClick={this.save}
            style={{ margin: '20px 0' }}
            type="primary"
          >
            {get(detail, 'data.id', '') ? '保存' : '新增'}
          </Button>
        </ScrollArea>
      </Form>
    );
  }
}
const AddTemplateForm = Form.create()(TemplateForm);

// 页面类
class TemplateList extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
    scrollArea: PropTypes.object,
  };
  // 点击新增&修改
  templateFormAct = async value => {
    this.props.commonAction(
      { drawer: { visible: !this.props.drawer.visible } },
      'show',
    );
    // 清空树
    this.props.commonAction({
      drawer: {
        key: Math.random(),
      },
    });

    // 编辑
    if (value) {
      let result;
      try {
        result = await this.editTemplate.fetch({
          data: {
            id: value.id,
          },
        });
      } catch (ex) {
        console.error(`failed:${ex}`);
      }
      if (result && result.code === 200) {
        const data = get(result, 'data', '');
        this.props.commonAction({
          selectValue: `${get(data, 'templateTypeId', '')}`,
          radioValue: `${get(data, 'allowEdit', '')}`,
          content: get(data, 'templateContent', ''),
        });
      }
    }
  };

  // 启用&废弃
  openOrCloseTemplateAct = async value => {
    let result;
    try {
      result = await this.enableQuery.fetch({
        data: {
          id: value.id,
          typeId: value.templateTypeId,
          status: value.status === 1 ? 0 : 1,
          platform: value.platform,
        },
      });
    } catch (ex) {
      console.error(`failed:${ex}`);
    }

    if (result.code === 200) {
      message.success('操作成功！');
      this.tableQuery.fetch();
    }
  };

  // 条件查询
  query = formData => {
    this.props.commonAction({
      table: {
        name: (formData && formData.templateName) || '',
        type: (formData && formData.templateType) || '',
        platform: (formData && formData.opPlatform) || '',
      },
    });
  };

  // 删除
  deltemplateAct = async value => {
    const ids = get(this.props, 'table.selectedRowKeys', false);
    if (!value && !ids) {
      message.error('请至少选择一行数据！');
    } else {
      let result;
      try {
        result = await this.delateTemplate.fetch({
          data: {
            ids: value ? value.id : ids,
          },
        });
      } catch (ex) {
        console.error(`failed:${ex}`);
      }

      if (result.code === 200) {
        message.success('删除成功！');
        this.tableQuery.fetch();
      }
    }
  };

  // 保存
  saveTemplateFormAct = async formData => {
    let result;
    try {
      console.log('save: ', formData);
      const id = get(this.props, 'templateDetail.data.data.id', '');
      result = await this.saveTemplate.fetch({
        data: {
          id: id || '',
          name: formData.templateName || '',
          platformFrom: formData.platform || '',
          tplTypeId: formData.templateTypeId || '',
          templateContent: formData.myEditorValue || '',
          tplFilePath: formData.tplFilePath || '',
          createTime: ' ',
          updateTime: ' ',
          operator: ' ',
          status: ' ',
          isDel: ' ',
          allowEdit: formData.templateTypeRadio || '',
          remark: '',
        },
      });
    } catch (ex) {
      console.error(`failed:${ex}`);
    }

    if (result && result.code === 200) {
      message.success('保存成功！');
      this.tableQuery.fetch();
      this.templateFormAct(true, '');
    }
  };

  // 删除附件
  deleteFileAct = formData => {
    let result;
    let val;
    try {
      const id = get(this.props, 'templateDetail.data.data.id', '');
      val = { id };
      result = this.saveTemplate.fetch({
        data: {
          id: val.id || '',
          name: formData.templateName || '',
          platformFrom: formData.platform || '',
          tplTypeId: formData.templateTypeId || '',
          templateContent: formData.myEditorValue || '',
          tplFilePath: formData.tplFilePath || '',
          createTime: ' ',
          updateTime: ' ',
          operator: ' ',
          status: ' ',
          isDel: ' ',
          allowEdit: formData.templateTypeRadio || '',
          remark: '',
        },
      });
    } catch (ex) {
      console.error(`failed:${ex}`);
    }

    if (result && result.code === 200) {
      message.success('删除附件成功！');
      this.tableQuery.fetch();
      this.templateFormAct(val);
    }
  };

  render() {
    const {
      table = {},
      drawer = defaultState.drawer,
      templateType,
      yunjiList,
      variableList,
      templateDetail,
      content,
      radioValue,
      selectValue,
      file,
      fileError,
    } = this.props;
    const visible = get(drawer, 'visible', false);
    const _yunjiList = get(yunjiList, 'data.data', []);
    const yunjiCode = get(yunjiList, 'data.code', 0);
    if (_yunjiList.length > 0 && get(table, 'platform') === undefined) {
      this.props.commonAction({
        table: {
          platform: _yunjiList[0].code,
        },
      });
    }

    const tableColumns = [
      {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        sorter: (a, b) => a > b,
      },
      {
        title: '模板分类',
        dataIndex: 'templateTypeIdStr',
        key: 'templateTypeIdStr',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: value => (
          <div>
            {value === 1 && <span>可用</span>}
            {value === 0 && <span>不可用</span>}
          </div>
        ),
      },
      {
        title: '所属云集',
        dataIndex: 'platformStr',
        key: 'platformStr',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'bar',
        fixed: 'right',
        align: 'center',
        width: 140,
        render: (value, record) => (
          <div>
            {value === 0 && (
              <a
                style={{ marginRight: 10 }}
                onClick={this.openOrCloseTemplateAct.bind(this, record)}
              >
                启动
              </a>
            )}
            {value === 1 && (
              <a
                style={{ marginRight: 10 }}
                onClick={this.openOrCloseTemplateAct.bind(this, record)}
              >
                废弃
              </a>
            )}
            <a
              style={{ marginRight: 10 }}
              onClick={this.templateFormAct.bind(this, record)}
            >
              修改
            </a>
            <Popconfirm
              title="你确定要批量删除吗?"
              onConfirm={this.deltemplateAct.bind(this, record)}
              okText="确定"
              cancelText="取消"
            >
              <a style={{ marginRight: 10 }}>删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div className="root">
        <Query
          method="get"
          auto={false}
          url="{apiUrl}/op/v1/template/batch/delete"
          statePath={`${StateName}.table`}
          onRef={query => {
            this.delateTemplate = query;
          }}
        />
        <Query
          method="get"
          auto={false}
          url="{apiUrl}/op/v1/template/openOrCloseTemplate"
          statePath={`${StateName}.table`}
          onRef={query => {
            this.enableQuery = query;
          }}
        />
        <Query
          method="get"
          auto={false}
          url="{apiUrl}/op/v1/template/templateDetail"
          statePath={`${StateName}.templateDetail`}
          onRef={query => {
            this.editTemplate = query;
          }}
        />
        <Query
          method="post"
          auto={false}
          url="{apiUrl}/op/v1/template/saveOrUpdateTemplate"
          statePath={`${StateName}.saveTemplate`}
          onRef={query => {
            this.saveTemplate = query;
          }}
        />
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getTemplates"
          statePath={`${StateName}.templateType`}
        />
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getYunjisites"
          statePath={`${StateName}.yunjiList`}
        />
        <Query
          method="get"
          url="{apiUrl}/op/v1/template/getVariableList"
          statePath={`${StateName}.variableList`}
          auto={false}
          onRef={query => {
            this.variableQuery = query;
          }}
        />
        {yunjiCode === 200 && (
          <Query
            method="get"
            url="{apiUrl}/op/v1/template/getTemplateList"
            statePath={`${StateName}.table`}
            data={{
              pageSize: table.pageSize || 10,
              pageNum: table.current || 1,
              name: table.name || '',
              type: table.type || '',
              platform: get(table, 'platform', '')
                ? table.platform
                : _yunjiList[0] ? _yunjiList[0].code : 'XXX',
            }}
            onRef={query => {
              this.tableQuery = query;
            }}
          />
        )}
        <Collapse defaultActiveKey="1" accordion>
          <Panel header="筛选条件" key="1">
            <WrappedQueryForm
              style={{ margin: '20px 0' }}
              query={this.query}
              templateType={templateType}
              yunjiList={yunjiList}
            />
          </Panel>
        </Collapse>
        <div className="toolBar">
          <Button onClick={this.templateFormAct} type="primary">
            <Icon type="plus" /> 新增需求模板
          </Button>
          <Popconfirm
            title="你确定要批量删除吗?"
            onConfirm={this.deltemplateAct.bind(this, '')}
            okText="确定"
            cancelText="取消"
          >
            <Button>
              <Icon type="delete" /> 批量删除
            </Button>
          </Popconfirm>,
        </div>
        <Xtable
          style={{ height: '100%' }}
          statePath={`${StateName}.table`}
          columns={tableColumns}
          rowKey="id"
          className={s.full}
        />
        {/* 新增&编辑 */}
        <XDrawer
          statePath={`${StateName}.drawer`}
          title="填写模板信息"
          visible={visible || false}
          closeHook={() => {
            this.props.commonAction({
              selectValue: '',
              radioValue: '',
              content: '',
            });
          }}
        >
          <AddTemplateForm
            templateFormAct={this.templateFormAct}
            key={get(drawer, 'key', 'drawer')}
            templateDetail={templateDetail}
            yunjiList={yunjiList}
            templateType={templateType}
            variableList={variableList}
            content={content}
            radioValue={radioValue}
            selectValue={selectValue}
            file={file}
            fileError={fileError}
            variableQuery={this.variableQuery}
            commonAction={this.props.commonAction}
            saveTemplateFormAct={this.saveTemplateFormAct}
            deleteFileAct={this.deleteFileAct}
            fetch={this.context.fetch}
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
    inputStyle,
    iconStyle,
    selectStyle,
    uploadStyle,
    collapseStyle,
    radioStyle,
    messageStyle,
    popconfirmStyle,
    animateStyle,
    gridStyle,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(TemplateList);
