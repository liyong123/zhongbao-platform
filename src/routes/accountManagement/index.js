import React from 'react';
import AccountManagement from './AccountManagement';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: '账户管理',
    chunks: ['accountManagement'],
    component: (
      <Layout>
        <AccountManagement />
      </Layout>
    ),
  };
}

export default action;
