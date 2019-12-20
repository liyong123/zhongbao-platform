import React from 'react';
import ListPageSample from './ListPageSample';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'ListPageSample',
    chunks: ['listPageSample'],
    component: (
      <Layout>
        <ListPageSample />
      </Layout>
    ),
  };
}

export default action;
