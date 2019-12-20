import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Table, Pagination } from 'antd';
import { Resizable } from 'react-resizable';
import resizeStyle from 'react-resizable/css/styles.css';
import get from 'lodash.get';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import { getStore } from '../../store/configureStore';
import s from './Xtable.css';

import tableStyle from '../../antdTheme/table/style/index.less';
import paginationStyle from '../../antdTheme/pagination/style/index.less';
import spinStyle from '../../antdTheme/spin/style/index.less';
import selectStyle from '../../antdTheme/select/style/index.less';
import checkStyle from '../../antdTheme/checkbox/style/index.less';

const StateName = 'xtable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

class XTable extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    statePath: PropTypes.string.isRequired,
    rowKey: PropTypes.any.isRequired,
    fixHeight: PropTypes.bool,
  };

  static contextTypes = {
    scrollArea: PropTypes.object,
  };

  static defaultProps = {
    fixHeight: false,
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
    if (this.props.onRef) this.props.onRef(this);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
    if (this.props.onRef) this.props.onRef(undefined);
  };

  componentDidUpdate = () => {
    const { statePath, resizeKey } = this.props;
    if (this.resizeKey !== resizeKey) {
      this.resizeKey = resizeKey;
      this.props.commonAction(
        { resizeKey },
        { type: statePath, isGlobal: true },
      );
      if (this.resize) {
        this.resize();
      }
    }
  };

  render() {
    const {
      columns,
      className = '',
      style = {},
      rowKey,
      statePath,
      needRowSelection = true,
      needPagination = true,
      rowSelectionCallback,
      fixHeight,
      ...rest
    } = this.props;

    const dataSource = get(
      this.props,
      'data.data.data.list',
      get(getStore().getState(), `${statePath}.data.data.list`, []),
    );

    const _columns = get(
      getStore().getState(),
      `${statePath}.columns`,
      columns,
    );
    const loading = get(getStore().getState(), `${statePath}.fetching`, false);
    const pageSize = get(getStore().getState(), `${statePath}.pageSize`, 10);
    const totalWidth = get(getStore().getState(), `${statePath}.totalWidth`, 0);
    const selectedRowKeys = get(
      getStore().getState(),
      `${statePath}.selectedRowKeys`,
      [],
    );
    const rowSelection = {
      onChange: selectedRowKeys => {
        const actionOpts = { type: statePath, isGlobal: true };
        this.props.commonAction({ selectedRowKeys }, actionOpts);
        if (rowSelectionCallback) rowSelectionCallback(selectedRowKeys);
      },
      selectedRowKeys,
    };
    const scrollHeight = get(
      getStore().getState(),
      `${statePath}.scrollHeight`,
      0,
    );
    const current = get(getStore().getState(), `${statePath}.current`, 1);
    const total = get(getStore().getState(), `${statePath}.data.data.total`, 0);
    const pagination = { total, pageSize, current };

    return (
      <div
        style={{ ...style }}
        className={`${s['x-table']} ${
          fixHeight ? s.fixHeight : ''
        } ${className || ''}`}
        ref={this.size}
      >
        <Table
          bordered
          components={this.components}
          dataSource={dataSource}
          columns={_columns}
          pagination={false}
          loading={loading}
          rowKey={rowKey}
          rowSelection={needRowSelection ? rowSelection : null}
          scroll={{ ...(fixHeight && { y: scrollHeight }), x: totalWidth }}
          {...rest}
        />
        {needPagination && (
          <div className={s.footer}>
            <span className={s.count}>{`共 ${total} 条数据`}</span>
            <Pagination
              size="small"
              onChange={this.onChangePage}
              onShowSizeChange={this.onShowSizeChange}
              showSizeChanger
              showQuickJumper
              {...pagination}
            />
          </div>
        )}
      </div>
    );
  }

  resize = () => {
    this.sizeTimer = clearTimeout(this.sizeTimer);
    if (this.instance)
      this.sizeTimer = setTimeout(this.size, 500, this.instance);
  };

  size = instance => {
    this.instance = instance;
    const {
      statePath,
      needRowSelection = true,
      needPagination = true,
    } = this.props;
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    const headAndFooter = needPagination ? 92.5 : 48;
    const scrollHeight = get(
      getStore().getState(),
      `${statePath}.scrollHeight`,
      0,
    );

    const scrollWidth = get(
      getStore().getState(),
      `${statePath}.scrollWidth`,
      0,
    );
    if (
      instance &&
      (scrollHeight !== instance.offsetHeight - headAndFooter ||
        scrollWidth !== instance.offsetWidth)
    ) {
      this.props.commonAction(
        {
          scrollHeight: Math.max(instance.offsetHeight - headAndFooter, 200),
          scrollWidth: instance.offsetWidth,
        },
        actionOpts,
      );

      let _scrollWidth = instance.offsetWidth;
      _scrollWidth = needRowSelection ? _scrollWidth - 62 : _scrollWidth; // 若要计入纵向滚动条需再减17
      let { columns } = this.props;
      const opts = { type: statePath, isGlobal: true };
      let totalWidth = 0;
      let noWidthColNum = 0;
      columns.forEach(col => {
        if (col.width) {
          if (col.width < 100) col.width = 100;
          if (typeof col.width === 'string' && col.width.indexOf('%') !== -1) {
            totalWidth += scrollWidth * col.width.replace('%', '') / 100;
          } else {
            totalWidth += col.width;
          }
        } else {
          noWidthColNum++;
        }
      });
      const restColWidth =
        (_scrollWidth - totalWidth) / noWidthColNum < 100
          ? 100
          : (_scrollWidth - totalWidth) / noWidthColNum;
      columns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
        width: col.width ? col.width : restColWidth,
        title:
          typeof webkitCancelAnimationFrame === 'undefined' ? (
            <div className={s['over-span']}>
              <div className={s['over-span-pos']}>
                <div className={s['over-span-text']}>{col.title}</div>
                <div className={s['over-span-ellipsis']}>...</div>
              </div>
            </div>
          ) : (
            <div
              className={s['over-span-webkit']}
              style={{ WebkitBoxOrient: 'vertical', userSelect: 'none' }}
            >
              {col.title}
            </div>
          ),
        render: (value, rowData) => {
          const content = col.render ? col.render(value, rowData) : value;
          const title =
            typeof content === 'string' || typeof content === 'number'
              ? content
              : '';
          if (typeof webkitCancelAnimationFrame !== 'undefined') {
            return (
              <div
                className={s['over-span-webkit']}
                style={{ WebkitBoxOrient: 'vertical' }}
                {...(title ? { title } : {})}
              >
                {content}
              </div>
            );
          }
          return (
            <div className={s['over-span']} {...(title ? { title } : {})}>
              <div className={s['over-span-pos']}>
                <div className={s['over-span-text']}>{content}</div>
                <div className={s['over-span-ellipsis']}>...</div>
              </div>
            </div>
          );
        },
      }));
      let _totalWidth = 0;
      columns.forEach(col => {
        _totalWidth += col.width;
      });

      this.props.commonAction(
        {
          columns,
          totalWidth:
            _scrollWidth >= _totalWidth
              ? false
              : needRowSelection ? _totalWidth + 62 : _totalWidth,
        },
        opts,
      );
    }

    if (this.heightTimer) this.heightTimer = clearInterval(this.heightTimer);
    this.heightTimer = setInterval(this.updateHeight, 200);
  };

  updateHeight = () => {
    if (!this.props.fixHeight) return;
    const dom = document.querySelector(`.ant-table-body`);
    const doms = document.querySelectorAll(`.ant-table-body-inner`);
    const scrollHeight = get(
      getStore().getState(),
      `${this.props.statePath}.scrollHeight`,
    );
    const totalWidth = get(
      getStore().getState(),
      `${this.props.statePath}.totalWidth`,
    );
    if (dom) {
      dom.style.height = `${scrollHeight}px`;
      doms.forEach(d => {
        d.style.height = `${scrollHeight}px`;
        if (!totalWidth) {
          d.style.overflowX = 'hidden';
        }
      });
      this.heightTimer = clearInterval(this.heightTimer);
    }
  };

  onChangePage = (current, pageSize) => {
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    this.props.commonAction({ pageSize, current }, actionOpts);
  };

  onShowSizeChange = (current, pageSize) => {
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    this.props.commonAction({ pageSize, current }, actionOpts);
    this.context.scrollArea.scrollTop();
  };

  handleResize = index => (e, { size }) => {
    const { statePath } = this.props;
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    const columns = get(getStore().getState(), `${statePath}.columns`, []);
    if (!columns[index + 1]) return;
    if (size.width < 100) size.width = 100;
    if (columns[index + 1].width + columns[index].width - size.width < 100) {
      size.width = columns[index + 1].width + columns[index].width - 100;
    }
    columns[index + 1].width =
      columns[index + 1].width + columns[index].width - size.width;
    columns[index].width = size.width;
    this.props.commonAction({ columns }, actionOpts);
  };
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
    tableStyle,
    paginationStyle,
    spinStyle,
    resizeStyle,
    selectStyle,
    checkStyle,
  ),
  connect(StateName, commonReducer(StateName, {}), mapState, mapDispatch),
)(XTable);
