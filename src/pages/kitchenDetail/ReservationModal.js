import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { format } from 'date-fns';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 24px;
  top: 24px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    margin-bottom: 24px;
  }
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
`;

const Value = styled.div`
  font-size: 16px;
  color: #333;
  text-align: right;
`;

const ConfirmButton = styled.button`
  background-color: #ffbc39;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
`;

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  kitchenName,
  reservationDate,
  startTime,
  endTime,
  guestCount,
  totalPrice,
  selectedIds,
  userName
}) => {
  // 모달이 열리면 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 요일 구하기
  const getDayOfWeek = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // 예약 확인(결제) 버튼 클릭 시 availableId 배열 콘솔 출력
  const handleConfirm = () => {
    console.log('예약할 availableIds:', selectedIds);
    onClose();
  };

  // Portal을 사용하여 모달을 root 레벨에서 렌더링
  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>예약 확인</Title>
        
        <InfoItem>
          <Label>주방명</Label>
          <Value>{kitchenName}</Value>
        </InfoItem>
        
        <InfoItem>
          <Label>예약자명</Label>
          <Value>{userName}</Value>
        </InfoItem>
        
        <InfoItem>
          <Label>예약일자</Label>
          <Value>{format(reservationDate, 'yyyy.MM.dd')}({getDayOfWeek(reservationDate)})</Value>
        </InfoItem>
        
        <InfoItem>
          <Label>예약시간</Label>
          <Value>{startTime}:00 ~ {endTime}:00</Value>
        </InfoItem>
        
        <InfoItem>
          <Label>예약인원</Label>
          <Value>{guestCount}명</Value>
        </InfoItem>
        
        <InfoItem>
          <Label>대여료</Label>
          <Value>₩{totalPrice.toLocaleString()}</Value>
        </InfoItem>

        <ConfirmButton onClick={handleConfirm}>
          결제하기
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default ReservationModal; 