import React from 'react';
import OldOp from './OldOp';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'OldOp',
    chunks: ['oldOp_mb'],
    component: (
      <Layout>
        <OldOp />
      </Layout>
    ),
  };
}

export default action;
