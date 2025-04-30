import styled from "styled-components";
import kitchenImage from "../assets/jpg/kitchen1.jpg";

const Card = styled.div`
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    cursor: pointer;
    background: #fcfcfc;
    display: flex;
    gap: 20px;

    &:hover {
        background: #FAFAFA;
    }
`;

const KitchenImage = styled.img`
    width: 240px;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 8px 0;
`;

const ReservationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 10px;
`;

const ReservationNumber = styled.div`
    color: #666;
    font-size: 14px;
`;

const KitchenName = styled.div`
    font-size: 18px;
    font-weight: bold;
`;

const UserName = styled.div`
    color: #000;
    font-size: 20px;
    font-weight: 500;
`;

const DateTime = styled.div`
    color: #333;
    font-size: 14px;
`;

const Status = styled.div`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    width: fit-content;
    background: ${props => props.status === "진행중" ? "#FFBC39" : "#9B9B9B"};
    color: white;
    margin-top: auto;
`;

const HostReservationCard = ({ reservation, onClick }) => {
    return (
        <Card onClick={onClick}>
            <KitchenImage src={kitchenImage} alt="주방 이미지" />
            <ContentWrapper>
                <ReservationInfo>
                    <ReservationNumber>예약번호 {reservation.id}</ReservationNumber>
                    <KitchenName>{reservation.kitchenName}</KitchenName>
                    <UserName>{reservation.userName} 님</UserName>
                    <DateTime>{reservation.date} {reservation.time} ({reservation.people}인)</DateTime>
                </ReservationInfo>
                <Status status={reservation.status}>
                    {reservation.status}
                </Status>
            </ContentWrapper>
        </Card>
    );
};

export default HostReservationCard; 