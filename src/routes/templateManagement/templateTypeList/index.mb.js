import React from 'react';
import TemplateTypeList from './TemplateTypeList';
import Layout from '../../../components/Layout';

async function action() {
  return {
    title: '模板列表',
    chunks: ['templateList_mb'],
    component: (
      <Layout>
        <TemplateTypeList />
      </Layout>
    ),
  };
}

export default action;
