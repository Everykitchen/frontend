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
        props.status === "RESERVED"
            ? "#ffbc39"
            : props.status === "PENDING_PAYMENT"
            ? "#4da6ff"
            : props.status === "COMPLETED_PAYMENT"
            ? "#5cb85c"
            : "#888"};
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

    const mapStatusToLabel = (status) => {
        switch (status) {
            case "RESERVED":
                return "예약완료";
            case "PENDING_PAYMENT":
                return "정산대기";
            case "COMPLETED_PAYMENT":
                return "정산완료";
            default:
                return "알수없음";
        }
    };

    return (
        <Card
            onClick={() =>
                navigate(`/mypage/reservations/${reservation.reservationId}`)
            }
        >
            <Image src={reservation.kitchenImageUrl} alt="kitchen" />
            <Info>
                <TopInfo>
                    <Name>{reservation.kitchenName}</Name>
                    <StatusBadge status={reservation.status}>
                        {mapStatusToLabel(reservation.status)}
                    </StatusBadge>
                </TopInfo>
                <ReservationNumber>
                    예약 번호 {reservation.reservationId}
                </ReservationNumber>
                <Location>{reservation.kitchenLocation}</Location>
                <Time>
                    {reservation.reservationDate} /{" "}
                    {reservation.reservationTime}
                </Time>
            </Info>
        </Card>
    );
};

export default ReservationCard;
