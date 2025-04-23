import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HostSideBar from "../../components/HostSideBar";
import HostReservationCard from "../../components/HostReservationCard";
import styled from "styled-components";

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
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
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

// 임시 데이터
const tempReservations = [
    {
        id: 19980719,
        userName: "김철수",
        date: "2025.3.13",
        time: "15:00 ~ 17:00",
        status: "진행중",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 4
    },
    {
        id: 19980720,
        userName: "이영희",
        date: "2025.3.13",
        time: "10:00 ~ 12:00",
        status: "진행중",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 2
    },
    {
        id: 19980721,
        userName: "박지민",
        date: "2025.3.14",
        time: "13:00 ~ 15:00",
        status: "진행중",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 3
    },
    {
        id: 19980722,
        userName: "최수진",
        date: "2025.3.14",
        time: "16:00 ~ 18:00",
        status: "진행중",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 5
    },
    {
        id: 19980723,
        userName: "정민우",
        date: "2025.3.15",
        time: "11:00 ~ 13:00",
        status: "진행중",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 2
    },
    {
        id: 19980724,
        userName: "강다희",
        date: "2025.3.12",
        time: "14:00 ~ 16:00",
        status: "완료",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 4
    },
    {
        id: 19980725,
        userName: "송민석",
        date: "2025.3.12",
        time: "17:00 ~ 19:00",
        status: "완료",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 3
    },
    {
        id: 19980726,
        userName: "임서연",
        date: "2025.3.11",
        time: "10:00 ~ 12:00",
        status: "완료",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 6
    },
    {
        id: 19980727,
        userName: "한주원",
        date: "2025.3.11",
        time: "13:00 ~ 15:00",
        status: "완료",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 2
    },
    {
        id: 19980728,
        userName: "오지현",
        date: "2025.3.11",
        time: "16:00 ~ 18:00",
        status: "완료",
        kitchenName: "파이브잇 쿠킹스튜디오",
        people: 4
    }
];

const HostReservations = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    // 진행중인 예약을 먼저 보여주기 위해 정렬
    const sortedReservations = [...tempReservations].sort((a, b) => {
        if (a.status === "진행중" && b.status !== "진행중") return -1;
        if (a.status !== "진행중" && b.status === "진행중") return 1;
        return 0;
    });

    const filteredList =
        activeTab === "전체"
            ? sortedReservations
            : sortedReservations.filter((item) => 
                activeTab === "완료" ? item.status === "완료" : item.status === "진행중"
            );

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

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
                                ? tempReservations.length
                                : tempReservations.filter(
                                      (item) => 
                                        tab === "완료" ? item.status === "완료" : item.status === "진행중"
                                  ).length}
                            )
                        </Tab>
                    ))}
                </TabMenu>

                {currentItems.map((reservation) => (
                    <HostReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onClick={() =>
                            navigate(`/host-mypage/reservations/${reservation.id}`)
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