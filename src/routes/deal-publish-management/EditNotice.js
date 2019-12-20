import React from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import get from 'lodash.get';
import TextEditor from '../../components/TextEditor';

import {
  Button,
  Form,
  Input,
  Icon,
  DatePicker,
  Upload,
  InputNumber,
  Select,
  message,
  Collapse,
} from 'antd';
import buttonStyle from '../../antdTheme/button/style/index.less';
import formStyle from '../../antdTheme/form/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';
import inputStyle from '../../antdTheme/input/style/index.less';
import inputNumStyle from '../../antdTheme/input-number/style/index.less';
import iconStyle from '../../antdTheme/icon/style/index.less';
import dateStyle from '../../antdTheme/date-picker/style/index.less';
import uploadStyle from '../../antdTheme/upload/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less';
import collapseStyle from '../../antdTheme/collapse/style/index.less';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './EditNotice.css';
import ScrollArea from '../../components/ScrollBar/js/ScrollAreaWithCss';
import Drawer from '../../components/XDrawer';

// import Query from '../../../components/Query';

const StateName = 'DealPublishManagement';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

class EditNotice extends React.Component {
  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  handleSubmit = async status => {
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      const formData = new FormData();
      formData.append('buName', values.buName);
      formData.append('itemsName', values.itemsName);
      formData.append('noticeName', values.noticeName);
      formData.append('orderNo', values.orderNo);
      formData.append('bidBuName', values.bidBuName);
      formData.append('planPrice', values.planPrice);
      formData.append('bidPrice', values.bidPrice);
      formData.append('purchaseWay', values.purchaseWay);
      formData.append('putTime', values.putTime.format('YYYY-MM-DD'));
      formData.append('dataSource', values.dataSource);
      formData.append('resultType', values.resultType);
      formData.append('isUpdateNotices', values.isUpdateNotices);
      formData.append('createTime', values.createTime.format('YYYY-MM-DD'));
      formData.append('noticeStatus', status);
      formData.append('jbonId', values.jbonId);
      formData.append(
        'noticeContent',
        this.props.content === null || this.props.content === undefined
          ? ''
          : this.props.content,
      );
      formData.append(
        'files',
        JSON.stringify(
          this.props.attachs.map(a => ({ fileName: a.fileName, key: a.uid })),
        ),
      );
      const result = await this.props.fetch(
        '{apiUrl}/op/v1/publish/notice/saveNoticeData',
        {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': null,
          },
        },
      );
      const json = await result.json();
      if (json.code === 200) {
        message.success(!status ? '发布成功' : '暂存成功');
        this.props.commonAction({ drawer: { visible: false } });
      } else {
        message.error(json.message);
      }
    });
  };

  editorChange = content => {
    this.props.commonAction({ content });
  };

  render() {
    const {
      initData,
      attachs = [],
      content = null,
      fetch,
      drawer2,
    } = this.props;
    const notice = get(initData, 'notice', {});
    const dataSourceEnums = get(initData, 'noticesDataSourceEnums', []);
    const resultEnums = get(initData, 'noticesResultEnums', []);
    const { getFieldDecorator } = this.props.form;
    const upload = {
      onChange: this.handleUpFileChange,
      customRequest: ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('noticeId', notice.jbonId);
        fetch('{apiUrl}/op/v1/publish/notice/uploadAttach', {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': null,
          },
        })
          .then(res => res.json(), onError)
          .then(data => {
            if (data.code === 200) {
              console.log(file);

              this.props.commonAction({
                attachs: attachs.concat({
                  fileName: data.data.fileName,
                  key: data.data.key,
                  uid: data.data.key,
                  flag: data.data.flag,
                }),
              });
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
      onRemove: file => {
        const formData = new FormData();
        formData.append('noticeId', notice.jbonId);
        formData.append('url', file.uid);
        return fetch('{apiUrl}/op/v1/publish/notice/deleteAttach', {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': null,
          },
        }).then(
          () => {
            this.props.commonAction({
              attachs: attachs.filter(a => a.uid != file.uid),
            });
            return true;
          },
          () => {
            message.error('文件删除失败');
            return false;
          },
        );
      },
    };

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
          <table style={{ width: '80%' }} className="edit-table">
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className={s.tipText}>
                    温馨提示：此页面功能只做为信息公告发布，不具备提供线上投标功能
                  </div>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('jbonId', {
                      initialValue: notice.jbonId,
                    })(<Input />)}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td style={{ width: 137 }} className="required label">
                  采购单位名称：
                </td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('buName', {
                      initialValue: notice.buName,
                      rules: [
                        { required: true, message: '请输入采购单位名称!' },
                      ],
                    })(
                      <Input
                        style={{ width: 515 }}
                        placeholder="请输入采购单位名称"
                        disabled
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">公告标题名称：</td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('noticeName', {
                      initialValue: notice.noticeName,
                      validateTrigger: 'onBlur',
                      rules: [
                        { required: true, message: '请输入公告标题名称!' },
                        {
                          validator: (rule, value, callback) =>
                            this.props
                              .fetch(
                                '{apiUrl}/op/v1/publish/notice/getNoticeNoBlur',
                                {
                                  method: 'GET',
                                  headers: {
                                    'Content-Type': null,
                                  },
                                  data: {
                                    noticeType: notice.noticeType,
                                    id: notice.jbonId,
                                    noticeName: value,
                                  },
                                },
                              )
                              .then(
                                res => res.json(),
                                () => callback('校验失败，刷新试试'),
                              )
                              .then(
                                json => {
                                  if (json.data.resultcode === '201') {
                                    return callback();
                                  }
                                  return callback('项目名称已存在');
                                },
                                () => callback('校验失败，刷新试试'),
                              ),
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 515 }}
                        placeholder="请输入公告标题名称"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">项目编号：</td>
                <td style={{ width: 240 }}>
                  <FormItem>
                    {getFieldDecorator('orderNo', {
                      initialValue: notice.orderNo,
                      validateTrigger: 'onBlur',
                      rules: [
                        { required: true, message: '请输入项目编号!' },
                        {
                          validator: (rule, value, callback) =>
                            this.props
                              .fetch(
                                '{apiUrl}/op/v1/publish/notice/getNoticeNoBlur',
                                {
                                  method: 'GET',
                                  headers: {
                                    'Content-Type': null,
                                  },
                                  data: {
                                    noticeType: notice.noticeType,
                                    id: notice.jbonId,
                                    noticeNo: value,
                                  },
                                },
                              )
                              .then(
                                res => res.json(),
                                () => callback('校验失败，刷新试试'),
                              )
                              .then(
                                json => {
                                  if (json.data.resultcode === '201') {
                                    return callback();
                                  }
                                  return callback('项目编号已存在');
                                },
                                () => callback('校验失败，刷新试试'),
                              ),
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 180 }}
                        placeholder="请输入项目编号"
                      />,
                    )}
                  </FormItem>
                </td>
                <td className="required label" style={{ width: 86 }}>
                  品目分类：
                </td>
                <td>
                  <FormItem>
                    {getFieldDecorator('itemsName', {
                      initialValue: notice.itemsName,
                      rules: [
                        {
                          required: true,
                          message: '请输入品目分类',
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 180 }}
                        placeholder="请输入品目分类"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">中标单位：</td>
                <td colSpan={3}>
                  <FormItem>
                    {getFieldDecorator('bidBuName', {
                      initialValue: notice.bidBuName,
                      rules: [
                        {
                          required: true,
                          message: '请输入中标单位',
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 515 }}
                        placeholder="请输入中标单位"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">项目预算：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('planPrice', {
                      initialValue: notice.planPrice,
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请输入项目预算',
                      //   },
                      // ],
                    })(
                      <InputNumber
                        min={0}
                        // min={this.props.form.getFieldValue('bidPrice')}
                        placeholder="请输入项目预算"
                        style={{ width: 180 }}
                        formatter={value =>
                          `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                      />,
                    )}
                  </FormItem>
                </td>
                <td className="label">中标金额：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('bidPrice', {
                      initialValue: notice.bidPrice,
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请输入中标金额',
                      //   },
                      // ],
                    })(
                      <InputNumber
                        min={0}
                        // max={this.props.form.getFieldValue('planPrice')}
                        style={{ width: 180 }}
                        placeholder="请输入中标金额"
                        formatter={value =>
                          `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">公告发布时间：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('putTime', {
                      initialValue: moment(get(notice, 'putTime')),
                      rules: [
                        { required: true, message: '请选择公告发布时间!' },
                      ],
                    })(
                      <DatePicker
                        style={{ width: 180 }}
                        format="YYYY-MM-DD"
                        placeholder="请选择公告发布时间"
                      />,
                    )}
                  </FormItem>
                </td>
                <td className="required label">采购方式：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('purchaseWay', {
                      initialValue: notice.purchaseWay,
                      rules: [{ required: true, message: '请输入采购方式!' }],
                    })(
                      <Input
                        placeholder="请输入采购方式"
                        style={{ width: 180 }}
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">数据来源：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('dataSource', {
                      initialValue: notice.data_source,
                    })(
                      <Select style={{ width: 180 }}>
                        {dataSourceEnums.map(l => (
                          <Option key={l.code} value={l.code}>
                            {l.value}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
                <td className="required label">结果类型：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('resultType', {
                      initialValue:
                        notice.result_type === null ? '' : notice.result_type,
                      required: true,
                    })(
                      <Select style={{ width: 180 }}>
                        {resultEnums.map(l => (
                          <Option key={l.code} value={l.code}>
                            {l.value}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="required label">是否变更：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('isUpdateNotices', {
                      initialValue: notice.is_update_notices,
                    })(
                      <Select style={{ width: 180 }}>
                        <Option key={0} value={0}>
                          否
                        </Option>
                        <Option key={1} value={1}>
                          是
                        </Option>
                      </Select>,
                    )}
                  </FormItem>
                </td>
                <td className="required label">创建时间：</td>
                <td>
                  <FormItem>
                    {getFieldDecorator('createTime', {
                      initialValue: moment(get(notice, 'createTime')),
                      rules: [{ required: true, message: '请选择创建时间!' }],
                    })(
                      <DatePicker
                        style={{ width: 180 }}
                        format="YYYY-MM-DD"
                        placeholder="请选择创建时间"
                      />,
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td className="label">公告正文：</td>
                <td colSpan={3}>
                  <TextEditor
                    value={content === null ? notice.noticeContent : content}
                    onChange={this.editorChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="label">上传公告相关文件：</td>
                <td colSpan={3}>
                  <Upload
                    style={{ width: 300 }}
                    {...upload}
                    defaultFileList={attachs.map(a => ({
                      uid: a.key,
                      name: a.fileName,
                      status: 'done',
                    }))}
                  >
                    <Button style={{ margin: 0 }}>
                      <Icon type="upload" /> 添加附件
                    </Button>
                  </Upload>
                  <small>
                    （最多可上传20M以内的JPG、PNG、DOC、DOCX、RAR、ZIP、GIF、PFD文件）
                  </small>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      this.handleSubmit(0);
                    }}
                  >
                    发布
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      this.handleSubmit(1);
                    }}
                  >
                    暂时保存
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      this.props.commonAction({
                        drawer2: {
                          visible: true,
                        },
                      });
                    }}
                  >
                    预览
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
        <Drawer
          statePath={`${StateName}.drawer2`}
          title="成交公告预览"
          closable
          visible={drawer2.visible || false}
        >
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
            <div style={{ height: 20 }} />
            <div
              style={{
                width: 856,
                height: 90,
                margin: '0 auto',
                border: '1px solid #e6e6e6',
                padding: '12px 20px',
              }}
            >
              <div style={{ display: 'inline-block' }}>
                <div
                  style={{
                    fontSize: 20,
                    verticalAlign: 'middle',
                    lineHeight: '35px',
                  }}
                >
                  {this.props.form.getFieldValue('noticeName')}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#8c8c8c',
                  }}
                >
                  项目编号：{this.props.form.getFieldValue('orderNo')}
                </div>
              </div>
              <div
                style={{
                  float: 'right',
                  color: '#ff6410',
                  display: 'inline-block',
                  lineHeight: '50px',
                }}
              >
                <Icon
                  style={{ fontSize: 20, margin: '5px 10px 0 0' }}
                  type="red-envelope"
                />
                <span style={{ fontSize: 12, verticalAlign: 'middle' }}>
                  预算：
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    verticalAlign: 'middle',
                  }}
                >
                  ¥{this.props.form.getFieldValue('planPrice')}
                </span>
              </div>
            </div>
            <div
              style={{
                width: 856,
                margin: '20px auto',
                border: '1px solid #e6e6e6',
              }}
            >
              <div style={{ padding: '0 18px', height: 41 }}>
                <span
                  style={{
                    fontSize: 18,
                    height: 39,
                    lineHeight: '40px',
                    borderBottom: '2px solid #597FF3',
                  }}
                >
                  公告详情
                </span>
              </div>
              <Collapse
                style={{
                  marginTop: '30px',
                  margin: '20px',
                }}
                bordered={false}
                defaultActiveKey="1"
                onChange={() => {
                  this.props.commonAction({ collapse: !this.props.collapse });
                }}
              >
                <Panel key="1" header={this.props.collapse ? '收起' : '展开'}>
                  <div
                    className="editor-container"
                    style={{ border: 'none', boxShadow: 'none', marginTop: 10 }}
                    dangerouslySetInnerHTML={{
                      __html: content === null ? notice.noticeContent : content,
                    }}
                  />
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 20,
                      verticalAlign: 'top',
                    }}
                  >
                    附件：
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 20,
                      verticalAlign: 'top',
                    }}
                  >
                    {attachs.length === 0 ? (
                      <div>无</div>
                    ) : (
                      attachs.map(a => <div>{a.fileName}</div>)
                    )}
                  </div>
                </Panel>
              </Collapse>
            </div>
            <div
              style={{
                width: 856,
                height: 90,
                margin: '0px auto',
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  this.props.commonAction({ drawer2: { visible: false } });
                }}
              >
                返回
              </Button>
            </div>
          </ScrollArea>
        </Drawer>
      </ScrollArea>
    );
  }
}

const editNoticeForm = Form.create()(EditNotice);

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
    inputNumStyle,
    iconStyle,
    dateStyle,
    uploadStyle,
    messageStyle,
    collapseStyle,
  ),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
)(editNoticeForm);
