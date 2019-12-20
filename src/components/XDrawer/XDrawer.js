import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { Drawer } from 'antd';
import get from 'lodash.get';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';
import s from './XDrawer.css';
import drawerStyle from '../../antdTheme/drawer/style/index.less';

const StateName = 'xDrawer';

const style = {};

class XDrawer extends Component {
  static defaultProps = {
    visible: false,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    statePath: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  };

  handleClose(visible) {
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    this.props.commonAction({ visible: !visible }, actionOpts);
    if (typeof this.props.closeHook === 'function') {
      this.props.closeHook.call();
    }
  }

  render() {
    const {
      title,
      placement = 'right',
      visible = false,
      header,
      runtime,
    } = this.props;

    let collapsedwidth = get(header, 'collapsed', false)
      ? 'calc(100% - 70px)'
      : 'calc(100% - 230px)';

    if (get(runtime, 'route.query.embed') === 'true') {
      collapsedwidth = 'calc(100% - 2px)';
    }

    return (
      <Drawer
        className={s.opDrawer}
        title={title}
        closable
        placement={placement}
        onClose={this.handleClose.bind(this, visible)}
        visible={visible}
        width={collapsedwidth}
        style={style}
      >
        {this.props.children}
      </Drawer>
    );
  }

  componentDidMount() {
    const actionOpts = { type: this.props.statePath, isGlobal: true };
    this.props.commonAction({ visible: false }, actionOpts);
  }
}

const mapState = state => ({
  layout: state.layout,
  header: state.header,
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, drawerStyle),
  connect(StateName, commonReducer(StateName, {}), mapState, mapDispatch),
)(XDrawer);
