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
    gap: 30px;
    width: 100%;
    &:hover {
        background: #FAFAFA;
    }
`;

const KitchenImage = styled.img`
    width: 280px;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 6px 0;
`;

const ReservationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
`;

const ReservationNumber = styled.div`
    color: #666;
    font-size: 14px;
    font-weight: 400;
`;

const KitchenName = styled.div`
    font-size: 20px;
    font-weight: 700;
`;

const UserName = styled.div`
    font-size: 20px;
    font-weight: 700;
`;

const DateTime = styled.div`
    color: #666;
    font-size: 18px;
    font-weight: 600;
`;

const Location = styled.div`
    color: #666;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 6px;
`;

const Status = styled.div`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    width: fit-content;
    background: ${props => props.status === "진행중" ? "#FFBC39" : "#9B9B9B"};
    color: white;
    margin-top: auto;
`;

const HostReservationCard = ({ reservation, onClick }) => {
    // 이미지 에러 핸들러: 로드 실패 시 기본 이미지로 대체
    const handleImgError = (e) => {
        e.target.src = kitchenImage;
    };
    return (
        <Card onClick={onClick}>
            <KitchenImage
                src={reservation.imageUrl || kitchenImage}
                alt="주방 이미지"
                onError={handleImgError}
            />
            <ContentWrapper>
                <ReservationInfo>
                    <ReservationNumber>예약번호 {reservation.id}</ReservationNumber>
                    <KitchenName>{reservation.kitchenName}</KitchenName>
                    <Location>{reservation.location}</Location>
                    <DateTime>{reservation.date} {reservation.time} ({reservation.people}인)</DateTime>
                    <UserName> {reservation.userName} 님</UserName>
                </ReservationInfo>
                <Status status={reservation.status}>
                    {reservation.status}
                </Status>
            </ContentWrapper>
        </Card>
    );
};

export default HostReservationCard; 