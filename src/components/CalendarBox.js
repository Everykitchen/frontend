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

const CalendarBox = ({ value, onChange }) => {
    return (
        <Calendar
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
