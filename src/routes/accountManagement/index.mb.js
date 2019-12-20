import React from 'react';
import AccountManagement from './AccountManagement';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'AccountManagement',
    chunks: ['accountManagement_mb'],
    component: (
      <Layout>
        <AccountManagement />
      </Layout>
    ),
  };
}

export default action;
