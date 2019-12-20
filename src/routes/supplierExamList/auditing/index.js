import React from 'react';
import Auditing from './Auditing';

async function action() {
  return {
    title: '供应商审核',
    chunks: ['supplierAuditing'],
    component: (
      <div>
        <Auditing />
      </div>
    ),
  };
}

export default action;
