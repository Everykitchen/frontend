import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationCard from "../../components/ReservationCard";
import Sidebar from "../../components/UserSideBar";
import styled from "styled-components";
import api from "../../api/axiosInstance";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 40px;
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
`;

const Tab = styled.div`
    margin-right: 16px;
    cursor: pointer;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    border-bottom: ${(props) => (props.active ? "2px solid black" : "none")};
`;

const CardWrapper = styled.div`
    margin-bottom: 20px;
    padding: 4px;
    border-radius: 12px;
    border-left: 6px solid
        ${(props) =>
            props.status === "RESERVED"
                ? "#ffbc39"
                : props.status === "PENDING_PAYMENT"
                ? "#4da6ff"
                : props.status === "COMPLETED_PAYMENT"
                ? "#5cb85c"
                : "#ccc"};
    background-color: #fdfdfd;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: #f9f9f9;
    }
`;

const Reservation = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const [reservationList, setReservationList] = useState([]);
    const navigate = useNavigate();

    const statusMap = {
        전체: null,
        예약완료: "RESERVED",
        정산대기: "PENDING_PAYMENT",
        정산완료: "COMPLETED_PAYMENT",
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await api.get(
                    "/api/user/reservation?page=0&size=100"
                );
                setReservationList(response.data.content);
            } catch (error) {
                console.error("예약 목록 불러오기 실패:", error);
            }
        };

        fetchReservations();
    }, []);

    const filteredList = statusMap[activeTab]
        ? reservationList.filter((item) => item.status === statusMap[activeTab])
        : reservationList;

    console.log(reservationList);

    return (
        <Container>
            <Sidebar />
            <ContentWrapper>
                <Title>예약 내역</Title>
                <TabMenu>
                    {["전체", "예약완료", "정산대기", "정산완료"].map((tab) => (
                        <Tab
                            key={tab}
                            active={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab} (
                            {statusMap[tab]
                                ? reservationList.filter(
                                      (item) => item.status === statusMap[tab]
                                  ).length
                                : reservationList.length}
                            )
                        </Tab>
                    ))}
                </TabMenu>

                {filteredList.map((reservation) => (
                    <CardWrapper
                        key={reservation.reservationId}
                        status={reservation.status}
                        onClick={() =>
                            navigate(
                                `/mypage/reservations/${reservation.reservationId}`
                            )
                        }
                    >
                        <ReservationCard reservation={reservation} />
                    </CardWrapper>
                ))}
            </ContentWrapper>
        </Container>
    );
};

export default Reservation;
