import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SampleComponent.css';

class SampleComponent extends React.Component {
  static propTypes = {
    someProp: PropTypes.string,
    onRef: PropTypes.func,
  };
  static defaultProps = {
    someProp: 'good',
    onRef: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    if (this.props.onRef) this.props.onRef(this);
  };

  componentWillUnmount = () => {
    if (this.props.onRef) this.props.onRef(undefined);
  };

  render() {
    const { someProp } = this.props;
    return (
      <div
        style={this.props.style || {}}
        className={`${s.root} ${this.props.className || ''}`}
      >
        {someProp}
      </div>
    );
  }
}

export default withStyles(s)(SampleComponent);
