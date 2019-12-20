import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Button, Select, Modal, Upload, Icon, message } from 'antd';
import get from 'lodash.get';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './BulkImport.css';

import formStyle from '../../antdTheme/form/style/index.less';
import buttonStyle from '../../antdTheme/button/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import modalStyle from '../../antdTheme/modal/style/index.less';
import uploadStyle from '../../antdTheme/upload/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less';// eslint-disable-line
import iconStyle from '../../antdTheme/icon/style/index.less';// eslint-disable-line

import Query from '../Query/Query'; // eslint-disable-line
import ScrollArea from '../../components/ScrollBar/js/ScrollAreaWithCss';

const StateName = 'bulkImport';
const { Option } = Select;

class BulkImport extends React.Component {
  static defaultProps = {
    onRef: () => {},
    uploading: false,
    fileList: [],
  };
  static propTypes = {
    onRef: PropTypes.func,
    statePath: PropTypes.string.isRequired,
    importBulk: PropTypes.number.isRequired,
    selectShow: PropTypes.bool.isRequired,
    importURL: PropTypes.string.isRequired,
    uploading: false,
    fileList: [],
    optionList: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    this.props.commonAction(
      {
        importBulk: 0,
      },
      actionOpts,
    );
    this.props.commonAction({
      fileList: [],
      uploadData: null,
    });
  };

  query = () => {
    const questData = {
      pageSize: 10,
      pageNum: 1,
    };
    this.props.query.fetch({ data: questData });
  };

  handleUpload = () => {
    const {
      fileList,
      fileAttrName = 'buyerFile',
      selectAttrName = 'selectValue',
      optionList,
    } = this.props;
    const formData = new FormData();

    let selectValue = optionList[0] ? optionList[0].count || 0 : 0;
    if (this.selectYUNJI !== undefined) {
      selectValue = this.selectYUNJI;
    }

    formData.append(fileAttrName, fileList[0]);
    formData.append(selectAttrName, selectValue);

    setTimeout(async () => {
      let result;
      try {
        console.log('formData', formData);
        result = await this.uploader.fetch({
          data: formData,
          headers: { 'Content-Type': null },
        });
      } catch (e) {
        message.error('保存失败！', 1);
      }

      // 接口返回成功
      if (result) {
        if (get(result, 'code', '') === 200) {
          this.query();
          this.props.commonAction({
            fileList: [],
          });
          // message.error('保存成功！', 1);
        }
      }
    }, 0);
  };

  render() {
    const {
      selectShow,
      importURL,
      uploading,
      uploadData,
      fileList,
      optionList,
    } = this.props;
    const actionUrl = `${get(global, 'App.apiUrl')}${importURL}`;
    let optionListText;
    let optionSelectValue = 1;
    if (optionList.length > 0) {
      optionListText = optionList.map((item, index) => {
        if (index === 0) {
          optionSelectValue = item.count;
          return (
            <Option key={item.count} value={item.count} selected="selected">
              {item.yunjitext}
            </Option>
          );
        }
        return (
          <Option key={item.count} value={item.count}>
            {item.yunjitext}
          </Option>
        );
      });
    }

    const textArray = get(uploadData, 'data.data.rows', []);

    let detailP;
    if (textArray.length > 0) {
      detailP = textArray.map((comment, i) => (
        <tr className={s.tableTitle} key={i}>
          <td>{comment.number}</td>
          <td>{comment.msg}</td>
        </tr>
      ));
    }

    const props = {
      accept: 'file',
      name: 'file',
      action: actionUrl,
      onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        this.props.commonAction({
          fileList: newFileList,
        });
      },
      beforeUpload: file => {
        this.props.commonAction({
          fileList: [file],
        });
        return false;
      },
      fileList: this.props.fileList,
    };

    const tableList = {
      width: '100%',
      color: '#666',
    };

    return (
      <div
        style={this.props.style || {}}
        className={`${this.props.className || ''}`}
      >
        {/* getYunjiList */}
        <Query
          method="get"
          url="{apiUrl}/op/v1/buyers/getYunjiList"
          statePath={`${StateName}.yunjiList`}
        />
        <Query
          onRef={query => {
            this.uploader = query;
          }}
          auto={false}
          method="post"
          url={actionUrl}
          statePath={`${StateName}.uploadData`}
        />
        <Modal
          title="批量导入"
          visible
          destroyOnClose
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Upload {...props}>
            <Button type="primary">
              <Icon type="login" />
              选择文件
            </Button>
          </Upload>

          {selectShow && (
            <div className={s.selectFile}>
              <Select
                style={{ width: '100%' }}
                onChange={e => {
                  this.selectYUNJI = e;
                }}
                defaultValue={optionSelectValue}
              >
                {optionListText}
              </Select>
            </div>
          )}

          <div className={s.infoList}>
            <table style={tableList} className={s.tableListClass}>
              <tr>
                <th style={{ width: 284 }}>数据行：</th>
                <th style={{ width: 308 }}>信息：</th>
              </tr>
            </table>
          </div>
          <ScrollArea
            stopScrollPropagation
            smoothScrolling="true"
            speed={10}
            style={{ height: 230, backgroundColor: '#fafafa' }}
          >
            <table className={s.tableListClass} style={{ marginTop: -12 }}>
              <tbody className={s.tbody}>
                <tr>
                  <td style={{ width: 284 }} /> <td style={{ width: 308 }} />
                </tr>
                {textArray.length > 0 && detailP}
              </tbody>
            </table>
          </ScrollArea>

          <div className={s.buttonBottom}>
            <Button
              className={s.button}
              type="primary"
              onClick={this.handleUpload.bind(this)}
              disabled={this.props.fileList.length === 0}
              loading={uploading}
            >
              {uploading ? 'Uploading' : '确定'}
            </Button>

            <Button className={s.button} onClick={this.handleCancel}>
              取消
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapState = state => ({
  layout: state.layout,
  yunjiList: state.yunjiList,
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
    selectStyle,
    modalStyle,
    uploadStyle,
    messageStyle,
    iconStyle,
  ),
  connect(StateName, commonReducer(StateName, {}), mapState, mapDispatch),
)(BulkImport);
