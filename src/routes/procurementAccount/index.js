import React from 'react';
import ProcurementAccount from './ProcurementAccount';
import Layout from '../../components/Layout';

const title = '采购单位账户管理';

async function action({ fetch }) { // eslint-disable-line
  return {
    chunks: ['procurementAccount'],
    title,
    component: (
      <Layout title={title}>
        <ProcurementAccount />
      </Layout>
    ),
  };
}

export default action;
