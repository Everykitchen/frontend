/*
캘린더 사용 방법(참고)
import CalendarBox from "./CalendarBox";

<CalendarBox
    value={selectedDate}
    onChange={setSelectedDate}
/>
*/

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addMonths } from "date-fns";
import styled from "styled-components";

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: none;
  
  .react-calendar__tile--now {
    background: #fff5e6;
  }
  
  .react-calendar__tile--active {
    background: #ffbc39 !important;
  }
  
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #ffe4b3;
  }
`;

const CalendarBox = ({ value, onChange }) => {
    return (
        <StyledCalendar
            onChange={onChange}
            value={value}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 4)}
            prev2Label={null}
            next2Label={null}
            locale="ko-KR"
        />
    );
};

export default CalendarBox;
