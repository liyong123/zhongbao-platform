import React from 'react';
import DealPublishManagement from './DealPublishManagement';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: '成交公告管理',
    chunks: ['DealPublishManagement'],
    component: (
      <Layout>
        <DealPublishManagement />
      </Layout>
    ),
  };
}

export default action;
