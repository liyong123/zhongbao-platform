import React from 'react';
import { compose } from 'redux';
import get from 'lodash.get';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Icon } from 'antd';
import s from './Header.css';
import iconStyles from '../../antdTheme/icon/style/index.less';
import { commonAction } from '../../store/common.action';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import Link from '../Link/Link';
import { getStore } from '../../store/configureStore';

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '/icons/menu.js',
});

const StateName = 'header';
const defaultState = {
  collapsed: false,
};
class Header extends React.Component {
  clickMenu = () => {
    this.props.commonAction({
      collapsed: !this.props.collapsed,
    });
    const currentState = getStore()
      .getState()
      .runtime.route.pathname.replace('/', '');
    setTimeout(() => {
      this.props.commonAction(
        {
          table: {
            resizeKey: new Date(),
          },
        },
        {
          type: currentState,
          isGlobal: true,
        },
      );
    }, 100);
  };
  render() {
    const { collapsed, runtime } = this.props;
    return (
      <div className={`${s.root} clearfix`}>
        <div
          style={{
            width: 460,
            height: 60,
            background: 'linear-gradient(90deg,#4E5366, #868B9F)',
            display: 'inline-block'
          }}
        >
          <div className={s.memuShowHide}>
            <MyIcon type="icon-zhankai" onClick={this.clickMenu} />
          </div>
          <Link to="/" className={s.logoArea}>
            <svg width="38px" height="27px" viewBox="0 0 38 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <title>logo</title>
              <desc>Created with Sketch.</desc>
              <g id="栅格" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="1440-菜单隐藏" transform="translate(-71.000000, -16.000000)" fill="#FFFFFF" fill-rule="nonzero">
                  <g id="Group-8" transform="translate(70.000000, 15.000000)">
                    <g id="logo" transform="translate(1.000000, 1.000000)">
                      <g id="Group-3" transform="translate(0.000000, 0.950000)">
                        <path d="M8.62737192,5.92214691 C6.96051438,7.30479823 5.87263459,9.37791569 5.87263459,11.6946675 C5.87263459,15.8566108 9.24655626,19.2305325 13.4084996,19.2305325 C16.4218361,19.2305325 18.9921404,17.4617804 20.1846076,14.9059057 C19.2222405,18.1567858 16.2131979,20.5285823 12.6501925,20.5285823 C8.3111452,20.5285823 4.79365239,17.0110894 4.79365239,12.6720422 C4.79365239,9.80321552 6.33128672,7.2935226 8.62737192,5.92214691 Z" id="Combined-Shape" opacity="0.600000024"></path>
                        <path d="M9.36951264,24.8876577 C7.34860131,24.2654107 5.59811251,23.0261393 4.33796368,21.3897611 C2.86893336,19.6462887 1.98374235,17.3947171 1.98374235,14.9363981 C1.98374235,10.5071988 4.85724077,6.74914101 8.84171538,5.42474697 C8.1294601,5.8019591 7.47050088,6.28727875 6.88450235,6.87327728 C3.69110118,10.0666784 3.69110118,15.2442047 6.88450235,18.4376059 C10.0779035,21.6310071 15.2554298,21.6310071 18.448831,18.4376059 C20.0048803,16.8815566 20.8441355,14.8116022 20.8438818,12.6544722 C20.8516642,12.2274283 20.9154176,11.7951172 21.0462078,11.3673216 C21.5544262,9.70501436 22.9399161,8.55219484 24.5398543,8.26129245 C25.048022,9.63058886 25.3225362,11.0933934 25.3305693,12.5879664 C25.333194,12.8163068 25.3273562,13.0438305 25.3157033,13.2703239 C25.2862734,13.8712595 25.2134359,14.4757762 25.0950916,15.079927 C24.6177671,17.538067 23.4320825,19.8033975 21.6233526,21.6121275 C18.3036533,24.9318267 13.5997419,26.0236701 9.36951264,24.8876577 Z" id="Combined-Shape"></path>
                        <path d="M4.84946701,22.6237796 C4.45462877,22.3133477 4.07398359,21.9761303 3.70998077,21.6121275 C-1.23666026,16.6654865 -1.23666026,8.64539672 3.70998077,3.69875569 C5.26300991,2.14572655 7.15913573,1.04379981 9.230778,0.461744483 C9.28964051,0.445206284 9.34861456,0.431175879 9.40758621,0.419589307 C10.443371,0.145837996 11.5311428,0 12.6529768,0 C12.9117021,0 13.1693675,0.00779296523 13.4257,0.0232646805 C13.4448341,0.191544844 13.4546646,0.362647968 13.4546646,0.536047133 C13.4546646,2.23070525 12.5157055,3.70605771 11.1296559,4.4702358 C5.73898745,4.91496084 1.5027297,9.43096396 1.5027297,14.9363981 C1.5027297,17.971802 2.79048161,20.7064353 4.84946701,22.6237796 Z" id="Combined-Shape" opacity="0.800000012"></path>
                      </g>
                      <g id="Group-3-Copy-2" transform="translate(25.000000, 13.443671) scale(-1, -1) translate(-25.000000, -13.443671) translate(12.000000, 0.443671)">
                        <path d="M8.62737192,5.92214691 C6.96051438,7.30479823 5.87263459,9.37791569 5.87263459,11.6946675 C5.87263459,15.8566108 9.24655626,19.2305325 13.4084996,19.2305325 C16.4218361,19.2305325 18.9921404,17.4617804 20.1846076,14.9059057 C19.2222405,18.1567858 16.2131979,20.5285823 12.6501925,20.5285823 C8.3111452,20.5285823 4.79365239,17.0110894 4.79365239,12.6720422 C4.79365239,9.80321552 6.33128672,7.2935226 8.62737192,5.92214691 Z" id="Combined-Shape" opacity="0.600000024"></path>
                        <path d="M9.36951264,24.8876577 C7.34860131,24.2654107 5.59811251,23.0261393 4.33796368,21.3897611 C2.86893336,19.6462887 1.98374235,17.3947171 1.98374235,14.9363981 C1.98374235,10.5071988 4.85724077,6.74914101 8.84171538,5.42474697 C8.1294601,5.8019591 7.47050088,6.28727875 6.88450235,6.87327728 C3.69110118,10.0666784 3.69110118,15.2442047 6.88450235,18.4376059 C10.0779035,21.6310071 15.2554298,21.6310071 18.448831,18.4376059 C20.0048803,16.8815566 20.8441355,14.8116022 20.8438818,12.6544722 C20.8516642,12.2274283 20.9154176,11.7951172 21.0462078,11.3673216 C21.5544262,9.70501436 22.9399161,8.55219484 24.5398543,8.26129245 C25.048022,9.63058886 25.3225362,11.0933934 25.3305693,12.5879664 C25.333194,12.8163068 25.3273562,13.0438305 25.3157033,13.2703239 C25.2862734,13.8712595 25.2134359,14.4757762 25.0950916,15.079927 C24.6177671,17.538067 23.4320825,19.8033975 21.6233526,21.6121275 C18.3036533,24.9318267 13.5997419,26.0236701 9.36951264,24.8876577 Z" id="Combined-Shape" opacity="0.800000012"></path>
                        <path d="M4.84946701,22.6237796 C4.45462877,22.3133477 4.07398359,21.9761303 3.70998077,21.6121275 C-1.23666026,16.6654865 -1.23666026,8.64539672 3.70998077,3.69875569 C5.26300991,2.14572655 7.15913573,1.04379981 9.230778,0.461744483 C9.28964051,0.445206284 9.34861456,0.431175879 9.40758621,0.419589307 C10.443371,0.145837996 11.5311428,0 12.6529768,0 C12.9117021,0 13.1693675,0.00779296523 13.4257,0.0232646805 C13.4448341,0.191544844 13.4546646,0.362647968 13.4546646,0.536047133 C13.4546646,2.23070525 12.5157055,3.70605771 11.1296559,4.4702358 C5.73898745,4.91496084 1.5027297,9.43096396 1.5027297,14.9363981 C1.5027297,17.971802 2.79048161,20.7064353 4.84946701,22.6237796 Z" id="Combined-Shape"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span>云集运营管理平台</span>
          </Link>
        </div>
        {get(runtime, 'user.data.code') === undefined ? (
          <div className={s.userGroup}>
            <img
              src={`https://test.jfh.com/jfprofile/resume/pic/${get(
                runtime,
                'user.data.jfid',
              )}`}
              alt=""
            />
            <span>{get(runtime, 'user.data.nickname')}</span>
            {global.App && (
              <a
                className={s.exit}
                href={`${runtime.config.exitUrl}?callback=${encodeURIComponent(
                  get(window, 'location.href', ''),
                )}`}
              >
                <span>退出</span>
              </a>
            )}
          </div>
        ) : (
          <div className={s.userGroup}>
            {global.App && (
              <a
                className={s.exit}
                style={{ background: 'none' }}
                href={`${get(
                  runtime,
                  'config.apiUrl',
                  '',
                )}/op/index?redirectUrl=${encodeURIComponent(
                  get(window, 'location.href', ''),
                )}`}
              >
                <span>请登录</span>
              </a>
            )}
          </div>
        )}
      </div>
    );
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
  withStyles(s, iconStyles),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(Header);
