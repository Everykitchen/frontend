import React, { useEffect, useState } from 'react';
import ChattingRoomComponent from '../../components/ChattingRoomComponent';
import HostSideBar from '../../components/HostSideBar';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ChatWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  height: 80vh;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// 임시 메시지 데이터 생성 함수
const generateMockMessages = () => {
  return [
    {
      messageId: 1,
      chat: "안녕하세요, 예약 가능한 시간이 궁금합니다.",
      role: "USER",
      sentAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      messageId: 2,
      chat: "네, 안녕하세요! 어떤 날짜를 고려하고 계신가요?",
      role: "HOST",
      sentAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
      messageId: 3,
      chat: "다음 주 토요일 오후에 가능할까요?",
      role: "USER",
      sentAt: new Date(Date.now() - 3400000).toISOString()
    },
    {
      messageId: 4,
      chat: "네, 다음 주 토요일 오후 2시부터 6시까지 가능합니다. 몇 분이 이용하실 예정인가요?",
      role: "HOST",
      sentAt: new Date(Date.now() - 3300000).toISOString()
    }
  ];
};

const HostChattingRoom = () => {
    const location = useLocation();
    const mockMessages = generateMockMessages();
    const mockChatInfo = {
        kitchenName: location.state?.kitchenName || '주방 이름',
        kitchenLocation: location.state?.kitchenLocation || '주방 위치',
        userName: location.state?.userName || '홍길동'
    };

    return (
        <Container>
            <HostSideBar />
            <ChatContainer>
                <ChatWrapper>
                    <ChattingRoomComponent
                        isHost={true}
                        chatInfo={mockChatInfo}
                        messages={mockMessages}
                    />
                </ChatWrapper>
            </ChatContainer>
        </Container>
    );
};

export default HostChattingRoom; 