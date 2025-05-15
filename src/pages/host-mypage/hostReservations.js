import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HostSideBar from "../../components/HostSideBar";
import HostReservationCard from "../../components/HostReservationCard";
import styled from "styled-components";
import axios from "../../api/axiosInstance";

/**
 * 호스트의 예약 내역 목록을 보여주는 페이지 컴포넌트
 * 
 * 주요 기능:
 * - 호스트의 예약 목록을 페이징 처리하여 표시
 * - 전체/진행중/완료 필터링 기능
 * - 각 탭별 예약 수 표시
 * - 데이터가 없을 경우 안내 메시지 표시
 * - 로딩 및 에러 상태 처리
 * - 달력으로 조회 버튼
 */

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 40px;
    padding-left: 100px;
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

const CalendarButton = styled.button`
    background-color: #FF7926;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    &:hover {
        background-color: #ff6b0f;
    }
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

/**
 * 예약 상태 코드를 UI에 표시할 라벨로 변환
 * @param {string} status 예약 상태 코드
 * @returns {string} UI에 표시할 상태 텍스트
 */
const getStatusLabel = (status) => {
    if (status === "RESERVED" || status === "PENDING_PAYMENT") return "진행중";
    if (status === "COMPLETED_PAYMENT") return "완료";
    return status;
};

const HostReservations = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const [currentPage, setCurrentPage] = useState(1);
    const [reservations, setReservations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 10; // 한 페이지당 10개 항목 표시
    const navigate = useNavigate();

    /**
     * 예약 목록 데이터를 로드하는 함수
     * 페이지 번호가 변경될 때마다 실행됨
     */
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/host/reservation?page=${currentPage - 1}&size=${itemsPerPage}`);
                // 서버에서 받은 데이터를 그대로 사용
                setReservations(res.data.content || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                setError("예약 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [currentPage]);

    /**
     * 선택된 탭에 따라 예약 목록 필터링
     * 전체 탭: 모든 예약
     * 완료 탭: 완료 상태의 예약
     * 진행중 탭: 진행중 상태의 예약
     */
    const filteredList =
        activeTab === "전체"
            ? reservations
            : reservations.filter((item) =>
                activeTab === "완료"
                    ? getStatusLabel(item.status) === "완료"
                    : getStatusLabel(item.status) === "진행중"
            );

    // 서버에서 받은 데이터를 그대로 사용
    const currentItems = filteredList;

    /**
     * 페이지 변경 핸들러
     * @param {number} pageNumber 이동할 페이지 번호
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // 페이지 상단으로 스크롤
    };

    /**
     * 탭 변경 핸들러
     * 탭 변경 시 페이지를 1로 리셋
     * @param {string} tab 선택한 탭 이름
     */
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <Container>
            <HostSideBar />
            <ContentWrapper>
                <Title>예약 내역</Title>
                <TabMenu>
                    <TabGroup>
                        {["전체", "진행중", "완료"].map((tab) => (
                            <Tab
                                key={tab}
                                active={activeTab === tab}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab} (
                                {tab === "전체"
                                    ? reservations.length
                                    : reservations.filter(
                                          (item) =>
                                            tab === "완료"
                                                ? getStatusLabel(item.status) === "완료"
                                                : getStatusLabel(item.status) === "진행중"
                                      ).length}
                                )
                            </Tab>
                        ))}
                    </TabGroup>
                    <CalendarButton onClick={() => navigate('/host-mypage/reservations/calendar')}>
                        달력으로 조회
                    </CalendarButton>
                </TabMenu>
                
                {/* 로딩 중 표시 */}
                {loading && <div>로딩 중...</div>}
                
                {/* 에러 메시지 표시 */}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                
                {/* 결과가 없을 때 안내 메시지 표시 */}
                {!loading && !error && currentItems.length === 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '300px',
                        fontSize: '24px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        예약 내역이 없습니다.
                    </div>
                )}
                
                {/* 예약 목록 표시 */}
                {currentItems.map((reservation) => (
                    <HostReservationCard
                        key={reservation.reservationId}
                        reservation={{
                            id: reservation.reservationId,
                            kitchenName: reservation.kitchenName,
                            imageUrl: reservation.imageUrl,
                            location: reservation.location,
                            date: reservation.date,
                            time: `${reservation.startTime} ~ ${reservation.endTime}`,
                            people: reservation.clientNumber,
                            userName: reservation.clientName,
                            status: getStatusLabel(reservation.status),
                        }}
                        onClick={() =>
                            navigate(`/host-mypage/reservations/${reservation.reservationId}`)
                        }
                    />
                ))}
                
                {/* 페이지네이션 (필터링된 예약이 있고 총 페이지가 1 이상일 때만 표시) */}
                {!loading && !error && currentItems.length > 0 && totalPages > 1 && (
                    <Pagination>
                        <PageButton
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </PageButton>
                        {[...Array(totalPages)].map((_, index) => (
                            <PageButton
                                key={index + 1}
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
            </ContentWrapper>
        </Container>
    );
};

export default HostReservations; 