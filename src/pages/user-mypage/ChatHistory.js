import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UserSideBar from '../../components/UserSideBar';
import HostChatCard from '../../components/HostChatCard';

// Temporary data
const tempChats = [
    {
        id: 1,
        kitchenName: "방배동 공유주방",
        kitchenLocation: "서울시 서초구 방배동",
        userName: "호스트님",
        status: "예약중",
        lastMessage: "네, 알겠습니다!",
        lastMessageTime: "2024-03-14T15:30:00",
        lastReservationDate: "2024-03-20T10:00:00",
        people: 4
    },
    {
        id: 2,
        kitchenName: "강남 쿠킹 스튜디오",
        kitchenLocation: "서울시 강남구 역삼동",
        userName: "김호스트",
        status: "미예약",
        lastMessage: "주방 시설이 어떻게 되나요?",
        lastMessageTime: "2024-03-14T14:20:00",
        lastReservationDate: "2024-03-19T14:00:00",
        people: 2
    }
];

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

const ChatHistory = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState('전체');
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        // 실제 API 연동 시에는 이 부분을 API 호출로 대체
        setChats(tempChats);
    }, []);

    useEffect(() => {
        if (activeStatus === '전체') {
            setFilteredChats(chats);
        } else {
            setFilteredChats(chats.filter(chat => chat.status === activeStatus));
        }
    }, [activeStatus, chats]);

    const getStatusCount = (status) => {
        if (status === '전체') return chats.length;
        return chats.filter(chat => chat.status === status).length;
    };

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
                {filteredChats.map(chat => (
                    <HostChatCard
                        key={chat.id}
                        chat={chat}
                        onClick={() => navigate(`/mypage/chats/${chat.id}`)}
                    />
                ))}
            </MainContent>
        </Container>
    );
};

export default ChatHistory; 