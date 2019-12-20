import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon as _Icon, Button } from 'antd';
import get from 'lodash.get';
import Memorize from 'memoize-one';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ScrollArea from '../../components/ScrollBar/js/ScrollAreaWithCss';
import menuStyles from '../../antdTheme/menu/style/index.less';
import iconStyles from '../../antdTheme/icon/style/index.less';
import buttonStyles from '../../antdTheme/button/style/index.less';
import s from './BoardMenu.css';
import Link from '../Link';
import { commonAction } from '../../store/common.action';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';
import Query from '../../components/Query';

const Icon = _Icon.createFromIconfontCN({
  scriptUrl: '/icons/menu.js',
});

const { SubMenu, Item } = Menu;
const StateName = 'boardMenu';

const defaultState = {
  openKeys: [],
};
class BoardMenu extends React.Component {
  static contextTypes = {
    scrollArea: PropTypes.object,
    store: PropTypes.any,
  };
  setCurrentMenu = Memorize(menu => {
    const preMenu = this.props.runtime.currentMenu;
    this.props.commonAction(menu, {
      type: 'runtime.currentMenu',
      isGlobal: true,
    });

    if (preMenu && !preMenu.autoClear) {
      const name = preMenu.stateName || preMenu.url.match(/\/(\w*)$/)[1];
      if (name && this.context.store.getState()[name]) {
        this.props.commonAction(null, {
          type: name,
          isGlobal: true,
        });
      }
    }
  });
  onOpenChange = openKeys => {
    this.props.commonAction({
      openKeys: openKeys.slice(-1),
    });

    setTimeout(() => {
      this.context.scrollArea.refresh();
    }, 200);
  };

  render() {
    const collapsed = get(this.props.header, 'collapsed', false);

    const { runtime: { user }, openKeys } = this.props;
    return (
      <div>
        <Query method="get" url="/menu.json" statePath={`${StateName}.cors`}>
          {({ fetching, failed, data, error }) => {
            if (fetching) {
              return <div style={{ color: '#fff' }}>加载中...</div>;
            }
            if (failed) {
              console.error(error);
              return <div style={{ color: '#fff' }}>请求失败...</div>;
            }
            if (data) {
              /* 根据路径展示相应的菜单 start */
              const menuData = get(data, `data`, []);
              const updatePath = get(this.props.runtime, 'route.pathname', '');
              const defaultOpenKeys = [];
              let defaultKey = '';
              let defaultMenu = null;
              if (menuData && menuData.length > 0) {
                menuData.forEach(item => {
                  if (item.children) {
                    // defaultOpenKeys.push(item.name);
                  }
                  if (item.url && item.url === updatePath) {
                    defaultKey = item.name;
                    defaultMenu = item;
                  } else if (
                    !item.url &&
                    item.children &&
                    item.children.length > 0
                  ) {
                    for (let i = 0; i < item.children.length; i++) {
                      if (item.children[i].url === updatePath) {
                        defaultKey = item.children[i].name;
                        defaultMenu = item.children[i];
                      }
                      defaultOpenKeys.push(item.name);
                    }
                  }
                });
              }
              this.setCurrentMenu(defaultMenu);
              /* 根据路径展示相应的菜单 end */

              const groupList = get(user, 'data.groupList', []);

              return (
                <div>
                  {menuData.length > 0 ? (
                    <Menu
                      defaultSelectedKeys={[defaultKey]}
                      inlineCollapsed={collapsed}
                      defaultOpenKeys={defaultOpenKeys}
                      openKeys={
                        (openKeys.length === 0 && !collapsed) ? defaultOpenKeys : openKeys
                      }
                      onOpenChange={this.onOpenChange}
                      mode="inline"
                      theme="dark"
                    >
                      {menuData.length > 0 &&
                        menuData.map(item => {
                          if (item.id && groupList.indexOf(item.id) === -1) {
                            return null;
                          }

                          if (item.children && item.children.length > 0) {
                            return (
                              <SubMenu
                                key={item.name}
                                title={
                                  <span>
                                    <Icon type={item.icon} />
                                    <span>{item.name}</span>
                                  </span>
                                }
                              >
                                {item.children.map(item2 => {
                                  if (
                                    item2.id &&
                                    groupList.indexOf(item2.id) === -1
                                  ) {
                                    return null;
                                  }
                                  return (
                                    <Item key={item2.name}>
                                      <div>
                                        <Link to={`${item2.url}`}>
                                          {item2.name}
                                        </Link>
                                      </div>
                                    </Item>
                                  );
                                })}
                              </SubMenu>
                            );
                          }
                          return (
                            <Item
                              key={item.name}
                              disabled={item.temporaryDisabled}
                            >
                              <Link to={`${item.url}`}>
                                <span>
                                  <Icon type={item.icon} />
                                  <span>{item.name}</span>
                                </span>
                              </Link>
                            </Item>
                          );
                        })}
                    </Menu>
                  ) : (
                    <div style={{ color: '#fff' }}>暂无数据</div>
                  )}
                </div>
              );
            }
            return null;
          }}
        </Query>
      </div>
    );
  }
}
class BoardMenuWrapper extends React.Component {
  render() {
    const collapsed = get(this.props.header, 'collapsed', false);
    const { runtime: { user } } = this.props;

    if (!user) {
      return null;
    }
    return (
      <ScrollArea
        verticalContainerStyle={{ zIndex: 999, marginRight: -1 }}
        smoothScrolling="true"
        speed={10}
        className={`${s.menuAll} ${collapsed ? s.menuAll2 : s.menuAll3}`}
      >
        <BoardMenu {...this.props} />
      </ScrollArea>
    );
  }
}

const mapState = state => ({
  layout: state.layout,
  runtime: state.runtime,
  header: state.header,
  ...state[StateName],
});

const mapDispatch = {
  commonAction: commonAction(StateName),
};

export default compose(
  withStyles(s, menuStyles, iconStyles, buttonStyles),
  connect(
    StateName,
    commonReducer(StateName, defaultState),
    mapState,
    mapDispatch,
  ),
)(BoardMenuWrapper);
