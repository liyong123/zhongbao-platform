import React from 'react';
import Sample from './SampleAuthor';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'SampleAuthor',
    chunks: ['sample'],
    component: (
      <Layout>
        <Sample />
      </Layout>
    ),
  };
}

export default action;
