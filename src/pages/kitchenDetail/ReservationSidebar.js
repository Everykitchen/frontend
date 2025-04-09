import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addYears, format } from "date-fns";

const RightSection = styled.div`
  flex: 1;
  position: sticky;
  top: 100px;
  border: 1px solid #ffbc39;
  border-radius: 10px;
  padding: 24px;
  height: fit-content;
  min-width: 300px;
  background-color: white;
`;

const TimeLabelRow = styled.div`
  display: flex;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  overflow-x: auto;
`;

const TimeLabel = styled.div`
  width: 40px;
  text-align: center;
`;

const TimeScrollBox = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 8px;
`;

const TimeBlock = styled.div`
  width: 40px;
  height: 36px;
  background-color: ${(props) => (props.active ? "#ffbc39" : "#f7f7f7")};
  border: 1px solid #ccc;
  cursor: pointer;
`;

const TimeRange = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin: 8px 0 4px;
  white-space: pre-line;
`;

const WeekdayInfo = styled.div`
  font-size: 13px;
  color: #777;
  white-space: pre-line;
  margin-bottom: 16px;
`;

const CounterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
`;

const CounterButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 6px;
`;

const ReserveButton = styled.button`
  background-color: #ffbc39;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 10px;
  margin-top: 12px;
  width: 100%;
  font-size: 16px;
`;

const ReservationSidebar = ({ startDate, setStartDate, count, setCount, startTime, endTime, handleTimeClick }) => {
  const renderReservationTime = () => {
    if (startTime !== null && endTime !== null) {
      return `예약 일시\n${format(startDate, 'yyyy.MM.dd')} ${startTime}:00 ~ ${endTime}:00`;
    }
    return "";
  };

  return (
    <RightSection>
      <h3>날짜 선택</h3>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={new Date()}
        maxDate={addYears(new Date(), 1)}
        inline
      />

      <h3 style={{ marginTop: 24 }}>시간 선택</h3>
      <TimeLabelRow>
        {[...Array(13)].map((_, i) => (
          <TimeLabel key={i}>{10 + i}:00</TimeLabel>
        ))}
      </TimeLabelRow>
      <TimeScrollBox>
        {[...Array(12)].map((_, i) => {
          const hour = 10 + i;
          const active = startTime !== null && endTime !== null && hour >= startTime && hour < endTime;
          return (
            <TimeBlock
              key={hour}
              active={active}
              onClick={() => handleTimeClick(hour)}
            />
          );
        })}
      </TimeScrollBox>

      <WeekdayInfo>평일: 1시간 3만원{"\n"}주말: 1시간 4만원</WeekdayInfo>
      <TimeRange>{renderReservationTime()}</TimeRange>

      <h3>예약 인원</h3>
      <CounterWrapper>
        <CounterButton onClick={() => setCount((c) => Math.max(1, c - 1))}>-</CounterButton>
        <div>{count}</div>
        <CounterButton onClick={() => setCount((c) => c + 1)}>+</CounterButton>
      </CounterWrapper>

      <div>공간 대여료</div>
      <h2 style={{ color: "#ff6f1f" }}>₩ {(count * 30000).toLocaleString()}</h2>
      <ReserveButton>예약하기</ReserveButton>
    </RightSection>
  );
};

export default ReservationSidebar;