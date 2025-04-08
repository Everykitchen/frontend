import { useState } from "react";
import ReservationCard from "../../components/ReservationCard";
import Sidebar from "../../components/UserSideBar";
import styled from "styled-components";

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

    const reservationList = [
        {
            id: "1",
            imageUrl: "이미지URL",
            name: "파이브잇 쿠킹스튜디오샤랄라❤️",
            location: "서울 은평구",
            time: "2025.3.13 15:00 ~ 17:00 (4인)",
            status: "진행중",
        },
        {
            id: "2",
            imageUrl: "이미지URL",
            name: "마이키친 렌탈스튜디오",
            location: "서울 강남구",
            time: "2025.2.5 11:00 ~ 13:00 (2인)",
            status: "완료",
        },
        {
            id: "3",
            imageUrl: "이미지URL",
            name: "소셜키친 공유주방",
            location: "서울 종로구",
            time: "2025.4.1 14:00 ~ 16:00 (6인)",
            status: "진행중",
        },
    ];

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
                    <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                    />
                ))}
            </ContentWrapper>
        </Container>
    );
};

export default Reservation;
