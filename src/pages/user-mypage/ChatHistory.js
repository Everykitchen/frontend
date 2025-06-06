import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UserSideBar from '../../components/UserSideBar';

// 기본 이미지 URL
const DEFAULT_KITCHEN_IMAGE = 'https://via.placeholder.com/128x128?text=Kitchen';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const PageContentWrapper = styled.div`
    padding: 40px;
    padding-left: 100px;
    padding-right: 100px;
    margin-top: 30px;
    flex: 1;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
`;

const TabMenu = styled.div`
    display: flex;
    margin-bottom: 24px;
    justify-content: space-between;
`;

const TabGroup = styled.div`
    display: flex;
`;

const Tab = styled.div`
    margin-right: 16px;
    cursor: pointer;
    font-weight: ${(props) => (props.active ? "700" : "500")};
    color: ${(props) => (props.active ? "#000" : "#666")};
    border-bottom: ${(props) => (props.active ? "2px solid black" : "none")};
`;

const DropdownWrapper = styled.div`
    position: relative;
    width: 160px;
    font-size: 14px;
`;

const DropdownButton = styled.button`
    width: 100%;
    height: 32px;
    background: #fff;
    border: 1px solid #999;
    border-radius: 6px;
    padding: 0 12px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #222;
    font-size: 14px;
`;

const DropdownList = styled.ul`
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ffa500;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 20;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const DropdownItem = styled.li`
    padding: 10px 14px;
    cursor: pointer;
    color: ${({ selected }) => (selected ? "#ffa500" : "#222")};
    background: ${({ selected }) => (selected ? "#fff8e1" : "#fff")};
    font-weight: ${({ selected }) => (selected ? 700 : 400)};
    &:hover {
        background: #fff3d1;
        color: #ffa500;
    }
`;

const EmptyMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 24px;
    color: #666;
    font-weight: 500;
`;

const ChatCard = styled.div`
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
    cursor: pointer;
    background: #fcfcfc;
    display: flex;
    gap: 20px;
    width: 100%;
    height: 120px;
    position: relative;
    &:hover {
        background: #FAFAFA;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
        transition: all 0.2s ease;
    }
`;

const KitchenImage = styled.img`
    width: 96px;
    height: 96px;
    border-radius: 8px;
    object-fit: cover;
`;

const ChatCardContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 4px 0;
    position: relative;
`;

const ChatInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 8px;
`;

const KitchenName = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #222;
`;

const Location = styled.div`
    font-size: 13px;
    color: #666;
`;

const DateTime = styled.div`
    font-size: 13px;
    color: #666;
`;

const Status = styled.div`
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 400;
    width: fit-content;
    background: ${props => {
        switch(props.status) {
            case '예약중':
                return '#FFBC39';
            case '미예약':
                return '#9B9B9B';
            default:
                return '#9B9B9B';
        }
    }};
    color: white;
    position: absolute;
    top: 12px;
    right: 12px;
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

const generateMockChats = () => {
    const statuses = ['PENDING', 'RESERVED', 'PENDING_PAYMENT', 'COMPLETED_PAYMENT', 'CANCELED'];
    const kitchenNames = ['맛있는 주방', '행복한 베이킹룸', '쿠킹 스튜디오', '홈베이킹 클래스', '파티 주방'];
    const locations = ['서울시 강남구', '서울시 서초구', '서울시 마포구', '서울시 종로구', '서울시 용산구'];
    const messages = [
        '안녕하세요, 예약 가능한 시간이 궁금합니다.',
        '네, 가능한 시간 알려드리겠습니다.',
        '예약 확정해주세요.',
        '결제 완료했습니다.',
        '감사합니다.'
    ];

    return Array.from({ length: 15 }, (_, index) => ({
        chattingRoomId: `chat_${index + 1}`,
        kitchenId: `kitchen_${index + 1}`,
        kitchenName: kitchenNames[index % kitchenNames.length],
        kitchenLocation: locations[index % locations.length],
        reservationStatus: statuses[index % statuses.length],
        lastMessage: messages[index % messages.length],
        lastMessageTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastReservationDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastReservationCount: Math.floor(Math.random() * 10) + 1,
        kitchenImage: `https://picsum.photos/200/200?random=${index}`
    }));
};

const ChatHistory = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState('전체');
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    useEffect(() => {
        const loadMockData = async () => {
            setLoading(true);
            try {
                const mockData = generateMockChats();
                setChats(mockData);
            } catch (err) {
                console.error('채팅 내역을 불러오는 데 실패했습니다:', err);
                setError('채팅 내역을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        
        loadMockData();
    }, []);

    useEffect(() => {
        if (activeStatus === '전체') {
            setFilteredChats(chats);
        } else {
            const statusMap = {
                '미예약': ['PENDING', 'CANCELED', 'PENDING_PAYMENT'],
                '예약중': ['RESERVED', 'COMPLETED_PAYMENT']
            };
            
            setFilteredChats(chats.filter(chat => 
                statusMap[activeStatus]?.includes(chat.reservationStatus)
            ));
        }
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    }, [activeStatus, chats]);

    const getStatusCount = (status) => {
        if (status === '전체') return chats.length;
        
        const statusMap = {
            '미예약': ['PENDING', 'CANCELED', 'PENDING_PAYMENT'],
            '예약중': ['RESERVED', 'COMPLETED_PAYMENT']
        };
        
        return chats.filter(chat => statusMap[status]?.includes(chat.reservationStatus)).length;
    };

    const handleChatClick = (chat) => {
        navigate('/user-mypage/chats/temp-chat', { 
            state: { 
                kitchenId: chat.kitchenId,
                chattingRoomId: 'temp-chat',
                kitchenName: chat.kitchenName,
                kitchenLocation: chat.kitchenLocation,
                status: chat.reservationStatus,
                lastReservationDate: chat.lastReservationDate,
                lastReservationCount: chat.lastReservationCount,
                kitchenImage: chat.kitchenImage
            } 
        });
    };

    const handleImgError = (e) => {
        e.target.src = DEFAULT_KITCHEN_IMAGE;
    };

    const formatLocation = (location) => {
        return location || '위치 정보 없음';
    };

    // 페이지네이션을 위한 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChats.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChats.length / itemsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <PageContentWrapper>
                <Title>채팅 내역</Title>
                <EmptyMessage>로딩 중...</EmptyMessage>
            </PageContentWrapper>
        </Container>
    );

    if (error) return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <PageContentWrapper>
                <Title>채팅 내역</Title>
                <EmptyMessage style={{ color: 'red' }}>{error}</EmptyMessage>
            </PageContentWrapper>
        </Container>
    );

    return (
        <Container>
            <UserSideBar activeMenu="채팅 내역" />
            <PageContentWrapper>
                <Title>채팅 내역</Title>
                <TabMenu>
                    <TabGroup>
                    {['전체', '미예약', '예약중'].map(status => (
                        <Tab
                            key={status}
                            active={activeStatus === status}
                            onClick={() => setActiveStatus(status)}
                        >
                            {status} ({getStatusCount(status)})
                        </Tab>
                    ))}
                    </TabGroup>
                    <DropdownWrapper ref={dropdownRef}>
                        <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                            최신순
                            <span style={{ marginLeft: 8 }}>{dropdownOpen ? '▲' : '▼'}</span>
                        </DropdownButton>
                        {dropdownOpen && (
                            <DropdownList>
                                {['최신순', '오래된순'].map(option => (
                                    <DropdownItem
                                        key={option}
                                        selected={option === '최신순'}
                                        onClick={() => {
                                            // 정렬 로직 구현 예정
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {option}
                                    </DropdownItem>
                                ))}
                            </DropdownList>
                        )}
                    </DropdownWrapper>
                </TabMenu>
                
                {filteredChats.length > 0 ? (
                    <>
                        {currentItems.map(chat => (
                            <ChatCard key={chat.chattingRoomId} onClick={() => handleChatClick(chat)}>
                                <KitchenImage
                                    src={chat.kitchenImage || DEFAULT_KITCHEN_IMAGE}
                                    alt="주방 이미지"
                                    onError={handleImgError}
                                />
                                <ChatCardContentWrapper>
                                    <ChatInfo>
                                        <KitchenName>{chat.kitchenName}</KitchenName>
                                        <Location>{formatLocation(chat.kitchenLocation)}</Location>
                                        <DateTime>마지막 예약: {chat.lastReservationDate}</DateTime>
                                    </ChatInfo>
                                    <Status status={chat.reservationStatus === 'RESERVED' ? '예약중' : '미예약'}>
                                        {chat.reservationStatus === 'RESERVED' ? '예약중' : '미예약'}
                                    </Status>
                                </ChatCardContentWrapper>
                            </ChatCard>
                        ))}
                        {totalPages > 1 && (
                            <Pagination>
                                <PageButton
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    이전
                                </PageButton>
                                {[...Array(totalPages)].map((_, index) => (
                                    <PageButton
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        active={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PageButton>
                                ))}
                                <PageButton
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    다음
                                </PageButton>
                            </Pagination>
                        )}
                    </>
                ) : (
                    <EmptyMessage>채팅 내역이 없습니다.</EmptyMessage>
                )}
            </PageContentWrapper>
        </Container>
    );
};

export default ChatHistory; 