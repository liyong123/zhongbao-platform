import React from 'react';
import TemplateList from './TemplateList';
import Layout from '../../../components/Layout';

async function action() {
  return {
    title: '模板列表',
    chunks: ['templateList'],
    component: (
      <Layout>
        <TemplateList />
      </Layout>
    ),
  };
}

export default action;
