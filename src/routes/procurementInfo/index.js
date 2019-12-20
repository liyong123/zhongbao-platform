import React from 'react';
import Home from './ProcurementList';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: '采购信息管理',
    chunks: ['procurementList'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
