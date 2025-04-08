import styled from "styled-components";

const CardContainer = styled.div`
    display: flex;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 16px;
`;

const Img = styled.img`
    width: 150px;
    height: 100px;
    border-radius: 8px;
    margin-right: 16px;
`;

const Content = styled.div`
    flex: 1;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const ReserveNum = styled.div`
    color: #888;
    font-size: 14px;
`;

const Status = styled.div`
    background-color: orange;
    color: white;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 12px;
`;

const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
`;

const Location = styled.div`
    font-size: 14px;
    color: #555;
`;

const Time = styled.div`
    font-size: 14px;
    color: #555;
`;

const ReservationCard = ({ reservation }) => {
    return (
        <CardContainer>
            <Img src={reservation.imageUrl} />
            <Content>
                <Top>
                    <ReserveNum>예약 번호 {reservation.id}</ReserveNum>
                    <Status>{reservation.status}</Status>
                </Top>
                <Title>{reservation.name}</Title>
                <Location>{reservation.location}</Location>
                <Time>{reservation.time}</Time>
            </Content>
        </CardContainer>
    );
};

export default ReservationCard;
