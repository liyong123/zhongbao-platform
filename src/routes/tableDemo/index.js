import React from 'react';
import Home from './TableDemo';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'tableDemo',
    chunks: ['tableDemo'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
