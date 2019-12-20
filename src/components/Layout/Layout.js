import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { compose } from 'redux';
import { LocaleProvider } from 'antd';
import zhCn from 'antd/lib/locale-provider/zh_CN';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
// import normalizeCss from 'normalize.css';
import s from './Layout.css'; // eslint-disable-line
import Header from '../Header';
import Footer from '../Footer';
import BoardMenu from '../BoardMenu';
import ScrollArea from '../../components/ScrollBar/js/ScrollAreaWithCss';
import { commonAction } from '../../store/common.action';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import Query from '../../components/Query';

const StateName = 'layout';
class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    showTitle: PropTypes.bool,
  };

  static defaultProps = {
    showTitle: true,
  };

  render() {
    const { hasFooter = true, runtime, showTitle, full } = this.props;
    const collapsed = get(this.props.header, 'collapsed', false);
    const title = get(runtime, 'route.title');

    if (get(runtime, 'route.query.embed') === 'true') {
      return (
        <LocaleProvider locale={zhCn}>
          <div className={s.layoutAll}>
            {showTitle && title && <div className={s.pageTitle}>{title}</div>}
            <div
              className={`${s.contentOperationArea} ${
                showTitle ? '' : s.hideTitle
              }`}
            >
              <LocaleProvider locale={zhCn}>
                {this.props.children}
              </LocaleProvider>
            </div>
          </div>
        </LocaleProvider>
      );
    }

    return (
      <div className={s.layoutAll}>
        <Query statePath="runtime.user" url={`{apiUrl}/op/user/details`} />
        <div className={s.mainContentAll}>
          <BoardMenu />
          <Header />
          <div
            className={`${s.mainContentRight} ${
              !collapsed ? s.mainContentRight2 : s.mainContentRight3
            } ${full ? s.full : ''}`}
          >
            <ScrollArea
              verticalContainerStyle={{ zIndex: 999 }}
              smoothScrolling="true"
              contentStyle={{ backgroundColor: '#fff' }}
              speed={10}
              className={s.midDiv}
            >
              <div
                className={`${s.contentOperationArea} ${
                  showTitle ? '' : s.hideTitle
                }`}
              >
                {showTitle && title && <h2 className={s.pageTitle}>{title}</h2>}
                <LocaleProvider locale={zhCn}>
                  {this.props.children}
                </LocaleProvider>
              </div>
            </ScrollArea>
          </div>
        </div>
        {!hasFooter && <Footer />}
      </div>
    );
  }
}

const mapState = state => ({
  header: state.header,
  runtime: state.runtime,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s),
  connect(StateName, commonReducer(StateName), mapState, mapDispatch),
)(Layout);
