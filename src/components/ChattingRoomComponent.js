import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import ChatMessage from './ChatMessage';
import UserSideBar from './UserSideBar';
import HostSideBar from './HostSideBar';

const PageContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background: #FAFAFA;
`;

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    margin: 80px 40px 20px 40px;
    background: #FFFFFF;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 800px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: #FFBC39;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1000;
    border-radius: 8px 8px 0 0;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0 16px 0 0;
    display: flex;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: 500;
    margin: 0;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    margin-bottom: 70px;
`;

const InputContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background: white;
    border-top: 1px solid #E0E0E0;
    border-radius: 0 0 8px 8px;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #E0E0E0;
    border-radius: 24px;
    margin-right: 12px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #FFBC39;
    }
`;

const SendButton = styled.button`
    background: #FFBC39;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:disabled {
        background: #E0E0E0;
        cursor: not-allowed;
    }
`;

const ChattingRoomComponent = ({ isHost }) => {
    const { id: chattingRoomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomInfo, setRoomInfo] = useState({ name: '' });
    const chatContainerRef = useRef(null);
    const socketRef = useRef(null);

    // 임시 채팅 데이터
    const tempMessages = [
        {
            messageId: 1,
            chat: "안녕하세요, 주방 예약 문의드립니다.",
            sentAt: "2024-03-14T10:00:00",
            role: "user"
        },
        {
            messageId: 2,
            chat: "네, 안녕하세요. 어떤 문의사항이 있으신가요?",
            sentAt: "2024-03-14T10:01:00",
            role: "host"
        },
        {
            messageId: 3,
            chat: "3월 20일 오후 2시에 4명이 이용하고 싶은데 가능할까요?",
            sentAt: "2024-03-14T10:02:00",
            role: "user"
        },
        {
            messageId: 4,
            chat: "네, 가능합니다. 예약 진행해드릴까요?",
            sentAt: "2024-03-14T10:03:00",
            role: "host"
        }
    ];

    // 임시 주방 정보
    const tempRoomInfo = {
        name: "방배동 공유주방",
        userName: "김호스트"
    };

    useEffect(() => {
        // 임시 데이터 설정
        setMessages(tempMessages);
        setRoomInfo(tempRoomInfo);

        // Socket.IO 연결 설정 (실제 구현 시 주석 해제)
        // socketRef.current = io(process.env.REACT_APP_API_URL, {
        //     path: '/ws/chat',
        //     query: { chattingRoomId }
        // });

        // 채팅 내역 불러오기 (실제 구현 시 주석 해제)
        // const fetchChatHistory = async () => {
        //     try {
        //         const response = await axios.get(
        //             `/api/common/kitchen/${chattingRoomId}/chat?chattingRoomId=${chattingRoomId}`
        //         );
        //         setMessages(response.data.chattingHistory);
        //         setRoomInfo({ name: response.data.kitchenName });
        //     } catch (error) {
        //         console.error('Failed to fetch chat history:', error);
        //     }
        // };
        // fetchChatHistory();

        // 새 메시지 수신 이벤트 리스너 (실제 구현 시 주석 해제)
        // socketRef.current.on('chat_message', (message) => {
        //     setMessages(prev => [...prev, message]);
        // });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [chattingRoomId]);

    useEffect(() => {
        // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        // 임시 메시지 추가
        const newMsg = {
            messageId: messages.length + 1,
            chat: newMessage,
            sentAt: new Date().toISOString(),
            role: isHost ? 'host' : 'user'
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');

        // 실제 구현 시 주석 해제
        // try {
        //     await axios.post(
        //         `/api/common/kitchen/${chattingRoomId}/chat?chattingRoomId=${chattingRoomId}`,
        //         { message: newMessage }
        //     );

        //     socketRef.current.emit('chat_message', {
        //         chattingRoomId,
        //         message: newMessage,
        //         role: isHost ? 'host' : 'user'
        //     });

        //     setNewMessage('');
        // } catch (error) {
        //     console.error('Failed to send message:', error);
        // }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <PageContainer>
            {isHost ? (
                <HostSideBar activeMenu="chats" />
            ) : (
                <UserSideBar activeMenu="/mypage/chats" />
            )}
            <Container>
                <Header>
                    <BackButton onClick={() => window.history.back()}>←</BackButton>
                    <Title>{isHost ? roomInfo.userName : roomInfo.name}</Title>
                </Header>
                
                <ChatContainer ref={chatContainerRef}>
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.messageId}
                            message={message}
                            isHost={isHost}
                        />
                    ))}
                </ChatContainer>

                <InputContainer>
                    <ChatInput
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요"
                    />
                    <SendButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        →
                    </SendButton>
                </InputContainer>
            </Container>
        </PageContainer>
    );
};

export default ChattingRoomComponent; 