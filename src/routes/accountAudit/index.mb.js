import React from 'react';
import AccountAudit from './AccountAudit';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'AccountAudit',
    chunks: ['accountAudit_mb'],
    component: (
      <Layout>
        <AccountAudit />
      </Layout>
    ),
  };
}

export default action;
