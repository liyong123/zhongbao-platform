import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'Home',
    chunks: ['home_mb'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
