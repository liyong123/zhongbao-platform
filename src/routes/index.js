/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/msgPush',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/publishListPage',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/expertList',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/underlineExpertManagerFb',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/publishListPage',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/publishListPage2',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/expertEvaluationPage',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/underlineExpertManager',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/examine',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/orderStageShow',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },
    {
      path: '/subscribe',
      load: () => import(/* webpackChunkName: 'oldOp' */ './oldOp'),
    },

    {
      path: '/samplePage',
      load: () => import(/* webpackChunkName: 'samplePage' */ './samplePage'),
    },
    {
      path: '/sampleListPage',
      load: () =>
        import(/* webpackChunkName: 'listPageSample' */ './sampleListPage'),
    },
    {
      path: '/sampleAuthor',
      load: () => import(/* webpackChunkName: 'sample' */ './sampleAuthor'),
    },
    /* 供应商审核列表--liyong003 */
    {
      path: '/supplierExamList',
      load: () =>
        import(/* webpackChunkName: 'supplierExamList' */ './supplierExamList'),
    },
    /* 供应商审核列表-审核--liyong003 */
    {
      path: '/supplierAuditing',
      load: () =>
        import(/* webpackChunkName: 'supplierAuditing' */ './supplierExamList/auditing'),
    },
    {
      path: '/auditManagement',
      load: () =>
        import(/* webpackChunkName: 'auditManagement' */ './auditManagement'),
    },
    {
      path: '/createOrganization',
      load: () =>
        import(/* webpackChunkName: 'createOrganization' */ './createOrganization'),
    },
    {
      path: '/procurementAccount',
      load: () =>
        import(/* webpackChunkName: 'procurementAccount' */ './procurementAccount'),
    },
    {
      path: '/boardHome',
      load: () => import(/* webpackChunkName: 'boardHome' */ './boardHome'),
    },
    {
      path: '/DealPublishManagement',
      load: () =>
        import(/* webpackChunkName: 'DealPublishManagement' */ './oldOp'),
    },
    {
      path: '/editNotice',
      load: () =>
        import(/* webpackChunkName: 'editNotice' */ './deal-publish-management/editNotice'),
    },
    {
      path: '/accountManagement',
      load: () =>
        import(/* webpackChunkName: 'accountManagement' */ './accountManagement'),
    },
    {
      path: '/accountAudit',
      load: () =>
        import(/* webpackChunkName: 'accountAudit' */ './accountAudit'),
    },

    // 模板管理_模板列表 - 陈娟
    {
      path: '/templateList',
      load: () =>
        import(/* webpackChunkName: 'templateList' */ './templateManagement/templateList'),
    },

    // 模板管理_模板变量列表 - 陈娟
    {
      path: '/templateTypeList',
      load: () =>
        import(/* webpackChunkName: 'templateTypeList' */ './templateManagement/templateTypeList'),
    },
    // 采购信息管理_采购信息与采购结果  - 陈娟
    {
      path: '/procurementList',
      load: () =>
        import(/* webpackChunkName: 'procurementList' */ './procurementInfo'),
    },
    {
      path: '/tableDemo',
      load: () => import(/* webpackChunkName: 'tableDemo' */ './tableDemo'),
    },
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
