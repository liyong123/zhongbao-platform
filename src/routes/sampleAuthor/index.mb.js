import React from 'react';
import Sample from './SampleAuthor';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'Sample',
    chunks: ['sample_mb'],
    component: (
      <Layout>
        <Sample />
      </Layout>
    ),
  };
}

export default action;
