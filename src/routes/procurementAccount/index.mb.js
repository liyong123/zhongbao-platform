import React from 'react';
import ProcurementAccount from './ProcurementAccount';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'ProcurementAccount',
    chunks: ['procurementAccount_mb'],
    component: (
      <Layout>
        <ProcurementAccount />
      </Layout>
    ),
  };
}

export default action;
