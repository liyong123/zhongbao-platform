import React from 'react';
import OldOp from './OldOp';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: '云集运营管理系统',
    chunks: ['oldOp'],
    component: (
      <Layout full showTitle={false}>
        <OldOp />
      </Layout>
    ),
  };
}

export default action;
