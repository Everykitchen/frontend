import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/UserSideBar";
import chatIcon from "../../assets/icons/chat.svg";
import amountIcon from "../../assets/icons/amount.svg";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

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
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/api/user/reservation/${id}`);
                console.log('예약 상세 정보:', response.data);
                setReservation(response.data);
            } catch (error) {
                console.error("예약 상세 정보 로드 실패:", error);
            }
        };

        fetchDetail();
    }, [id]);

    if (!reservation) return <div>로딩 중...</div>;

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

    const handleChatClick = () => {
        if (reservation) {
            // 토큰이 있는지 확인
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('로그인 정보를 찾을 수 없습니다.');
                alert('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
                return;
            }
            
            // 필수 정보인 kitchenId와 reservationId 확인
            if (!reservation.kitchenId) {
                console.error('주의: kitchenId가 없습니다!', reservation);
                alert('주방 정보가 없어 채팅을 시작할 수 없습니다.');
                return;
            }
            
            // 채팅방 이동 전 상세 정보 로깅 - 필요한 정보만 포함
            console.log('채팅방 이동 시도:', {
                kitchenId: reservation.kitchenId,
                reservationId: reservation.reservationId,
                kitchenName: reservation.kitchenName
            });
            
            // 백엔드에 필요한 정보만 state에 포함
            const navigateState = {
                kitchenId: reservation.kitchenId,
                reservationId: reservation.reservationId,
                kitchenName: reservation.kitchenName
            };
            
            console.log('navigate 호출:', {
                url: `/mypage/chats/direct?reservationId=${reservation.reservationId}`,
                state: navigateState
            });
            
            navigate(`/mypage/chats/direct?reservationId=${reservation.reservationId}`, {
                state: navigateState
            });
        }
    };

    const handleSettlementClick = () => {
        navigate(`/mypage/ingredient-settlement`);
    };

    return (
        <Container>
            <Sidebar />
            <ContentWrapper>
                <Title>상세 예약 내역</Title>

                <Card>
                    <PayButton>
                        {mapStatusToLabel(reservation.status)}
                    </PayButton>

                    <Image
                        src={reservation.kitchenImageUrl}
                        alt="주방 이미지"
                    />
                    <CardContent>
                        <StudioInfo>
                            <StudioName>{reservation.kitchenName}</StudioName>
                            <Location>{reservation.kitchenLocation}</Location>
                            <Time>
                                {reservation.reservationDate} /{" "}
                                {reservation.reservationTime}
                            </Time>
                            <StatusText>
                                {mapStatusToLabel(reservation.status)}
                            </StatusText>
                        </StudioInfo>

                        <InfoBox>
                            <InfoRow>
                                <InfoLabel>예약 번호</InfoLabel>
                                <InfoValue>
                                    {reservation.reservationId}
                                </InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>예약자 성함</InfoLabel>
                                <InfoValue>{reservation.hostName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>주방 연락처</InfoLabel>
                                <InfoValue>{reservation.hostPhone}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>선결제</InfoLabel>
                                <InfoValue>
                                    {reservation.prepaidAmount.toLocaleString()}
                                    원
                                </InfoValue>
                            </InfoRow>
                        </InfoBox>

                        <ButtonGroup>
                            <Button type="chat" onClick={handleChatClick}>
                                <Icon src={chatIcon} alt="채팅 아이콘" />
                                채팅하기
                            </Button>
                            <Button onClick={handleSettlementClick}>
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
