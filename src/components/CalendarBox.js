/*
캘린더 사용 방법(참고)
import CalendarBox from "./CalendarBox";

<CalendarBox
    value={selectedDate}
    onChange={setSelectedDate}
/>
*/

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import ko from "date-fns/locale/ko";
import { addMonths, isBefore, startOfDay } from "date-fns";

const StyledDatePickerWrapper = styled.div`
  .react-datepicker {
  width: 100%;
  border: none;
  font-size: 18px;
  background: #fff;
  border-radius: 16px;
  padding: 8px 0 24px 0;
    box-shadow: none;
  }
  .react-datepicker__header {
    background: #fff;
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    padding-top: 16px;
  }
  .react-datepicker__navigation {
    top: 18px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #ffbc39;
  }
  .react-datepicker__current-month {
    font-size: 20px;
    font-weight: 600;
    color: #222;
    margin-bottom: 8px;
  }
  .react-datepicker__day-name {
    text-align: center;
    text-transform: none;
    font-size: 14px;
    color: #888;
    font-weight: 500;
    width: 32px;
    line-height: 32px;
    margin: 0 2px;
  }
  .react-datepicker__week {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .react-datepicker__day {
    height: 32px;
    width: 32px;
    font-size: 14px;
    border-radius: 50%;
    transition: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    border: none;
    background: none;
  }
  .react-datepicker__day--today {
    background: #fff5e6;
    color: #ffbc39;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: #ffbc39;
    color: #fff;
    border-radius: 50%;
  }
  .react-datepicker__day--selected:hover,
  .react-datepicker__day--keyboard-selected:hover {
    background: #ffbc39;
    color: #fff;
  }
  .react-datepicker__day:hover {
    background: none;
    color: #ffbc39;
    box-shadow: none;
    border: none;
  }
  .react-datepicker__day--disabled {
    color: #ccc !important;
    pointer-events: none;
    background: none !important;
  }
  .calendarbox-sunday {
    color: #e74c3c !important;
  }
`;

function renderCustomHeader({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 8 }}>
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', fontSize: 24, color: prevMonthButtonDisabled ? '#eee' : '#ffbc39', cursor: prevMonthButtonDisabled ? 'default' : 'pointer' }}>&lt;</button>
      <span style={{ fontSize: 20, fontWeight: 600 }}>{year}.{month}</span>
      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', fontSize: 24, color: nextMonthButtonDisabled ? '#eee' : '#ffbc39', cursor: nextMonthButtonDisabled ? 'default' : 'pointer' }}>&gt;</button>
    </div>
  );
}

function getDayClassName(date) {
  // 0: Sunday
  if (date.getDay() === 0) return 'calendarbox-sunday';
  return undefined;
}

function getDayDisabled(date) {
  // Disable all days before today
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

const CalendarBox = ({ value, onChange, ...props }) => {
  return (
    <StyledDatePickerWrapper>
      <DatePicker
        selected={value}
      onChange={onChange}
        inline
        locale={ko}
        renderCustomHeader={renderCustomHeader}
        dateFormat="yyyy.M"
      minDate={new Date()}
        maxDate={addMonths(new Date(), 6)}
        dayClassName={getDayClassName}
        filterDate={date => !getDayDisabled(date)}
      {...props}
    />
    </StyledDatePickerWrapper>
  );
};

export default CalendarBox;
