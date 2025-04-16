import styled from "styled-components";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/UserSideBar";
import chatIcon from "../../assets/icons/chat.svg";
import amountIcon from "../../assets/icons/amount.svg";
import reservationList from "../../assets/ReservationData.json";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
    flex: 1;
    padding: 60px 80px;
`;

const Title = styled.h2`
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 32px;
`;

const Card = styled.div`
    position: relative;
    display: flex;
    background-color: white;
    border-radius: 16px;
    padding: 28px;
    gap: 28px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    align-items: flex-start;
    margin-bottom: 40px;
`;

const Image = styled.img`
    width: 240px;
    height: 160px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
`;

const CardContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const StudioInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
`;

const StudioName = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 6px;
`;

const Location = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
`;

const Time = styled.div`
    font-size: 15px;
    color: #333;
`;

const StatusText = styled.div`
    margin-top: 12px;
    font-size: 14px;
    font-weight: bold;
    color: #888;
`;

const InfoBox = styled.div`
    background-color: #f8f8f8;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
`;

const InfoLabel = styled.div`
    font-size: 14px;
    color: #666;
`;

const InfoValue = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #333;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: auto;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    color: white;

    ${(props) =>
        props.type === "chat"
            ? "background-color: #FFBC39;"
            : "background-color: #666;"}
`;

const Icon = styled.img`
    width: 16px;
    height: 16px;
`;

const PayButton = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #ffbc39;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    z-index: 1;
`;

const ReservationDetail = () => {
    const { id } = useParams();

    // 더미 데이터 (실제 API 연결 예정)
    const reservation = reservationList.find((r) => r.id === id);

    return (
        <Container>
            <Sidebar />
            <ContentWrapper>
                <Title>상세 예약 내역</Title>

                <Card>
                    <PayButton>{reservation.paymentStatus}</PayButton>

                    <Image src={reservation.imageUrl} />
                    <CardContent>
                        <StudioInfo>
                            <StudioName>{reservation.name}</StudioName>
                            <Location>{reservation.address}</Location>
                            <Time>{reservation.time}</Time>
                            <StatusText>{reservation.status}</StatusText>
                        </StudioInfo>

                        <InfoBox>
                            <InfoRow>
                                <InfoLabel>예약 번호</InfoLabel>
                                <InfoValue>{reservation.id}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>예약자 성함</InfoLabel>
                                <InfoValue>{reservation.userName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>주방 연락처</InfoLabel>
                                <InfoValue>
                                    {reservation.kitchenPhone}
                                </InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>선결제</InfoLabel>
                                <InfoValue>{reservation.prepayment}</InfoValue>
                            </InfoRow>
                        </InfoBox>

                        <ButtonGroup>
                            <Button type="chat">
                                <Icon src={chatIcon} alt="채팅 아이콘" />
                                채팅하기
                            </Button>
                            <Button>
                                <Icon src={amountIcon} alt="정산 아이콘" />
                                재료정산
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>
            </ContentWrapper>
        </Container>
    );
};

export default ReservationDetail;
