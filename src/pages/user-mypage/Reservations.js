import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationCard from "../../components/ReservationCard";
import Sidebar from "../../components/UserSideBar";
import styled from "styled-components";
import api from "../../api/axiosInstance";

/**
 * 사용자의 예약 내역 목록을 보여주는 페이지 컴포넌트
 * 
 * 주요 기능:
 * - 사용자의 예약 목록을 페이징 처리하여 표시 (5개씩)
 * - 전체/진행중/완료 필터링 기능
 * - 각 탭별 예약 수 표시
 * - 데이터가 없을 경우 안내 메시지 표시
 * - 로딩 및 에러 상태 처리
 */

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 40px;
    margin-top: 30px;
    flex: 1;
    margin-left: 50px;
    margin-right: 50px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
`;

const TabMenu = styled.div`
    display: flex;
    margin-bottom: 24px;
`;

const Tab = styled.div`
    margin-right: 16px;
    cursor: pointer;
    font-weight: ${(props) => (props.active ? "700" : "500")};
    color: ${(props) => (props.active ? "#000" : "#666")};
    border-bottom: ${(props) => (props.active ? "2px solid black" : "none")};
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

const EmptyMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 24px;
    color: #666;
    font-weight: 500;
`;

const Reservation = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const [reservationList, setReservationList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 5; // 한 페이지당 5개 항목 표시
    const navigate = useNavigate();

    // 상태 필터링을 위한 매핑 객체
    const statusMap = {
        전체: null,
        진행중: ["RESERVED", "PENDING_PAYMENT"],
        완료: ["COMPLETED_PAYMENT"],
    };

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(
                    `/api/user/reservation?page=0&size=500`
                );
                setReservationList(response.data.content || []);
            } catch (error) {
                console.error("예약 목록 불러오기 실패:", error);
                setError("예약 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []); // currentPage 의존성 제거

    // 선택된 탭에 따라 예약 목록 필터링
    const filteredList = statusMap[activeTab]
        ? reservationList.filter((item) =>
              statusMap[activeTab].includes(item.status)
          )
        : reservationList;

    // 현재 페이지에 해당하는 항목들만 선택
    const currentItems = filteredList.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0); // 페이지를 0으로 리셋
    };

    return (
        <Container>
            <Sidebar />
            <ContentWrapper>
                <Title>예약 내역</Title>
                <TabMenu>
                    {["전체", "진행중", "완료"].map((tab) => (
                        <Tab
                            key={tab}
                            active={activeTab === tab}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab} (
                            {statusMap[tab]
                                ? reservationList.filter((item) =>
                                      statusMap[tab].includes(item.status)
                                  ).length
                                : reservationList.length}
                            )
                        </Tab>
                    ))}
                </TabMenu>

                {/* 로딩 중 표시 */}
                {loading && <EmptyMessage>로딩 중...</EmptyMessage>}
                
                {/* 에러 메시지 표시 */}
                {error && <EmptyMessage style={{ color: 'red' }}>{error}</EmptyMessage>}
                
                {/* 결과가 없을 때 안내 메시지 표시 */}
                {!loading && !error && currentItems.length === 0 && (
                    <EmptyMessage>예약 내역이 없습니다.</EmptyMessage>
                )}

                {/* 예약 목록 표시 */}
                {currentItems.map((reservation) => (
                    <ReservationCard 
                        key={reservation.reservationId}
                        reservation={reservation}
                    />
                ))}

                {/* 페이지네이션 (필터링된 예약이 있고 총 페이지가 1 이상일 때만 표시) */}
                {!loading && !error && filteredList.length > 0 && totalPages > 1 && (
                    <Pagination>
                        <PageButton
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            이전
                        </PageButton>
                        {[...Array(totalPages)].map((_, index) => (
                            <PageButton
                                key={index}
                                onClick={() => handlePageChange(index)}
                                active={currentPage === index}
                            >
                                {index + 1}
                            </PageButton>
                        ))}
                        <PageButton
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            다음
                        </PageButton>
                    </Pagination>
                )}
            </ContentWrapper>
        </Container>
    );
};

export default Reservation;
