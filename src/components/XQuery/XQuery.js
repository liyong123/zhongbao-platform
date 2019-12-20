import React from 'react';
import { Form, Col, Row } from 'antd';
import { compose } from 'redux';
import get from 'lodash.get';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from '../../store/redux';
import { commonReducer } from '../../store/common.reducer';

import s from './XQuery.css';

const FormItem = Form.Item;
const StateName = 'XQuery';

const labelLengthMap = {
  '2': 50,
  '3': 68,
  '4': 80,
  '5': 95,
  '6': 107,
  '7': 125,
};

class Square {
  constructor(stage) {
    this.stage = stage;
    this.row = [];
    this.rowIndex = 0;
    this.col = null;
    this.colIndex = 0;
  }
  add(elem) {
    const propsColSpan = get(elem, 'props.colSpan', 1);
    let colSpan = 1;
    if (propsColSpan instanceof Function) {
      colSpan = propsColSpan(this.stage);
    } else {
      colSpan = propsColSpan;
    }
    if (this.col === null || this.colIndex + colSpan >= this.stage) {
      this.col = [elem];
      this.row.push(this.col);
      this.colIndex = colSpan - 1;
      this.rowIndex++;
      return;
    }
    this.col.push(elem);
    this.colIndex += colSpan;
  }
  getLayout() {
    const colSpan = 24 / this.stage;
    const labelLength = new Array(this.stage);
    this.row.forEach(r => {
      let i = 0;
      r.forEach(_r => {
        const propsColSpan = get(_r, 'props.colSpan', 1);
        let colSpan = 1;
        if (propsColSpan instanceof Function) {
          colSpan = propsColSpan(this.stage);
        } else {
          colSpan = propsColSpan;
        }
        if (
          _r.props.label &&
          (_r.props.label.length > labelLength[i] ||
            labelLength[i] === undefined)
        ) {
          labelLength[i] = _r.props.label.length;
        }
        i += colSpan;
      });
    });
    return this.row.map((r, i) => (
      <Row key={`query_row_${i}`} gutter={20}>
        {r.map((_r, _i) => {
          const propsColSpan = get(_r, 'props.colSpan', 1);
          let _colSpan = 1;
          if (propsColSpan instanceof Function) {
            _colSpan = propsColSpan(this.stage);
          } else {
            _colSpan = propsColSpan;
          }
          return (
            <Col key={`query_col_${_i}`} span={colSpan * (_colSpan || 1)}>
              <XFormItem
                labelLength={labelLengthMap[labelLength[_i]]}
                label={_r.props.label}
              >
                {_r.props.children}
              </XFormItem>
            </Col>
          );
        })}
      </Row>
    ));
  }
}

class XFormItem extends React.Component {
  render() {
    const { labelLength, label, children } = this.props;
    return (
      <div className={s.formItem}>
        {label && (
          <div
            className={s.label}
            style={{
              width: labelLength,
            }}
          >
            {label}：
            <span />
          </div>
        )}
        <div style={{ marginLeft: label ? labelLength : 0 }}>{children}</div>
      </div>
    );
  }
}

class XQuery extends React.Component {
  render() {
    const { runtime } = this.props;
    const clientWidth = get(runtime, 'browserMsg.width', 0);
    let square = null;
    if (!clientWidth) {
      return null;
    } else if (clientWidth >= 1920) {
      square = new Square(6);
    } else if (clientWidth >= 1280) {
      square = new Square(4);
    } else {
      square = new Square(3);
    }
    if (!Array.isArray(this.props.children)) {
      return null;
    }
    this.props.children.forEach(c => {
      square.add(c);
    });
    return <div className={s.queryForm}> {square.getLayout()} </div>;
  }
}

const mapState = state => ({
  runtime: state.runtime,
});

export default compose(
  withStyles(s),
  connect(StateName, commonReducer(StateName, {}), mapState, {}),
)(XQuery);
