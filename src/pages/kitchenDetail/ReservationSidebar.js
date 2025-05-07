import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addYears, format } from "date-fns";
import ko from "date-fns/locale/ko";
import ReservationModal from "./ReservationModal";

const RightSection = styled.div`
  flex: 1;
  position: sticky;
  top: 60px;
  border: 1px solid #ffbc39;
  border-radius: 10px;
  padding: 16px 24px;
  height: calc(100vh - 150px);
  min-width: 300px;
  max-width: 330px;
  background-color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;

const ScrollableContent = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 28px;
  margin-right: -20px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  text-align: center;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker {
    font-family: inherit;
    border: none;
    width: 100%;
    font-size: 0.8rem;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    background-color: #fff;
    border-bottom: none;
    padding-top: 8px;
  }

  .react-datepicker__current-month {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .react-datepicker__day-names {
    margin-top: 4px;
  }

  .react-datepicker__day-name {
    color: #666;
    font-size: 12px;
    width: 28px;
    line-height: 28px;
  }

  .react-datepicker__day {
    width: 28px;
    height: 28px;
    line-height: 28px;
    margin: 2px;
    font-size: 12px;
    color: #333;
    
    &:hover {
      background-color: #fff5e6;
      border-radius: 50%;
    }
  }

  .react-datepicker__day--selected {
    background-color: #ffbc39;
    color: white;
    border-radius: 50%;
    
    &:hover {
      background-color: #ffbc39;
    }
  }

  .react-datepicker__day--disabled {
    color: #ccc;
    cursor: default;
  }
`;

const TimeContainer = styled.div`
  margin-top: 32px;
  position: relative;
  width: 100%;
`;

const TimeScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  -ms-overflow-style: auto;
  width: 100%;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
`;

const TimeBlockContainer = styled.div`
  position: relative;
  width: 40px;
  flex-shrink: 0;
`;

const TimeLabel = styled.div`
  position: absolute;
  top: -20px;
  right: -10px;
  font-size: 12px;
  color: #666;
`;

const FirstTimeLabel = styled.div`
  position: absolute;
  top: -20px;
  right: -10px;
  font-size: 12px;
  color: #666;
`;

const TimeBlock = styled.div`
  width: 40px;
  height: 36px;
  background-color: ${(props) => {
    if (props.disabled || props.unavailable) return "#b8b8b8";
    if (props.selected) return "#ffbc39";
    return "#f6f6f6";
  }};
  border: 1px solid #ccc;
  cursor: ${(props) => (props.disabled || props.unavailable ? "default" : "pointer")};
  position: relative;

  &:hover {
    background-color: ${(props) => {
      if (props.disabled || props.unavailable) return null;
      if (props.selected) return "#ffbc39";
      return "#ffe4b3";
    }};
  }
`;

const TimeRange = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin: 24px 0;
  white-space: pre-line;
`;

const PriceInfo = styled.div`
  margin-top: 24px;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const PriceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`;

const ColorIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 4px;
  background-color: ${(props) => props.color};
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
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReserveButton = styled.button`
  background-color: #ffbc39;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

// 임시 예약 데이터 생성 함수
const generateMockReservations = (date) => {
  // 오늘부터 7일 사이의 날짜인지 확인
  const today = new Date();
  const selectedDate = new Date(date);
  const diffTime = Math.abs(selectedDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 7) {
    return { reservations: [] };
  }

  // 날짜별로 다른 예약 패턴 생성
  const dayOfWeek = selectedDate.getDay();
  const reservations = [];

  // 주말(토,일)에는 더 많은 예약이 있다고 가정
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // 주말 예약 패턴
    reservations.push(
      { start_time: "14:00", end_time: "16:00" },
      { start_time: "19:00", end_time: "21:00" }
    );
  } else {
    // 평일 예약 패턴
    reservations.push(
      { start_time: "12:00", end_time: "13:00" },
      { start_time: "18:00", end_time: "20:00" }
    );
  }

  return { reservations };
};

const ReservationSidebar = ({ 
  startDate, 
  setStartDate, 
  count, 
  setCount, 
  kitchenData 
}) => {
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (startDate) {
      // TODO: 실제 API 연동 시 사용할 코드
      /*
      const fetchUnavailableTimes = async () => {
        try {
          const formattedDate = format(startDate, 'yyyy-MM-dd');
          const response = await fetch(`/api/common/kitchen/${kitchenData.id}/${formattedDate}`);
          const data = await response.json();
          
          // 예약된 시간대를 unavailableTimes로 변환
          const unavailableTimes = data.reservations.map(reservation => {
            const startHour = parseInt(reservation.start_time.split(':')[0]);
            const endHour = parseInt(reservation.end_time.split(':')[0]);
            return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
          }).flat();
          
          setUnavailableTimes(unavailableTimes);
          setIsDateSelected(true);
        } catch (error) {
          console.error('예약 가능 시간 조회 실패:', error);
          setUnavailableTimes([]);
          setIsDateSelected(false);
        }
      };
      
      fetchUnavailableTimes();
      */

      // 임시 데이터 사용
      const mockData = generateMockReservations(startDate);
      const unavailableTimes = mockData.reservations.map(reservation => {
        const startHour = parseInt(reservation.start_time.split(':')[0]);
        const endHour = parseInt(reservation.end_time.split(':')[0]);
        return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
      }).flat();
      
      setUnavailableTimes(unavailableTimes);
      setIsDateSelected(true);
    } else {
      setUnavailableTimes([]);
      setIsDateSelected(false);
    }
  }, [startDate]);

  const resetSelection = () => {
    setStartTime(null);
    setEndTime(null);
    setErrorMessage("");
    setLastClickedTime(null);
  };

  const handleTimeBlockClick = (hour) => {
    if (!isDateSelected || unavailableTimes.includes(hour)) return;

    // 첫 번째 클릭 또는 초기화 상태
    if (startTime === null) {
      setStartTime(hour);
      setEndTime(hour + 1);
      setLastClickedTime(hour);
      setErrorMessage("");
      return;
    }

    // 이미 선택된 시작 시간을 다시 클릭하면 초기화
    if (hour === startTime) {
      resetSelection();
      return;
    }

    // 시작 시간보다 이전 시간을 클릭하면 초기화
    if (hour < startTime) {
      resetSelection();
      return;
    }

    // 두 번째 클릭한 시간을 다시 클릭하면 초기화
    if (hour === lastClickedTime && errorMessage) {
      resetSelection();
      return;
    }

    // 범위 선택 시 예약 불가능한 시간이 있는지 확인
    for (let i = startTime; i <= hour; i++) {
      if (unavailableTimes.includes(i)) {
        setErrorMessage("예약 불가능합니다.");
        setLastClickedTime(hour);
        return;
      }
    }

    // 정상적인 범위 선택
    setEndTime(hour + 1);
    setErrorMessage("");
    setLastClickedTime(hour);
  };

  const getDayPrice = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const priceInfo = kitchenData.defaultPrice.find(p => p.week === dayName);
    return priceInfo ? priceInfo.price : 0;
  };

  const renderReservationTime = () => {
    if (startTime !== null && endTime !== null) {
      return `예약 일시\n${format(startDate, 'yyyy년 MM월 dd일')} ${startTime}:00 ~ ${endTime}:00`;
    }
    return "";
  };

  const calculateTotalPrice = () => {
    if (startTime === null || endTime === null) return 0;
    const hours = endTime - startTime;
    const pricePerHour = getDayPrice(startDate);
    return hours * pricePerHour * count;
  };

  const handleReserveClick = () => {
    setIsModalOpen(true);
  };

  return (
    <RightSection>
      <ScrollableContent>
        <SectionTitle>예약 날짜 선택</SectionTitle>
        <DatePickerWrapper>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setStartTime(null);
              setEndTime(null);
              setErrorMessage("");
            }}
            minDate={new Date()}
            maxDate={addYears(new Date(), 1)}
            inline
            locale={ko}
            dateFormat="yyyy년 MM월"
            placeholderText="날짜를 선택해주세요"
          />
        </DatePickerWrapper>

        <TimeContainer>
          <SectionTitle>예약 시간 선택</SectionTitle>
          <TimeScrollContainer>
            <div style={{ display: 'flex', paddingTop: '20px' }}>
              <div style={{ width: '15px', position: 'relative' }}>
                <FirstTimeLabel>10</FirstTimeLabel>
              </div>
              {[...Array(13)].map((_, i) => {
                const hour = 10 + i;
                const isSelected = startTime !== null && endTime !== null && hour >= startTime && hour < endTime;
                const isUnavailable = unavailableTimes.includes(hour);
                const isDisabled = !isDateSelected || hour < 10 || hour > 22;

                return (
                  <TimeBlockContainer key={hour}>
                    {i < 12 && (
                      <>
                        <TimeLabel>{hour + 1}</TimeLabel>
                        <TimeBlock
                          selected={isSelected}
                          unavailable={isUnavailable}
                          disabled={isDisabled}
                          onClick={() => handleTimeBlockClick(hour)}
                        />
                      </>
                    )}
                  </TimeBlockContainer>
                );
              })}
              <div style={{ width: '20px' }} />
            </div>
          </TimeScrollContainer>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </TimeContainer>

        <PriceInfo>
          <PriceItem>
            <ColorIndicator color="#f6f6f6" />
            <span>가능</span>
          </PriceItem>
          <PriceItem>
            <ColorIndicator color="#b8b8b8" />
            <span>예약불가</span>
          </PriceItem>
          <PriceItem>
            <ColorIndicator color="#ffbc39" />
            <span>선택</span>
          </PriceItem>
        </PriceInfo>

        <TimeRange>{renderReservationTime()}</TimeRange>

        <div style={{ marginTop: 32 }}>
          <SectionTitle>예약 인원</SectionTitle>
          <CounterWrapper>
            <CounterButton 
              onClick={() => setCount((c) => Math.max(kitchenData.baseClientNumber, c - 1))}
              disabled={count <= kitchenData.baseClientNumber}
            >
              -
            </CounterButton>
            <div style={{ fontSize: '12px' }}>{count}</div>
            <CounterButton 
              onClick={() => setCount((c) => Math.min(kitchenData.maxClientNumber, c + 1))}
              disabled={count >= kitchenData.maxClientNumber}
            >
              +
            </CounterButton>
          </CounterWrapper>
        </div>

        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, color: "#666" }}>공간 대여료</div>
          <h2 style={{ color: "#ffbc39", margin: "4px 0", fontSize: "20px", fontWeight: "700" }}>
            ₩ {calculateTotalPrice().toLocaleString()}
          </h2>
          <div style={{ fontSize: 10, color: "#666" }}>
            {startDate && startTime !== null && endTime !== null && 
              `(${getDayPrice(startDate).toLocaleString()}원/시간 × ${endTime - startTime}시간 × ${count}명)`
            }
          </div>
        </div>

        <ReserveButton 
          disabled={!startTime || !endTime}
          onClick={handleReserveClick}
        >
          예약하기
        </ReserveButton>
      </ScrollableContent>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        kitchenName={kitchenData.kitchenName}
        reservationDate={startDate}
        startTime={startTime}
        endTime={endTime}
        guestCount={count}
        totalPrice={calculateTotalPrice()}
      />
    </RightSection>
  );
};

export default ReservationSidebar;