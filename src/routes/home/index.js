import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: '云集运营管理平台',
    chunks: ['home'],
    component: (
      <Layout full showTitle={false}>
        <Home />
      </Layout>
    ),
  };
}

export default action;
