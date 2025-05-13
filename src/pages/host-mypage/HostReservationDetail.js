import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HostSideBar from '../../components/HostSideBar';
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel.svg';
import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { ReactComponent as MoneyIcon } from '../../assets/icons/money.svg';
import kitchenImage from '../../assets/jpg/kitchen1.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: white;
`;
const ContentWrapper = styled.div`
    padding: 40px;
    padding-left: 100px;
    margin-top: 30px;
    flex: 1;
`;


const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 48px;
    text-align: left;
`;

const DetailCard = styled.div`
    background: #FCFCFC;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 18px 30px 30px 30px;
    max-width: 900px;
    min-width: 700px;
`;

const ReservationStatus = styled.div`
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
    background: ${props =>
        props.status === 'RESERVED' ? '#FFBC39' :
        props.status === 'PENDING_PAYMENT' ? '#FF7926' :
        props.status === 'COMPLETED_PAYMENT' ? '#BDBDBD' : '#FFBC39'};
    padding: 8px 24px;
    border-radius: 6px;
`;

const TopSection = styled.div`
    display: flex;
    gap: 36px;
    margin-bottom: 42px;
`;

const KitchenImage = styled.img`
    width: 45%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
`;

const KitchenInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const KitchenName = styled.h3`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
`;

const Address = styled.p`
    color: #767676;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 60px;
`;

const DateTime = styled.p`
    color: #333;
    font-size: 24px;
    margin-top: 40px;
    font-weight: 600;
`;

const SectionTitle = styled.h4`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 28px;
    color: #333;
`;

const BottomSection = styled.div`
    display: flex;
    gap: 32px;
`;

const ReservationDetails = styled.div`
    width: 50%;
    display: flex;
    justify-content: space-between;
`;

const Labels = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: #767676;
    font-size: 16px;
    width: 45%;
    font-weight: 400;
`;

const Values = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: #767676;
    font-size: 16px;
    text-align: right;
    width: 45%;
    font-weight: 600;
`;

const ActionSection = styled.div`
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 20px;
`;

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    width: 90px;
    height: 90px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    background: ${props => props.variant === 'cancel' ? '#F6F6F6' : '#FFBC39'};
    color: ${props => props.variant === 'cancel' ? '#666' : 'white'};

    svg {
        width: 40px;
        height: 40px;
        path {
            fill: ${props => props.variant === 'cancel' ? '#666' : 'white'};
        }
    }

    &:hover {
        background: ${props => props.variant === 'cancel' ? '#EEEEEE' : '#FFB020'};
    }
`;

const HostReservationDetail = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching reservation ID:", reservationId);
                const res = await axios.get(`/api/host/reservation/${reservationId}`);
                console.log('호스트 예약 상세 정보:', res.data);
                setReservationData(res.data);
            } catch (err) {
                console.error('상세 정보 불러오기 실패:', err);
                setError('상세 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [reservationId]);

    // 상태 텍스트 변환
    const getStatusText = (status) => {
        if (status === 'RESERVED') return '예약완료';
        if (status === 'PENDING_PAYMENT') return '정산대기';
        if (status === 'COMPLETED_PAYMENT') return '정산완료';
        return status;
    };

    const handleChatClick = () => {
        if (reservationData) {
            // 토큰이 있는지 확인
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('로그인 정보를 찾을 수 없습니다.');
                alert('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
                return;
            }
            
            // 필수 정보인 kitchenId와 reservationId 확인
            if (!reservationData.kitchenId) {
                console.error('주의: kitchenId가 없습니다!', reservationData);
                alert('주방 정보가 없어 채팅을 시작할 수 없습니다.');
                return;
            }
            
            // 채팅방 이동 전 상세 정보 로깅
            console.log('호스트 채팅방 이동 시도:', {
                kitchenId: reservationData.kitchenId,
                reservationId: reservationData.reservationId,
                kitchenName: reservationData.kitchenName
            });
            
            // 백엔드 요구 사항에 맞게 정확한 값 전달
            // 호스트 채팅 엔드포인트에는 kitchenId, reservationId만 필요
            // 직접 URL 접근을 위해 쿼리 파라미터 추가
            const navigateState = {
                kitchenId: reservationData.kitchenId,
                reservationId: reservationData.reservationId,
                kitchenName: reservationData.kitchenName
            };
            
            console.log('navigate 호출:', {
                url: `/host-mypage/chats/direct?reservationId=${reservationData.reservationId}`,
                state: navigateState
            });
            
            navigate(`/host-mypage/chats/direct?reservationId=${reservationData.reservationId}`, {
                state: navigateState
            });
        }
    };

    const handleCompletedPayment = async () => {
        try {
            await axios.put(`/api/host/reservation/${reservationId}/complete`);
            window.location.reload();
        } catch (error) {
            console.error('정산 완료 처리 실패:', error);
            alert('정산 완료 처리에 실패했습니다.');
        }
    };

    if (loading) return <Container><HostSideBar activeMenu="예약 관리" /><ContentWrapper>로딩 중...</ContentWrapper></Container>;
    if (error) return <Container><HostSideBar activeMenu="예약 관리" /><ContentWrapper style={{color:'red'}}>{error}</ContentWrapper></Container>;
    if (!reservationData) return null;

    return (
        <Container>
            <HostSideBar activeMenu="예약 관리" />
            <ContentWrapper>
                <Title>상세 예약 내역</Title>
                <DetailCard>
                    <ReservationStatus status={reservationData.status}>{getStatusText(reservationData.status)}</ReservationStatus>
                    <TopSection>
                        <KitchenImage src={reservationData.kitchenImageUrl || kitchenImage} alt="주방 이미지" />
                        <KitchenInfo>
                            <KitchenName>{reservationData.kitchenName}</KitchenName>
                            <Address>{reservationData.kitchenLocation}</Address>
                            <DateTime>{reservationData.reservationDate} {reservationData.reservationTime} ({reservationData.clientNumber}인)</DateTime>
                        </KitchenInfo>
                    </TopSection>
                    <SectionTitle>예약 정보</SectionTitle>
                    <BottomSection>
                        <ReservationDetails>
                            <Labels>
                                <span>예약 번호</span>
                                <span>예약자 성함</span>
                                <span>예약자 연락처</span>
                                <span>선결제 금액</span>
                            </Labels>
                            <Values>
                                <span>{reservationData.reservationId}</span>
                                <span>{reservationData.clientName}</span>
                                <span>{reservationData.clientPhone}</span>
                                <span>{reservationData.prepaidAmount.toLocaleString()}원</span>
                            </Values>
                        </ReservationDetails>
                        <ActionSection>
                            <ActionButton variant="cancel">
                                <CancelIcon />
                                예약취소
                            </ActionButton>
                            <ActionButton onClick={handleChatClick}>
                                <MessageIcon />
                                채팅하기
                            </ActionButton>
                            <ActionButton onClick={handleCompletedPayment}>
                                <MoneyIcon />
                                정산완료
                            </ActionButton>
                        </ActionSection>
                    </BottomSection>
                </DetailCard>
            </ContentWrapper>
        </Container>
    );
};

export default HostReservationDetail; 