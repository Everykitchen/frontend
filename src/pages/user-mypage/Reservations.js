import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationCard from "../../components/ReservationCard";
import Sidebar from "../../components/UserSideBar";
import styled from "styled-components";
import reservationList from "../../assets/ReservationData.json";

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

const Reservation = () => {
    const [activeTab, setActiveTab] = useState("전체");
    const navigate = useNavigate();

    const filterList =
        activeTab === "전체"
            ? reservationList
            : reservationList.filter((item) => item.status === activeTab);

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
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab} (
                            {tab === "전체"
                                ? reservationList.length
                                : reservationList.filter(
                                      (item) => item.status === tab
                                  ).length}
                            )
                        </Tab>
                    ))}
                </TabMenu>

                {filterList.map((reservation) => (
                    <div
                        key={reservation.id}
                        onClick={() =>
                            navigate(`/mypage/reservations/${reservation.id}`)
                        }
                    >
                        <ReservationCard reservation={reservation} />
                    </div>
                ))}
            </ContentWrapper>
        </Container>
    );
};

export default Reservation;
