import ReservationCard from "../../components/ReservationCard";
import Sidebar from "../../components/UserSideBar";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1; /* 나머지 영역 다 차지 */
    padding: 32px; /* 여백 */
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
    const reservationList = [
        {
            id: "19980719",
            imageUrl: "이미지URL",
            name: "파이브잇 쿠킹스튜디오샤랄라❤️",
            location: "서울 은평구",
            time: "2025.3.13 15:00 ~ 17:00 (4인)",
            status: "진행중",
        },
        // 다른 예약 데이터...
    ];

    return (
        <Container>
            <Sidebar />
            <Content>
                <Title>예약 내역</Title>
                <TabMenu>
                    <Tab active>전체 (2)</Tab>
                    <Tab>진행중 (1)</Tab>
                    <Tab>완료 (1)</Tab>
                </TabMenu>

                {reservationList.map((reservation) => (
                    <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                    />
                ))}
            </Content>
        </Container>
    );
};

export default Reservation;
