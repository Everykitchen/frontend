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
    background-color: #ff7926;
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
    background: ${(props) => (props.active ? "#FFBC39" : "white")};
    color: ${(props) => (props.active ? "white" : "#666")};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    border-radius: 4px;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};

    &:hover {
        background: ${(props) => (props.active ? "#FFBC39" : "#f5f5f5")};
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const HostReservations = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 5; // 한 페이지당 5개 항목 표시
    const navigate = useNavigate();

    const statusMap = {
        전체: null,
        진행중: ["PENDING_RESERVED", "RESERVED", "PENDING_PAYMENT"],
        완료: ["COMPLETED_PAYMENT"],
    };

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `/api/host/reservation?page=0&size=500`
                );
                setReservations(res.data.content || []);
            } catch (err) {
                setError("예약 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []); // currentPage 의존성 제거

    // 선택된 탭에 따라 예약 목록 필터링
    const filteredList = statusMap[activeTab]
        ? reservations.filter((item) =>
              statusMap[activeTab].includes(item.status)
          )
        : reservations;

    const getStatusLabel = (status) => {
        if (status === "PENDING_RESERVED") return "예약대기";
        if (status === "RESERVED") return "예약완료";
        if (status === "PENDING_PAYMENT") return "정산대기";
        if (status === "COMPLETED_PAYMENT") return "정산완료";
        return status;
    };

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
                                    : reservations.filter((item) =>
                                          tab === "완료"
                                              ? getStatusLabel(item.status) ===
                                                "완료"
                                              : getStatusLabel(item.status) ===
                                                "진행중"
                                      ).length}
                                )
                            </Tab>
                        ))}
                    </TabGroup>
                    <CalendarButton
                        onClick={() =>
                            navigate("/host-mypage/reservations/calendar")
                        }
                    >
                        달력으로 조회
                    </CalendarButton>
                </TabMenu>

                {loading && <div>로딩 중...</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
                {!loading && !error && currentItems.length === 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "300px",
                            fontSize: "24px",
                            color: "#666",
                            fontWeight: "500",
                        }}
                    >
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
                            navigate(
                                `/host-mypage/reservations/${reservation.reservationId}`
                            )
                        }
                    />
                ))}

                {!loading &&
                    !error &&
                    filteredList.length > 0 &&
                    totalPages > 1 && (
                        <Pagination>
                            <PageButton
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
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
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
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

export default HostReservations;
