import React from 'react';
import SupplierExamList from './SupplierExamList';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'SupplierExamList',
    chunks: ['supplierExamList_mb'],
    component: (
      <Layout>
        <SupplierExamList />
      </Layout>
    ),
  };
}

export default action;
