import React, {Component} from 'react';
import {DateRangePicker} from 'react-dates';

class DateRangeComponent extends Component {
  state={
    startDate: null, endDate: null, focusedInput: null,
  }
  onDateRangeChange = ({startDate, endDate}) => {
    
    this.setState({startDate, endDate});
  }
  onDateRangeFocusChange = (focusedInput) => {
    this.setState({focusedInput});
  }
  onDateRangeClose = ({startDate, endDate}) => {
    if (this.props.onChange) {
      this.props.onChange({startDate, endDate});
    }
  }
  render() {
    const {startDate, endDate, focusedInput} = this.state;
    const {onDateRangeClose, onDateRangeChange, onDateRangeFocusChange} = this;
    return (
      <DateRangePicker
        onClose={onDateRangeClose}
        isOutsideRange={() => false}
        startDate={startDate}
        startDateId="your_unique_start_date_id"
        endDate={endDate}
        endDateId="your_unique_end_date_id"
        onDatesChange={onDateRangeChange}
        focusedInput={focusedInput}
        onFocusChange={onDateRangeFocusChange}
      />
    )
  }
}

export default DateRangeComponent;
