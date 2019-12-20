import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import isEqual from 'deep-equal';
import merge from 'lodash.merge';
import get from 'lodash.get';
import memoize from 'memoize-one';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import { commonAction } from '../../store/common.action';

const StateName = '_query';

/**
 * request compoent
 */
class Query extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    auto: PropTypes.bool,
    method: PropTypes.oneOf([
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'get',
      'post',
      'put',
      'delete',
      'patch',
    ]),
    data: PropTypes.any,
    headers: PropTypes.object,
    statePath: PropTypes.string.isRequired,
    refreshKey: PropTypes.any,
  };
  static defaultProps = {
    auto: true,
    method: 'GET',
    data: undefined,
    headers: undefined,
    refreshKey: undefined,
  };

  static contextTypes = {
    store: PropTypes.any,
    fetch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.isInit = true;
  }

  /**
   * 发送fetch请求
   * @param options
   * @returns {Promise.<void>}
   */
  fetch = async options =>
    new Promise(async (resolve, reject) => {
      const {
        url,
        method,
        data,
        headers,
        runtime: { config: { apiUrl }, route: { query } },
      } = this.props;
      const opts = {
        method,
        data: { ...data },
        headers: Object.assign(
          {},
          { 'Content-Type': 'application/x-www-form-urlencoded' },
          headers,
        ),
      };
      if (options) {
        merge(opts, options);
      }
      const actionOpts = { type: this.props.statePath, isGlobal: true };
      this.props.commonAction(
        { fetching: true, failed: false, error: undefined },
        actionOpts,
      );
      try {
        const result = await this.context.fetch(get(options, 'url', url), opts);
        const json = await result.json();
        if (json.resultcode === 401) {
          let url;
          if (query.loginUrl) {
            // 万能测试版
            url = `${query.loginUrl}?redirectURL=${encodeURIComponent(
              window.location.href,
            )}`;
          } else if (query.userCenter) {
            // 集成测试版
            url = `${apiUrl}/single/login?redirectURL=${encodeURIComponent(
              window.location.href,
            )}`;
          } else {
            // 旧版
            url = `${apiUrl}/op/index?redirectUrl=${encodeURIComponent(
              window.location.href,
            )}`;
          }
          window.location.href = url;
        }
        this.props.commonAction({ fetching: false, data: json }, actionOpts);
        resolve(json);
      } catch (ex) {
        this.props.commonAction(
          { fetching: false, failed: true, error: ex },
          actionOpts,
        );
        reject(ex);
      }
    });

  componentDidMount = async () => {
    if (this.props.onRef) this.props.onRef(this);
    if (this.props.auto) {
      try {
        await this.fetch();
      } catch (err) {
        console.error('调用接口出错', this.props.url);
      }
    }
  };

  componentWillUnmount = () => {
    if (this.props.onRef) this.props.onRef(undefined);
  };

  // 只有当数据更新时，需要刷新，但这个数据在外部
  shouldComponentUpdate = nextProps => {
    if (
      this.props.url &&
      (!isEqual(nextProps.data, this.props.data) ||
        nextProps.refreshKey !== this.props.refreshKey ||
        nextProps.url !== this.props.url ||
        nextProps.method !== this.props.method)
    ) {
      this.fetch(nextProps);
      return false;
    }

    return true;
  };

  updateChildren = memoize((children, data) => children(data));

  render() {
    const { children } = this.props;
    const data = get(this.context.store.getState(), this.props.statePath, {});
    if (children) {
      if (typeof children === 'function') {
        return this.updateChildren(children, data);
      }
      return children;
    }
    return null;
  }
}

const mapState = state => ({
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  connect(StateName, commonReducer(StateName, {}), mapState, mapDispatch),
)(Query);
