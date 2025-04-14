import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { addMonths } from "date-fns";

const Popup = styled.div`
    position: absolute;
    top: 48px;
    left: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 10;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
`;

const ActionButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    background-color: ${(props) => (props.reset ? "#eee" : "#FFA500")};
    color: ${(props) => (props.reset ? "#444" : "white")};
    font-size: 13px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

const CalendarPopup = ({ selectedDate, setSelectedDate, onClose }) => {
    return (
        <Popup>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
                maxDate={addMonths(new Date(), 4)}
                prev2Label={null}
                next2Label={null}
                locale="ko-KR"
            />
            <ButtonRow>
                <ActionButton reset onClick={() => setSelectedDate(null)}>
                    초기화
                </ActionButton>
                <ActionButton onClick={onClose}>확인</ActionButton>
            </ButtonRow>
        </Popup>
    );
};

export default CalendarPopup;

/*
캘린더 팝업 사용 방법(참고)
import CalendarPopup from "../components/CalendarPopup";

<CalendarPopup
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    onClose={handleClose}
/>

*/
