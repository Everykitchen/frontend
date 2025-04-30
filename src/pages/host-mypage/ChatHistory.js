import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import HostSideBar from '../../components/HostSideBar';
import HostChatCard from '../../components/HostChatCard';
import { useNavigate } from 'react-router-dom';

// Temporary data
const tempData = {
  kitchenList: [
    {
      kitchenId: 1,
      kitchenName: "화이팅 쿠킹스튜디오"
    },
    {
      kitchenId: 2,
      kitchenName: "이지 쿠킹스튜디오"
    },
    {
      kitchenId: 3,
      kitchenName: "문밥천국 1호점"
    }
  ],
  chatHistory: [
    {
      chattingRoomId: 1001,
      kitchenId: 3,
      kitchenName: "문밥천국 1호점",
      kitchenLocation: "서울 송파구",
      userName: "문진선",
      lastReservationDate: "2025-04-21",
      status: "미예약",
      lastMessage: "안녕하세요, 예약 관련 문의드립니다.",
      lastMessageTime: "2025-04-01T17:35:00",
    },
    {
      chattingRoomId: 1002,
      kitchenId: 3,
      kitchenName: "문밥천국 1호점",
      kitchenLocation: "서울 마포구",
      userName: "박민명",
      lastReservationDate: "2025-03-30",
      status: "예약중",
      lastMessage: "오늘은 안돼요",
      lastMessageTime: "2025-03-30T09:10:00",
    },
    {
      chattingRoomId: 1003,
      kitchenId: 1,
      kitchenName: "화이팅 쿠킹스튜디오",
      kitchenLocation: "서울 마포구",
      userName: "박민명",
      lastReservationDate: "2025-03-30",
      status: "예약중",
      lastMessage: "오늘은 안돼요",
      lastMessageTime: "2025-03-30T09:10:00",
    },
    {
      chattingRoomId: 1004,
      kitchenId: 2,
      kitchenName: "이지 쿠킹스튜디오",
      kitchenLocation: "서울 강남구",
      userName: "김지영",
      lastReservationDate: "2025-04-15",
      status: "미예약",
      lastMessage: "주방 시설이 어떤가요?",
      lastMessageTime: "2025-04-01T14:20:00",
    },
    {
      chattingRoomId: 1005,
      kitchenId: 1,
      kitchenName: "화이팅 쿠킹스튜디오",
      kitchenLocation: "서울 마포구",
      userName: "이수진",
      lastReservationDate: "2025-04-10",
      status: "예약중",
      lastMessage: "네, 알겠습니다.",
      lastMessageTime: "2025-04-01T16:45:00",
    },
    {
      chattingRoomId: 1006,
      kitchenId: 3,
      kitchenName: "문밥천국 1호점",
      kitchenLocation: "서울 송파구",
      userName: "최민호",
      lastReservationDate: "2025-04-05",
      status: "미예약",
      lastMessage: "예약 가능한 시간이 궁금합니다.",
      lastMessageTime: "2025-04-01T11:30:00",
    },
    {
      chattingRoomId: 1007,
      kitchenId: 2,
      kitchenName: "이지 쿠킹스튜디오",
      kitchenLocation: "서울 강남구",
      userName: "정다은",
      lastReservationDate: "2025-04-12",
      status: "예약중",
      lastMessage: "감사합니다!",
      lastMessageTime: "2025-04-01T15:15:00",
    },
    {
      chattingRoomId: 1008,
      kitchenId: 1,
      kitchenName: "화이팅 쿠킹스튜디오",
      kitchenLocation: "서울 마포구",
      userName: "강현우",
      lastReservationDate: "2025-04-08",
      status: "미예약",
      lastMessage: "주차 공간이 있나요?",
      lastMessageTime: "2025-04-01T13:40:00",
    }
  ]
};

const tabList = [
  { label: '전체', value: '전체' },
  { label: '미예약', value: '미예약' },
  { label: '예약중', value: '예약중' },
];

const ChatHistory = () => {
  const [selectedKitchen, setSelectedKitchen] = useState('전체주방');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [kitchenList, setKitchenList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('전체');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    // API 연동 코드 (현재는 주석 처리)
    /*
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('/api/host/chat-history');
        setChatData(response.data.chatHistory);
        setKitchenList(response.data.kitchenList);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
    */

    // 임시 데이터 사용
    setChatData(tempData.chatHistory);
    setKitchenList(tempData.kitchenList);
  }, []);

  // 탭 필터링
  const tabFilteredChats =
    activeTab === '전체'
      ? chatData
      : chatData.filter(chat => chat.status === activeTab);

  // 주방 필터링
  const filteredChats = tabFilteredChats.filter(chat =>
    selectedKitchen === '전체주방' || chat.kitchenName === selectedKitchen
  );

  // 카운트
  const getTabCount = (tab) =>
    tab === '전체'
      ? chatData.length
      : chatData.filter(chat => chat.status === tab).length;

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChats.slice(indexOfFirstItem, indexOfLastItem);

  const handleChatClick = (chattingRoomId) => {
    navigate(`/host-mypage/chats/${chattingRoomId}`);
  };

  // 탭 변경 시 페이지 1로
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 주방 변경 시 페이지 1로
  const handleKitchenChange = (kitchen) => {
    setSelectedKitchen(kitchen);
    setCurrentPage(1);
  };

  return (
    <Container>
      <HostSideBar activeMenu="채팅 내역" />
      <ContentWrapper>
        <Title>채팅 내역</Title>
        <TopBar>
          <TabMenu>
            {tabList.map(tab => (
              <Tab
                key={tab.value}
                active={activeTab === tab.value}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label} ({getTabCount(tab.value)})
              </Tab>
            ))}
          </TabMenu>
          <DropdownContainer>
            <DropdownButton 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              isSelected={selectedKitchen !== '전체주방'}
            >
              {selectedKitchen}
              <span>▼</span>
            </DropdownButton>
            {isDropdownOpen && (
              <DropdownList>
                <DropdownItem 
                  onClick={() => {
                    handleKitchenChange('전체주방');
                    setIsDropdownOpen(false);
                  }}
                  isSelected={selectedKitchen === '전체주방'}
                >
                  전체주방
                </DropdownItem>
                {kitchenList.map((kitchen) => (
                  <DropdownItem
                    key={kitchen.kitchenId}
                    onClick={() => {
                      handleKitchenChange(kitchen.kitchenName);
                      setIsDropdownOpen(false);
                    }}
                    isSelected={selectedKitchen === kitchen.kitchenName}
                  >
                    {kitchen.kitchenName}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownContainer>
        </TopBar>

        <ChatList>
          {currentItems.map((chat) => (
            <HostChatCard
              key={chat.chattingRoomId}
              chat={chat}
              onClick={() => handleChatClick(chat.chattingRoomId)}
            />
          ))}
        </ChatList>

        {totalPages > 1 && (
          <Pagination>
            <PageButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </PageButton>
            {[...Array(totalPages)].map((_, index) => (
              <PageButton
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                active={currentPage === index + 1}
              >
                {index + 1}
              </PageButton>
            ))}
            <PageButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </PageButton>
          </Pagination>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  padding: 40px;
  padding-left: 100px;
  margin-top: 30px;
  flex: 1;
  max-width: 1000px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TabMenu = styled.div`
  display: flex;
  gap: 16px;
`;

const Tab = styled.div`
  cursor: pointer;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  color: ${props => (props.active ? '#000' : '#666')};
  border-bottom: ${props => (props.active ? '2px solid #FFBC39' : 'none')};
  font-size: 17px;
  padding-bottom: 2px;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 200px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px solid ${props => props.isSelected ? '#FFBC39' : '#ddd'};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${props => props.isSelected ? '#FFBC39' : '#333'};
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.isSelected ? '#FFBC39' : '#333'};
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
  &:hover {
    background: #f5f5f5;
  }
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: ${props => props.active ? '#FFBC39' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  border-radius: 4px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background: ${props => props.active ? '#FFBC39' : '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export default ChatHistory; 