import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Container = styled.div`
    display: flex;
    flex-direction: column;
  height: 100%;
  background-color: #f9f9f9;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
`;

const BackButton = styled.button`
    background: none;
    border: none;
  font-size: 16px;
  color: #666;
    cursor: pointer;
  margin-right: 16px;
  
  &:hover {
    color: #333;
  }
`;

const KitchenName = styled.h1`
    font-size: 18px;
  font-weight: 600;
    margin: 0;
`;

const ChatContainer = styled.div`
    flex: 1;
  padding: 24px;
    overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : props.isSystem ? 'center' : 'flex-start'};
  margin-bottom: 16px;
  max-width: ${props => props.isSystem ? '100%' : '80%'};
  align-self: ${props => props.isOwn ? 'flex-end' : props.isSystem ? 'center' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background-color: ${props => {
    if (props.isSystem) return '#f0f0f0';
    return props.isOwn ? '#FFBC39' : 'white';
  }};
  color: ${props => {
    if (props.isSystem) return '#666';
    return props.isOwn ? 'white' : '#333';
  }};
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: ${props => props.isSystem ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
  margin-bottom: 4px;
  word-break: break-word;
  font-style: ${props => props.isSystem ? 'italic' : 'normal'};
  font-size: ${props => props.isSystem ? '13px' : '14px'};
  opacity: ${props => props.isSystem ? 0.8 : 1};
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
  padding: 16px;
  background-color: white;
  border-top: 1px solid #eee;
  flex-shrink: 0;
`;

const Input = styled.input`
    flex: 1;
    padding: 12px 16px;
  border: 1px solid #ddd;
    border-radius: 24px;
    font-size: 14px;
  outline: none;
  
    &:focus {
        border-color: #FFBC39;
    }
`;

const SendButton = styled.button`
  background-color: #FFBC39;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  margin-left: 12px;
  cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  
  &:hover {
    background-color: #FFB020;
  }
  
    &:disabled {
    background-color: #ddd;
        cursor: not-allowed;
    }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  
  p {
    margin-top: 16px;
    font-size: 16px;
  }
`;

const ErrorBanner = styled.div`
  background-color: #ff8686;
  color: white;
  padding: 12px 16px;
  text-align: center;
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const DebugButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DebugButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ChattingRoomComponent = ({ isHost, chatInfo, messages: initialMessages }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);

  // location.state에서 채팅방 정보 설정
  useEffect(() => {
    if (location.state) {
      console.log('ChatRoom location state:', location.state);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 임시 메시지 추가
    const newMessage = {
      messageId: Date.now(),
      chat: inputMessage,
      role: isHost ? 'HOST' : 'USER',
      sentAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setTimeout(() => scrollToBottom(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleBack = () => {
    navigate(isHost ? '/host-mypage/chats' : '/user-mypage/chats');
  };

  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          &lt; 뒤로
        </BackButton>
        <KitchenName>
          {isHost 
            ? `${chatInfo?.userName || '고객'}님과의 대화` 
            : chatInfo?.kitchenName || '채팅'}
        </KitchenName>
      </Header>

      <ChatContainer ref={chatContainerRef}>
        {messages.length === 0 ? (
          <EmptyState>
            <p>아직 채팅 내역이 없습니다. 첫 메시지를 보내보세요!</p>
          </EmptyState>
        ) : (
          messages.map((message, index) => {
            const isOwn = isHost ? message.role === 'HOST' : message.role === 'USER';
            return (
              <MessageGroup key={message.messageId || index} isOwn={isOwn} isSystem={message.role === 'SYSTEM'}>
                <MessageBubble isOwn={isOwn} isSystem={message.role === 'SYSTEM'}>
                  {message.chat}
                </MessageBubble>
                <MessageTime>{formatMessageDate(message.sentAt)}</MessageTime>
              </MessageGroup>
            );
          })
        )}
      </ChatContainer>

      <InputContainer>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          →
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChattingRoomComponent; 