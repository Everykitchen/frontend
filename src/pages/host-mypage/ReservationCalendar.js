import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import { addMonths, isBefore, startOfDay, isSameDay, format } from 'date-fns';
import HostSideBar from '../../components/HostSideBar';
import axios from '../../api/axiosInstance';
import dotImage from '../../assets/icons/dot.png';
import kitchenImage from "../../assets/jpg/kitchen1.jpg";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 40px;
    padding-left: 100px;
    margin-top: 30px;
    flex: 1;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
`;

const BackButton = styled.button`
    background-color: #f0f0f0;
    color: #333;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        background-color: #e0e0e0;
    }
`;

const CalendarContainer = styled.div`
    display: flex;
    gap: 40px;
`;

const CalendarWrapper = styled.div`
    width: 430px;
    background: white;
    border-radius: 10px;
    border: 1px solid #ffbc39;
    padding: 15px;
`;

const ReservationListWrapper = styled.div`
    flex: 1;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 20px;
`;

const DateTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
`;

const DateHighlight = styled.span`
    color: #ff6f1f;
`;

const NoReservations = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
    font-size: 16px;
`;

const ReservationCard = styled.div`
    display: flex;
    padding: 16px;
    border-radius: 8px;
    background: #f9f9f9;
    margin-bottom: 12px;
    cursor: pointer;
    height: auto;
    
    &:hover {
        background: #f0f0f0;
    }
`;

const KitchenImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 16px;
`;

const ReservationContent = styled.div`
    flex: 1;
    position: relative;
`;

const KitchenName = styled.h4`
    margin-top: 4px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
`;

const ReservationDetails = styled.div`
    margin-top: 12px;
    font-size: 16px;
    color: #333;
    font-weight: 500;
`;

const StatusBadge = styled.div`
    display: inline-block;
    padding: 4px 8px;
    background-color: ${props => props.status === "진행중" ? "#FFBC39" : "#9B9B9B"};
    color: white;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    top: 0;
    right: 0;
`;

// CalendarBox 스타일 (기존 컴포넌트 대신 직접 스타일링)
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
    width: 46px;
    line-height: 46px;
    margin: 0 4px;
  }
  .react-datepicker__week {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .react-datepicker__day {
    height: 46px;
    width: 46px;
    font-size: 16px;
    border-radius: 50%;
    transition: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 4px;
    border: none;
    background: none;
    position: relative;
  }
  .react-datepicker__day--today {
    background: #fff5e6;
    color: #ffbc39;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: #ffbc39 !important;
    color: #fff !important;
    border-radius: 50%;
  }
  .react-datepicker__day--selected:hover,
  .react-datepicker__day--keyboard-selected:hover {
    background: #ffbc39 !important;
    color: #fff !important;
  }
  .react-datepicker__day:hover {
    background: #f5f5f5;
    border-radius: 50%;
    color: #333;
    box-shadow: none;
    border: none;
  }
  .react-datepicker__day--disabled {
    color: #aaa !important;
    opacity: 0.5;
    pointer-events: auto;
  }
  .calendarbox-sunday {
    color: #e74c3c !important;
  }
  
  /* 예약 있는 날짜 표시 */
  .has-reservation {
    background-color: #FFF0D9;
  }
  
  .has-reservation::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-image: url(${dotImage});
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  /* 과거 날짜 표시 */
  .past-day {
    opacity: 0.4;
  }
`;

const ReservationCalendar = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservationDates, setReservationDates] = useState([]);
    
    // API에서 예약 정보 가져오기
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/host/reservation?page=0&size=100');
                setReservations(res.data.content || []);
                
                // 예약이 있는 날짜들 추출
                const dates = (res.data.content || []).map(reservation => 
                    new Date(reservation.date)
                );
                setReservationDates(dates);
            } catch (error) {
                console.error('예약 내역을 불러오지 못했습니다:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReservations();
    }, []);
    
    // 선택한 날짜의 예약 내역 필터링
    const selectedDateReservations = reservations.filter(reservation => 
        isSameDay(new Date(reservation.date), selectedDate)
    );
    
    // 날짜에 예약이 있는지 확인하는 함수
    const hasReservation = (date) => {
        return reservationDates.some(reservationDate => 
            isSameDay(reservationDate, date)
        );
    };
    
    // 상태에 따른 라벨 반환
    const getStatusLabel = (status) => {
        if (status === "RESERVED" || status === "PENDING_PAYMENT") return "진행중";
        if (status === "COMPLETED_PAYMENT") return "완료";
        return status;
    };
    
    // 리액트 데이트피커 커스텀 헤더
    const renderCustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', fontSize: 24, color: prevMonthButtonDisabled ? '#eee' : '#ffbc39', cursor: prevMonthButtonDisabled ? 'default' : 'pointer' }}>&lt;</button>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{year}.{month}</span>
                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', fontSize: 24, color: nextMonthButtonDisabled ? '#eee' : '#ffbc39', cursor: nextMonthButtonDisabled ? 'default' : 'pointer' }}>&gt;</button>
            </div>
        );
    };
    
    // 날짜 클래스 지정 (일요일, 예약 있는 날짜, 과거 날짜)
    const dayClassName = (date) => {
        let className = '';
        
        // 일요일 확인
        if (date.getDay() === 0) {
            className += 'calendarbox-sunday ';
        }
        
        // 예약 있는 날짜 확인
        if (hasReservation(date)) {
            className += 'has-reservation ';
        }
        
        // 과거 날짜 확인
        if (isBefore(startOfDay(date), startOfDay(new Date()))) {
            className += 'past-day';
        }
        
        return className || undefined;
    };
    
    // 날짜 비활성화 함수 (과거 날짜)
    const isDateDisabled = (date) => {
        // 과거 날짜도 클릭 가능하도록 함
        return false;
    };

    // 이미지 에러 핸들러: 로드 실패 시 기본 이미지로 대체
    const handleImgError = (e) => {
        e.target.src = kitchenImage;
    };

    return (
        <Container>
            <HostSideBar />
            <ContentWrapper>
                <PageHeader>
                    <Title>예약 달력</Title>
                    <BackButton onClick={() => navigate('/host-mypage/reservations')}>
                        목록으로 돌아가기
                    </BackButton>
                </PageHeader>
                
                <CalendarContainer>
                    <CalendarWrapper>
                        <StyledDatePickerWrapper>
                            <DatePicker
                                selected={selectedDate}
                                onChange={setSelectedDate}
                                inline
                                locale={ko}
                                renderCustomHeader={renderCustomHeader}
                                dateFormat="yyyy.M"
                                minDate={addMonths(new Date(), -3)}
                                maxDate={addMonths(new Date(), 6)}
                                dayClassName={dayClassName}
                            />
                        </StyledDatePickerWrapper>
                    </CalendarWrapper>
                    
                    <ReservationListWrapper>
                        <DateTitle>
                            <DateHighlight>{format(selectedDate, 'yyyy년 MM월 dd일')}</DateHighlight> 예약 내역
                        </DateTitle>
                        
                        {loading ? (
                            <div>로딩 중...</div>
                        ) : selectedDateReservations.length > 0 ? (
                            selectedDateReservations.map(reservation => (
                                <ReservationCard 
                                    key={reservation.reservationId}
                                    onClick={() => navigate(`/host-mypage/reservations/${reservation.reservationId}`)}
                                >
                                    <KitchenImage 
                                        src={reservation.imageUrl || kitchenImage}
                                        alt="주방 이미지"
                                        onError={handleImgError}
                                    />
                                    <ReservationContent>
                                        <StatusBadge status={getStatusLabel(reservation.status)}>
                                            {getStatusLabel(reservation.status)}
                                        </StatusBadge>
                                        <KitchenName>{reservation.kitchenName}</KitchenName>
                                        <ReservationDetails>
                                            {reservation.startTime} ~ {reservation.endTime} ({reservation.clientNumber}인)
                                        </ReservationDetails>
                                        <ReservationDetails>
                                            {reservation.clientName}
                                        </ReservationDetails>
                                    </ReservationContent>
                                </ReservationCard>
                            ))
                        ) : (
                            <NoReservations>
                                선택한 날짜에 예약 내역이 없습니다.
                            </NoReservations>
                        )}
                    </ReservationListWrapper>
                </CalendarContainer>
            </ContentWrapper>
        </Container>
    );
};

export default ReservationCalendar; 