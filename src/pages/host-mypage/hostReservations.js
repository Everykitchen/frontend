import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HostSideBar from "../../components/HostSideBar";
import HostReservationCard from "../../components/HostReservationCard";
import styled from "styled-components";
import axios from "../../api/axiosInstance";

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

// status 변환 함수
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
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // API 호출
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/host/reservation?page=${currentPage - 1}&size=${itemsPerPage}`);
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

    // 탭 필터링
    const filteredList =
        activeTab === "전체"
            ? reservations
            : reservations.filter((item) =>
                activeTab === "완료"
                    ? getStatusLabel(item.status) === "완료"
                    : getStatusLabel(item.status) === "진행중"
            );

    const currentItems = filteredList;

    // 페이지네이션 계산
    // API에서 이미 페이징된 데이터를 주므로, currentItems = filteredList

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // 탭 변경 시 페이지 1로 리셋
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
                </TabMenu>
                {loading && <div>로딩 중...</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
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