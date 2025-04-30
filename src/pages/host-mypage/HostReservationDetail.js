import React from 'react';
import styled from 'styled-components';
import HostSideBar from '../../components/HostSideBar';
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel.svg';
import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { ReactComponent as MoneyIcon } from '../../assets/icons/money.svg';
import kitchenImage from '../../assets/jpg/kitchen1.jpg';

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
`;

const DetailCard = styled.div`
    background: #FCFCFC;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 18px 30px 30px 30px;
    max-width: 750px;
`;

const ReservationStatus = styled.div`
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
    background: #FFBC39;
    padding: 8px 24px;
    border-radius: 6px;
`;

const TopSection = styled.div`
    display: flex;
    gap: 36px;
    margin-bottom: 42px;
`;

const KitchenImage = styled.img`
    width: 40%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
`;

const KitchenInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const KitchenName = styled.h3`
    font-size: 22px;
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
    font-size: 21px;
    margin-top: 32px;
    font-weight: 500;
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
    font-weight: 300;
`;

const Values = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: #767676;
    font-size: 16px;
    text-align: right;
    width: 45%;
    font-weight: 500;
`;

const ActionSection = styled.div`
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 16px;
`;

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    background: ${props => props.variant === 'cancel' ? '#F6F6F6' : '#FFBC39'};
    color: ${props => props.variant === 'cancel' ? '#666' : 'white'};

    svg {
        width: 36px;
        height: 36px;
        path {
            fill: ${props => props.variant === 'cancel' ? '#666' : 'white'};
        }
    }

    &:hover {
        background: ${props => props.variant === 'cancel' ? '#EEEEEE' : '#FFB020'};
    }
`;

const HostReservationDetail = () => {
    // 임시 데이터
    const reservationData = {
        id: 19980719,
        userName: "문민선",
        phoneNumber: "010-1111-2222",
        date: "2025.3.13",
        time: "15:00 ~ 17:00",
        people: 4,
        price: "80,000원",
        kitchenName: "파이브잇 쿠킹스튜디오",
        address: "서울 은평구 거북골로 135-2",
        status: "진행중"
    };

    return (
        <Container>
            <HostSideBar activeMenu="예약 관리" />
            <ContentWrapper>
                <Title>상세 예약 내역</Title>
                <DetailCard>
                    <ReservationStatus>결제완료</ReservationStatus>
                    
                    <TopSection>
                        <KitchenImage src={kitchenImage} alt="주방 이미지" />
                        <KitchenInfo>
                            <KitchenName>{reservationData.kitchenName}</KitchenName>
                            <Address>{reservationData.address}</Address>
                            <DateTime>{reservationData.date} {reservationData.time} ({reservationData.people}인)</DateTime>
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
                                <span>{reservationData.id}</span>
                                <span>{reservationData.userName}</span>
                                <span>{reservationData.phoneNumber}</span>
                                <span>{reservationData.price}</span>
                            </Values>
                        </ReservationDetails>
                        <ActionSection>
                            <ActionButton variant="cancel">
                                <CancelIcon />
                                예약취소
                            </ActionButton>
                            <ActionButton>
                                <MessageIcon />
                                채팅하기
                            </ActionButton>
                            <ActionButton>
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