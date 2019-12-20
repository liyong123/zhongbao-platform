import React from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import quill from 'react-quill/dist/quill.snow.css';
import get from 'lodash.get';

import {
  Button,
  Form,
  Input,
  Icon,
  DatePicker,
  Upload,
  Breadcrumb,
  InputNumber,
} from 'antd';
import buttonStyle from '../../../antdTheme/button/style/index.less';
import formStyle from '../../../antdTheme/form/style/index.less';
import gridStyle from '../../../antdTheme/grid/style/index.less';
import inputStyle from '../../../antdTheme/input/style/index.less';
import inputNumStyle from '../../../antdTheme/input-number/style/index.less';
import iconStyle from '../../../antdTheme/icon/style/index.less';
import dateStyle from '../../../antdTheme/date-picker/style/index.less';
import breadcrumbStyle from '../../../antdTheme/breadcrumb/style/index.less';
import uploadStyle from '../../../antdTheme/upload/style/index.less';
import quill2 from '../../../thirdStyles/quill.css';
import Link from '../../../components/Link';
import { connect } from '../../../store/redux';
import { commonReducer } from '../../../store/common.reducer';
import { commonAction } from '../../../store/common.action';
import s from './EditNotice.css';
// import Query from '../../../components/Query';
let ReactQuill;
if (global.App) ReactQuill = require('react-quill');

const StateName = 'editNotice';
const defaultState = {
  test: 'default',
};

const FormItem = Form.Item;

class EditNotice extends React.Component {
  onClickChange = () => {
    this.props.commonAction({
      test: Math.random(),
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          putTime: fieldsValue.putTime.format('YYYY-MM-DD'),
        };
        console.log(values);
      }
    });
  };

  render() {
    const { test } = this.props;

    const { getFieldDecorator } = this.props.form;

    const upload = {
      action: '/api/user/upFile',
      onChange: this.handleUpFileChange,
      customRequest: this.checkBeforeUpload,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    //    const CustomToolbar = (
    //      <div
    //        id="toolbar"
    //        style={{
    //          border: '1px solid #ccc',
    //          padding: '8px',
    //          boxSizing: 'border-box',
    //          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    //        }}
    //      >
    //        <select className="ql-size">
    //          <option value="small" />
    //          <option selected />
    //          <option value="large" />
    //        </select>
    //        <button className="ql-bold" />
    //        <button className="ql-italic" />
    //        <Upload
    //          style={{ cursor: 'pointer', margin: '-2px 10px 0 5px' }}
    //          action="/api/user/upFile"
    //          accept=".jpg, .png , .jpeg,.JPEG,.PNG,.JPG"
    //          onChange={this.quillUploadTip}
    //          customRequest={this.quillUploadImage}
    //          showUploadList={false}
    //        >
    //          <Icon
    //            type="picture"
    //            style={{
    //              color: '#000',
    //              fontSize: '18px',
    //              margin: '-2px 10px 0 5px',
    //            }}
    //          />
    //        </Upload>
    //        <Upload
    //          style={{ cursor: 'pointer' }}
    //          action="/api/user/upFile"
    //          accept=".mp4"
    //          onChange={this.quillUploadTip}
    //          customRequest={this.quillUploadVideo}
    //          showUploadList={false}
    //        >
    //          <Icon
    //            type="video-camera"
    //            style={{ color: '#000', fontSize: '18px' }}
    //          />
    //        </Upload>
    //        <button
    //          style={{
    //            position: 'absolute',
    //            top: 4,
    //            left: 250,
    //            fontSize: 16,
    //            fontWeight: 'bold',
    //          }}
    //          onClick={this.deleteQuillText}
    //        >
    //          <Icon type="delete" />
    //        </button>
    //      </div>
    //    );

    //    const modules = {
    //      toolbar: {
    //        container: '#toolbar',
    //      },
    //    };

    return (
      <div className={s.container}>
        <div className={s.breadcrumb}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/DealPublishManagement">成交公告管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>编辑成交公告</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={s.tipText}>
          温馨提示：此页面功能只做为信息公告发布，不具备提供线上投标功能
        </div>
        <Form>
          <FormItem label="采购单位名称" {...formItemLayout}>
            {getFieldDecorator('buName', {
              rules: [{ required: true, message: '请输入采购单位名称!' }],
            })(<Input placeholder="请输入采购单位名称" disabled />)}
          </FormItem>
          <FormItem label="品目分类" {...formItemLayout}>
            {getFieldDecorator('itemsName')(
              <Input placeholder="请输入品目分类" />,
            )}
          </FormItem>
          <FormItem label="公告标题名称" {...formItemLayout}>
            {getFieldDecorator('noticeName', {
              rules: [{ required: true, message: '请输入公告标题名称!' }],
            })(<Input placeholder="请输入公告标题名称" />)}
          </FormItem>
          <FormItem label="项目编号" {...formItemLayout}>
            {getFieldDecorator('orderNo', {
              rules: [{ required: true, message: '请输入项目编号!' }],
            })(<Input placeholder="请输入项目编号" />)}
          </FormItem>
          <FormItem label="中标单位" {...formItemLayout}>
            {getFieldDecorator('bidBuName')(
              <Input placeholder="请输入中标单位" />,
            )}
          </FormItem>
          <FormItem label="项目预算" {...formItemLayout}>
            {getFieldDecorator('planPrice')(
              <InputNumber
                min={1}
                placeholder="请输入项目预算"
                style={{ width: '30%' }}
                formatter={value =>
                  `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value.replace(/\¥\s?|(,*)/g, '')}
              />,
            )}
          </FormItem>
          <FormItem label="中标金额" {...formItemLayout}>
            {getFieldDecorator('bidPrice')(
              <InputNumber
                min={1}
                style={{ width: '30%' }}
                placeholder="请输入中标金额"
                formatter={value =>
                  `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value.replace(/\¥\s?|(,*)/g, '')}
              />,
            )}
          </FormItem>
          <FormItem label="采购方式" {...formItemLayout}>
            {getFieldDecorator('orderType', {
              rules: [{ required: true, message: '请输入采购方式!' }],
            })(<Input placeholder="请输入采购方式" style={{ width: '30%' }} />)}
          </FormItem>
          <FormItem label="公告发布时间" {...formItemLayout}>
            {getFieldDecorator('putTime', {
              rules: [{ required: true, message: '请选择公告发布时间!' }],
            })(
              <DatePicker
                style={{ width: '30%' }}
                format="YYYY-MM-DD"
                placeholder="请选择公告发布时间"
              />,
            )}
          </FormItem>
          <FormItem
            label="公告正文"
            {...formItemLayout}
            style={{ position: 'relative', height: 257 }}
          >
            {global.App && (
              <ReactQuill
                style={{ height: 200 }}
                ref={el => {
                  this.myEditor = el;
                }}
                theme="snow"
                placeholder="请输入公告正文"
                // modules={modules}
              />
            )}
            {/* {global.App && CustomToolbar} */}

            {/* {upLoading && ( */}
            {/* <span */}
            {/* style={{ */}
            {/* position: 'absolute', */}
            {/* top: 115, */}
            {/* left: 260, */}
            {/* color: '#03bbe0', */}
            {/* }} */}
            {/* > */}
            {/* 正在上传中,请稍等... */}
            {/* </span> */}
            {/* )} */}
          </FormItem>
          <FormItem label="上传公告相关文件" {...formItemLayout}>
            <Upload {...upload}>
              <Button>
                <Icon type="upload" /> 添加附件
              </Button>
            </Upload>
            <small>
              （最多可上传20M以内的JPG、PNG、DOC、DOCX、RAR、ZIP、GIF、PFD文件）
            </small>
          </FormItem>
          <FormItem wrapperCol={{ span: 24, offset: 3 }}>
            <Button type="primary" onClick={this.handleSubmit}>
              发布
            </Button>
            <Button style={{ marginLeft: '20px' }} nClick={this.handleSubmit}>
              暂时保存
            </Button>
          </FormItem>
        </Form>
      </div>
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
    breadcrumbStyle,
    quill,
    quill2,
  ),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(editNoticeForm);
