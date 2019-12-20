import React from 'react';
import CreateOrganization from './CreateOrganization';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'CreateOrganization',
    chunks: ['createOrganization'],
    component: (
      <Layout>
        <CreateOrganization />
      </Layout>
    ),
  };
}

export default action;
