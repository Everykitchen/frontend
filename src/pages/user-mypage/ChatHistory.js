import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UserSideBar from '../../components/UserSideBar';
import HostChatCard from '../../components/HostChatCard';
import api from '../../api/axiosInstance';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: #FAFAFA;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 32px;
    margin-top: 60px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
`;

const StatusTabs = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
`;

const Tab = styled.button`
    padding: 8px 16px;
    border: none;
    background: ${props => props.active ? '#FFBC39' : '#F3F3F3'};
    color: ${props => props.active ? 'white' : '#666'};
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;

    &:hover {
        background: ${props => props.active ? '#FFBC39' : '#EAEAEA'};
    }
`;

const NoChats = styled.div`
    padding: 32px 0;
    text-align: center;
    color: #666;
    font-size: 16px;
`;

const ChatHistory = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState('전체');
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await api.get('/api/user/chat-history');
                setChats(response.data);
            } catch (err) {
                console.error('채팅 내역을 불러오는 데 실패했습니다:', err);
                setError('채팅 내역을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchChatHistory();
    }, []);

    useEffect(() => {
        if (activeStatus === '전체') {
            setFilteredChats(chats);
        } else {
            const statusMap = {
                '미예약': ['PENDING', 'CANCELED'],
                '예약중': ['RESERVED', 'PENDING_PAYMENT', 'COMPLETED_PAYMENT']
            };
            
            setFilteredChats(chats.filter(chat => statusMap[activeStatus]?.includes(chat.reservationStatus)));
        }
    }, [activeStatus, chats]);

    const getStatusCount = (status) => {
        if (status === '전체') return chats.length;
        
        const statusMap = {
            '미예약': ['PENDING', 'CANCELED'],
            '예약중': ['RESERVED', 'PENDING_PAYMENT', 'COMPLETED_PAYMENT']
        };
        
        return chats.filter(chat => statusMap[status]?.includes(chat.reservationStatus)).length;
    };

    const handleChatClick = (chat) => {
        navigate(`/mypage/chats/${chat.chattingRoomId}`, { 
            state: { 
                kitchenId: chat.kitchenId,
                chattingRoomId: chat.chattingRoomId 
            } 
        });
    };

    if (loading) return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <MainContent>
                <Title>채팅 내역</Title>
                <div>로딩 중...</div>
            </MainContent>
        </Container>
    );

    if (error) return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <MainContent>
                <Title>채팅 내역</Title>
                <div style={{ color: 'red' }}>{error}</div>
            </MainContent>
        </Container>
    );

    return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <MainContent>
                <Title>채팅 내역</Title>
                <StatusTabs>
                    {['전체', '미예약', '예약중'].map(status => (
                        <Tab
                            key={status}
                            active={activeStatus === status}
                            onClick={() => setActiveStatus(status)}
                        >
                            {status} ({getStatusCount(status)})
                        </Tab>
                    ))}
                </StatusTabs>
                
                {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                    <HostChatCard
                            key={chat.chattingRoomId}
                            chat={{
                                id: chat.chattingRoomId,
                                kitchenName: chat.kitchenName,
                                kitchenLocation: chat.kitchenLocation,
                                userName: "호스트님",
                                status: chat.reservationStatus === "RESERVED" ? "예약중" : "미예약",
                                lastMessage: chat.lastMessage,
                                lastMessageTime: chat.lastMessageTime,
                                lastReservationDate: chat.lastReservationDate,
                                people: chat.lastReservationCount,
                                kitchenImage: chat.kitchenImage
                            }}
                            onClick={() => handleChatClick(chat)}
                    />
                    ))
                ) : (
                    <NoChats>채팅 내역이 없습니다.</NoChats>
                )}
            </MainContent>
        </Container>
    );
};

export default ChatHistory; 