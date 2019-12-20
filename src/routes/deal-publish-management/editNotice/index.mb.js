import React from 'react';
import EditNotice from './EditNotice';
import Layout from '../../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'edit',
    chunks: ['editNotice_mb'],
    component: (
      <Layout>
        <EditNotice />
      </Layout>
    ),
  };
}

export default action;
