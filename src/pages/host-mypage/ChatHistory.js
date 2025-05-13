import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import HostSideBar from '../../components/HostSideBar';
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

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const KitchenSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 200px;
  &:focus {
    outline: none;
    border-color: #FFBC39;
  }
`;

const ChatHistory = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState('전체');
  const [selectedKitchen, setSelectedKitchen] = useState('all');
  const [kitchenList, setKitchenList] = useState([]);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const kitchenId = selectedKitchen !== 'all' ? parseInt(selectedKitchen) : undefined;
        const url = '/api/host/chat-history' + (kitchenId ? `?kitchenId=${kitchenId}` : '');
        const response = await api.get(url);
        
        setKitchenList(response.data.kitchenList || []);
        setChats(response.data.hostChattingRooms || []);
      } catch (err) {
        console.error('채팅 내역을 불러오는 데 실패했습니다:', err);
        setError('채팅 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [selectedKitchen]);

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
    navigate(`/host-mypage/chats/${chat.chattingRoomId}`, { 
      state: { 
        kitchenId: chat.kitchenId,
        chattingRoomId: chat.chattingRoomId 
      } 
    });
  };

  const handleKitchenChange = (e) => {
    setSelectedKitchen(e.target.value);
  };

  if (loading) return (
    <Container>
      <HostSideBar activeMenu="채팅 내역" />
      <MainContent>
        <Title>채팅 내역</Title>
        <div>로딩 중...</div>
      </MainContent>
    </Container>
  );

  if (error) return (
    <Container>
      <HostSideBar activeMenu="채팅 내역" />
      <MainContent>
        <Title>채팅 내역</Title>
        <div style={{ color: 'red' }}>{error}</div>
      </MainContent>
    </Container>
  );

  return (
    <Container>
      <HostSideBar activeMenu="채팅 내역" />
      <MainContent>
        <Title>채팅 내역</Title>
        
        <FilterRow>
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
          
          <KitchenSelect value={selectedKitchen} onChange={handleKitchenChange}>
            <option value="all">모든 주방</option>
            {kitchenList.map(kitchen => (
              <option key={kitchen.kitchenId} value={kitchen.kitchenId}>
                {kitchen.kitchenName}
              </option>
            ))}
          </KitchenSelect>
        </FilterRow>
        
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <HostChatCard
              key={chat.chattingRoomId}
              chat={{
                id: chat.chattingRoomId,
                kitchenName: chat.kitchenName,
                kitchenLocation: chat.kitchenLocation,
                userName: chat.userName,
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