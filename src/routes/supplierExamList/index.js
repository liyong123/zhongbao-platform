import React from 'react';
import SupplierExamList from './SupplierExamList';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: '供应商审核列表',
    chunks: ['supplierExamList'],
    component: (
      <Layout>
        <SupplierExamList />
      </Layout>
    ),
  };
}

export default action;
