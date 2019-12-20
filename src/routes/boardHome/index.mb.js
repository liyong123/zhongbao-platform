import React from 'react';
import BoardHome from './BoardHome';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  return {
    title: 'BoardHome',
    chunks: ['boardHome_mb'],
    component: (
      <Layout>
        <BoardHome />
      </Layout>
    ),
  };
}

export default action;
