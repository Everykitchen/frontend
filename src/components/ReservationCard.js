import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
    display: flex;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Image = styled.img`
    width: 160px;
    height: 110px;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 20px;
`;

const Info = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const TopInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatusBadge = styled.div`
    background-color: ${(props) =>
        props.status === "진행중" ? "#FFA500" : "#888"};
    color: white;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: bold;
    min-width: 70px;
    text-align: center;
`;

const Name = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin: 12px 0 4px;
`;

const ReservationNumber = styled.div`
    font-size: 13px;
    color: #aaa;
    margin-bottom: 10px;
`;

const Location = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
`;

const Time = styled.div`
    font-size: 14px;
    color: #444;
`;

const ReservationCard = ({ reservation }) => {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/mypage/reservations/${reservation.id}`)}
        >
            <Image src={reservation.imageUrl} />
            <Info>
                <TopInfo>
                    <Name>{reservation.name}</Name>
                    <StatusBadge status={reservation.status}>
                        {reservation.status}
                    </StatusBadge>
                </TopInfo>
                <ReservationNumber>
                    예약 번호 {reservation.id}
                </ReservationNumber>
                <Location>{reservation.location}</Location>
                <Time>{reservation.time}</Time>
            </Info>
        </Card>
    );
};

export default ReservationCard;
