import React from 'react';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { DatePicker, Row, Col } from 'antd';
import datePickerStyle from '../../antdTheme/date-picker/style/index.less';
import gridStyle from '../../antdTheme/grid/style/index.less';

class DateRange extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      startValue: props.value ? props.value.start : null,
      endValue: props.value ? props.value.end : null,
      endOpen: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if (nextProps.value) {
      const value = nextProps.value;
      this.setState({
        startValue: value.start,
        endValue: value.end,
      });
    }
  }

  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  triggerChange = (field, value) => {
    const { onChange } = this.props;
    const state = { ...this.state, [field]: value };
    if (onChange) {
      onChange({
        start: state.startValue,
        end: state.endValue,
      });
    }
  };

  onStartChange = value => {
    this.triggerChange('startValue', value);
  };

  onEndChange = value => {
    this.triggerChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;
    const { style = {}} = this.props;
    return (
      <div style={{...style}}>
        <DatePicker
          style={{ width: '47%' }}
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          value={startValue}
          placeholder="开始时间"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          locale={{
            lang: { today: '当天', ok: '确定', timeSelect: '选择时间' },
          }}
          getCalendarContainer={this.props.getCalendarContainer ? this.props.getCalendarContainer : null }
        />
        <span style={{ display: 'inline-block', width: '6%',textAlign: 'center' }}> - </span>
        <DatePicker
          style={{ width: '47%' }}
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          value={endValue}
          placeholder="结束时间"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          getCalendarContainer={this.props.getCalendarContainer ? this.props.getCalendarContainer : null }
          locale={{
            lang: { today: '当天', ok: '确定', timeSelect: '选择时间' },
          }}
        />
      </div>
    );
  }
}

export default compose(withStyles(datePickerStyle, gridStyle))(DateRange);
