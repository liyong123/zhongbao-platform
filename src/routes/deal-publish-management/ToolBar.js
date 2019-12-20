import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
// import get from 'lodash.get';
import { Button, message } from 'antd';
import get from 'lodash.get';

import buttonStyle from '../../antdTheme/button/style/index.less';
import messageStyle from '../../antdTheme/message/style/index.less';

import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './ToolBar.css';
import BulkImport from '../../components/BulkImport';

const StateName = 'DealPublishManagement';

// 查询表单
class ToolBar extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func,
  };

  render() {
    const { importBulk = 0, yunJiList } = this.props;
    return (
      <div className="toolBar">
        {importBulk === 1 && (
          <BulkImport
            statePath={`${StateName}`}
            importBulk={importBulk}
            selectShow
            fileAttrName="file"
            selectAttrName="platform"
            importURL="/op/v1/publish/notice/batchInputExcel"
            query={this.props.query}
            optionList={yunJiList}
          />
        )}
        {global.App && (
          <Button
            type="primary"
            icon="download"
            href={`${get(
              global,
              'App.apiUrl',
            )}/op/v1/publish/notice/downloadImportTemplate`}
          >
            模板下载
          </Button>
        )}
        <Button type="primary" onClick={this.bulkImport} icon="download">
          批量导入
        </Button>
        <Button loading={this.props.isUpdating} onClick={this.update}>
          更新
        </Button>
      </div>
    );
  }

  bulkImport = () => {
    const actionOpts = { type: `${StateName}`, isGlobal: true };
    this.props.commonAction(
      {
        importBulk: 1,
      },
      actionOpts,
    );
  };

  update = async () => {
    this.props.commonAction({ isUpdating: true });
    const result = await this.context.fetch(
      '{apiUrl}/op/v1/publish/notice/updateData',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const json = await result.json();
    if (json.code === 200 && json.data && json.data.resultcode === '200') {
      this.props.commonAction({ table: { refreshKey: new Date() } });
      message.success('更新成功');
      this.props.commonAction({ isUpdating: false });
    } else {
      // 失败提示
      message.error('更新失败');
      this.props.commonAction({ isUpdating: false });
    }
  };
}

const mapState = state => ({
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, buttonStyle, messageStyle),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
)(ToolBar);
