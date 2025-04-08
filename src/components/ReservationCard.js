import styled from "styled-components";

const Card = styled.div`
    display: flex;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 16px;
`;

const Image = styled.img`
    width: 150px;
    height: 100px;
    border-radius: 8px;
    margin-right: 16px;
`;

const Info = styled.div`
    flex: 1;
`;

const TopInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: top;
`;

const ReservationNumber = styled.div`
    color: #888;
    font-size: 14px;
`;

const StatusBadge = styled.div`
    background-color: orange;
    color: white;
    border-radius: 4px;
    padding: 10px 0px;
    font-size: 12px;
    min-width: 70px;
    text-align: center;
`;

const Name = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Location = styled.div`
    font-size: 12px;
    color: #555;
    margin-bottom: 10px;
`;

const Time = styled.div`
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
`;

const ReservationCard = ({ reservation }) => {
    return (
        <Card>
            <Image src={reservation.imageUrl} />
            <Info>
                <TopInfo>
                    <ReservationNumber>
                        예약 번호 {reservation.id}
                    </ReservationNumber>
                    <StatusBadge>{reservation.status}</StatusBadge>
                </TopInfo>
                <Name>{reservation.name}</Name>
                <Location>{reservation.location}</Location>
                <Time>{reservation.time}</Time>
            </Info>
        </Card>
    );
};

export default ReservationCard;
