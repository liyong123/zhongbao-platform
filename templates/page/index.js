import React from 'react';
import SamplePage from './SamplePage';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'SamplePage',
    chunks: ['samplePage'],
    component: (
      <Layout>
        <SamplePage />
      </Layout>
    ),
  };
}

export default action;
