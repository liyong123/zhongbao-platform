import React from 'react';
import TemplateTypeList from './TemplateTypeList';
import Layout from '../../../components/Layout';

async function action() {
  return {
    title: '模板变量列表',
    chunks: ['templateTypeList'],
    component: (
      <Layout>
        <TemplateTypeList />
      </Layout>
    ),
  };
}

export default action;
