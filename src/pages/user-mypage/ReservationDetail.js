import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/UserSideBar";
import { ReactComponent as MessageIcon } from "../../assets/icons/message.svg";
import { ReactComponent as MapIcon } from "../../assets/icons/mapIcon.svg";
import { ReactComponent as MoneyIcon } from "../../assets/icons/money.svg";
import informationIcon from "../../assets/icons/information.png";
import backIcon from "../../assets/icons/back.png";
import api from "../../api/axiosInstance";
import useKakaoLoader from "../../hooks/useKakaoLoader";

/**
 * 사용자의 예약 상세 정보를 표시하는 페이지 컴포넌트입니다.
 *
 * 주요 기능:
 * - 예약번호를 기준으로 상세 정보를 로드하여 표시
 * - 주방 위치를 지도로 확인할 수 있는 기능
 * - 예약자와 호스트 간 채팅 기능
 * - 정산 기능으로 이동
 * - 주소 복사 및 주방 정보 확인 기능
 *
 * HostReservationDetail과 유사한 UI를 유지하되
 * 사용자 관점의 기능과 UI로 조정되어 있습니다.
 */

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: white;
`;

const ContentWrapper = styled.div`
    flex: 1;
    padding: 40px;
    padding-left: 100px;
    padding-right: 100px;
    margin-top: 30px;
`;

const TitleSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 24px;
        height: 24px;
    }

    &:hover {
        opacity: 0.8;
    }
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    text-align: left;
`;

const DetailCard = styled.div`
    background: #fcfcfc;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 18px 30px 0px 30px;
    min-width: 700px;
    max-width: 1500px;
    width: 100%;
`;

const ReservationStatus = styled.div`
    display: inline-block;
    font-size: 16px;
    font-weight: 600;
    width: 90px;
    color: white;
    background: ${(props) => getStatusColor(props.status)};
    padding: 6px 14px;
    border-radius: 6px;
    text-align: center;
    margin-bottom: 20px;
`;

const TopSection = styled.div`
    display: flex;
    gap: 36px;
    margin-bottom: 42px;
`;

const KitchenImage = styled.img`
    width: 45%;
    height: 240px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
`;

const KitchenInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
`;

const KitchenName = styled.h3`
    font-size: 22px;
    font-weight: 600;
`;

const Address = styled.p`
    color: #767676;
    font-weight: 400;
    font-size: 16px;
    position: relative;
    margin-bottom: 30px;
`;

const CopyButton = styled.button`
    background-color: transparent;
    color: #ffbc39;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
    margin-left: 20px;

    &:hover {
        text-decoration: underline;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: clamp(8px, 3%, 20px);
    margin-top: 24px;
    margin-bottom: 8px;
    width: 100%;
`;

const SmallActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 12px 8px;
    aspect-ratio: 1/1;
    flex: 1;
    min-width: 70px;
    max-width: 100px;
    height: auto;
    border-radius: 8px;
    font-size: clamp(16px, 0.9vw, 18px);
    font-weight: 600;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border: none;
    background: ${(props) => {
        if (props.disabled) return "#F6F6F6";
        return props.variant === "primary" ? "#FFBC39" : "#F6F6F6";
    }};
    color: ${(props) => {
        if (props.disabled) return "#BDBDBD";
        return props.variant === "primary" ? "white" : "#666";
    }};
    opacity: ${(props) => (props.disabled ? 0.7 : 1)};

    svg {
        width: clamp(30px, 3.5vw, 40px);
        height: clamp(30px, 3.5vw, 40px);
        path {
            fill: ${(props) => {
                if (props.disabled) return "#BDBDBD";
                return props.variant === "primary" ? "white" : "#666";
            }};
        }
    }

    img {
        width: clamp(30px, 3.5vw, 40px);
        height: clamp(30px, 3.5vw, 40px);
        object-fit: contain;
        opacity: ${(props) => (props.disabled ? 0.7 : 1)};
    }

    &:hover {
        background: ${(props) => {
            if (props.disabled) return "#F6F6F6";
            return props.variant === "primary" ? "#FFB020" : "#EEEEEE";
        }};
        color: ${(props) => {
            if (props.disabled) return "#BDBDBD";
            return props.variant === "primary" ? "white" : "#333";
        }};

        svg path {
            fill: ${(props) => {
                if (props.disabled) return "#BDBDBD";
                return props.variant === "primary" ? "white" : "#333";
            }};
        }
    }

    @media (max-width: 768px) {
        font-size: 14px;
        gap: 8px;

        svg,
        img {
            width: 24px;
            height: 24px;
        }
    }
`;

const BottomSection = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 32px;
    gap: clamp(32px, 10%, 120px);
    flex-wrap: wrap;
`;

const InfoSection = styled.div`
    flex: 1;
    min-width: 280px;
    display: flex;
    flex-direction: column;
`;

const SectionTitle = styled.h4`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 28px;
    color: #333;
`;

const InfoContainer = styled.div`
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

const PendingPayment = styled.span`
    color: #ff7926;
    font-weight: 700;
`;

const TotalPayment = styled.span`
    color: #333;
    font-weight: 700;
    font-size: 18px;
`;

const CancellationNotice = styled.p`
    color: #666;
    font-size: 14px;
    text-align: right;
    margin-top: 30px;
    margin-bottom: 8px;
    font-style: italic;
`;

const CancelButton = styled.button`
    background-color: #fff0e6;
    color: #ff7926;
    font-size: 16px;
    font-weight: 600;
    padding: 14px 0;
    border-radius: 8px;
    cursor: not-allowed;
    border: none;
    width: 120px;
    text-align: center;
    opacity: 0.7;
`;

const ActionSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    align-items: flex-end;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
`;

const CloseButton = styled.button`
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;

    &:hover {
        color: #333;
    }
`;

const MapContainer = styled.div`
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    .map-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.8);
        z-index: 5;
        font-weight: 500;
        color: #666;
    }
`;
const getStatusColor = (status) => {
    switch (status) {
        case "PENDING_RESERVED":
            return "#FF6B6B"; // 예약대기
        case "RESERVED":
            return "#FFBC39"; // 예약완료
        case "PENDING_PAYMENT":
            return "#44C767"; // 정산대기
        case "COMPLETED_PAYMENT":
            return "#9B9B9B"; // 정산완료
        default:
            return "#999999"; // fallback
    }
};

const ReservationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);
    const mapRef = useRef(null);

    const loaded = useKakaoLoader();

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/user/reservation/${id}`);
                console.log("예약 상세 정보:", response.data);

                // 좌표가 없으면 서울 좌표로 기본값 설정
                const data = response.data;
                if (!data.latitude || !data.longitude) {
                    data.latitude = 37.5665; // 서울 기본 좌표
                    data.longitude = 126.978;
                }

                setReservation(data);
            } catch (error) {
                console.error("예약 상세 정보 로드 실패:", error);
                setError("상세 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    // 지도 초기화 및 표시 함수
    useEffect(() => {
        if (!loaded || !showMap || !mapRef.current || !reservation) return;

        // 지도 초기화 시작
        setMapLoading(true);

        try {
            // 이전에 생성된 지도 요소 정리
            if (mapRef.current) {
                mapRef.current.innerHTML = "";
            }

            // 지연 처리로 DOM이 준비된 후 지도 생성
            const timer = setTimeout(() => {
                try {
                    const coords = new window.kakao.maps.LatLng(
                        reservation.latitude,
                        reservation.longitude
                    );

                    const mapOptions = {
                        center: coords,
                        level: 3,
                    };

                    // 지도 객체 생성
                    const map = new window.kakao.maps.Map(
                        mapRef.current,
                        mapOptions
                    );

                    // 마커 생성
                    const marker = new window.kakao.maps.Marker({
                        position: coords,
                    });
                    marker.setMap(map);

                    // 상호명 표시
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;">${reservation.kitchenName}</div>`,
                    });
                    infowindow.open(map, marker);

                    // 지도 크기 재조정 처리
                    setTimeout(() => {
                        map.relayout();
                        map.setCenter(coords);
                        setMapLoading(false);
                    }, 200);
                } catch (mapError) {
                    console.error("지도 초기화 중 오류 발생:", mapError);
                    setMapLoading(false);
                }
            }, 100);

            return () => clearTimeout(timer);
        } catch (err) {
            console.error("지도 생성 오류:", err);
            setMapLoading(false);
        }
    }, [loaded, showMap, reservation]);

    const getStatusText = (status) => {
        switch (status) {
            case "PENDING_RESERVED":
                return "예약대기";
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
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("로그인 정보를 찾을 수 없습니다.");
                alert("로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
                return;
            }

            // 필수 정보인 kitchenId와 reservationId 확인
            if (!reservation.kitchenId) {
                console.error("주의: kitchenId가 없습니다!", reservation);
                alert("주방 정보가 없어 채팅을 시작할 수 없습니다.");
                return;
            }

            // 채팅방 이동 전 상세 정보 로깅
            console.log("채팅방 이동 시도:", {
                kitchenId: reservation.kitchenId,
                reservationId: reservation.reservationId,
                kitchenName: reservation.kitchenName,
            });

            // 백엔드 요구 사항에 맞게 정확한 값 전달
            const navigateState = {
                kitchenId: reservation.kitchenId,
                reservationId: reservation.reservationId,
                kitchenName: reservation.kitchenName,
            };

            console.log("navigate 호출:", {
                url: `/mypage/chats/direct?reservationId=${reservation.reservationId}`,
                state: navigateState,
            });

            navigate(
                `/mypage/chats/direct?reservationId=${reservation.reservationId}`,
                {
                    state: navigateState,
                }
            );
        }
    };

    const handleSettlementClick = () => {
        if (reservation?.reservationId && reservation?.kitchenId) {
            navigate(
                `/mypage/ingredient-settlement/${reservation.reservationId}`,
                {
                    state: { kitchenId: reservation.kitchenId },
                }
            );
        } else {
            alert("정산에 필요한 정보가 없습니다.");
        }
    };

    const handleCopyAddress = () => {
        if (reservation?.kitchenLocation) {
            navigator.clipboard
                .writeText(reservation.kitchenLocation)
                .then(() => {
                    alert("주소가 클립보드에 복사되었습니다.");
                })
                .catch((err) => {
                    console.error("주소 복사 실패:", err);
                    alert("주소 복사에 실패했습니다.");
                });
        }
    };

    const handleShowMap = () => {
        setShowMap(true);
    };

    const handleKitchenInfo = () => {
        if (reservation?.kitchenId) {
            navigate(`/kitchen/${reservation.kitchenId}`);
        } else {
            alert("주방 정보를 찾을 수 없습니다.");
        }
    };

    if (loading)
        return (
            <Container>
                <Sidebar activeMenu="예약 내역" />
                <ContentWrapper>로딩 중...</ContentWrapper>
            </Container>
        );
    if (error)
        return (
            <Container>
                <Sidebar activeMenu="예약 내역" />
                <ContentWrapper style={{ color: "red" }}>
                    {error}
                </ContentWrapper>
            </Container>
        );
    if (!reservation) return null;

    return (
        <Container>
            <Sidebar activeMenu="예약 내역" />
            <ContentWrapper>
                <TitleSection>
                    <BackButton onClick={goBack}>
                        <img src={backIcon} alt="뒤로 가기" />
                    </BackButton>
                    <Title>상세 예약 내역</Title>
                </TitleSection>
                <DetailCard>
                    <ReservationStatus status={reservation.status}>
                        {getStatusText(reservation.status)}
                    </ReservationStatus>
                    <TopSection>
                        <KitchenImage
                            src={reservation.kitchenImageUrl}
                            alt="주방 이미지"
                        />
                        <KitchenInfo>
                            <KitchenName>{reservation.kitchenName}</KitchenName>
                            <Address>
                                {reservation.kitchenLocation}
                                <CopyButton onClick={handleCopyAddress}>
                                    주소복사
                                </CopyButton>
                            </Address>
                            <ActionButtons>
                                <SmallActionButton onClick={handleShowMap}>
                                    <MapIcon />
                                    지도조회
                                </SmallActionButton>
                                <SmallActionButton onClick={handleKitchenInfo}>
                                    <img
                                        src={informationIcon}
                                        alt="주방 정보"
                                        style={{
                                            filter: "brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(222deg) brightness(92%) contrast(86%)",
                                        }}
                                    />
                                    주방 정보
                                </SmallActionButton>
                                <SmallActionButton
                                    variant="primary"
                                    onClick={handleChatClick}
                                >
                                    <MessageIcon />
                                    채팅하기
                                </SmallActionButton>
                                <SmallActionButton
                                    variant="primary"
                                    onClick={handleSettlementClick}
                                    disabled={
                                        reservation.status ===
                                        "COMPLETED_PAYMENT"
                                    }
                                >
                                    <MoneyIcon />
                                    정산하기
                                </SmallActionButton>
                            </ActionButtons>
                        </KitchenInfo>
                    </TopSection>

                    <BottomSection>
                        <InfoSection>
                            <SectionTitle>예약 정보</SectionTitle>
                            <InfoContainer>
                                <Labels>
                                    <span>예약 번호</span>
                                    <span>예약 날짜</span>
                                    <span>예약 인원</span>
                                    <span>예약자 성함</span>
                                    <span>주방 연락처</span>
                                </Labels>
                                <Values>
                                    <span>{reservation.reservationId}</span>
                                    <span>
                                        {reservation.reservationDate}{" "}
                                        {reservation.reservationTime}
                                    </span>
                                    <span>{reservation.clientNumber}인</span>
                                    <span>{reservation.clientName}</span>
                                    <span>{reservation.hostPhone}</span>
                                </Values>
                            </InfoContainer>
                        </InfoSection>

                        <InfoSection>
                            <SectionTitle>결제 정보</SectionTitle>
                            <InfoContainer>
                                <Labels>
                                    <span>선결제 금액</span>
                                    {reservation.status ===
                                        "COMPLETED_PAYMENT" && (
                                        <>
                                            <span>후결제 금액</span>
                                            <span>최종 결제 금액</span>
                                        </>
                                    )}
                                    {reservation.status !==
                                        "COMPLETED_PAYMENT" && (
                                        <span>후결제 금액</span>
                                    )}
                                </Labels>
                                <Values>
                                    <span>
                                        {reservation.prepaidAmount.toLocaleString()}
                                        원
                                    </span>
                                    {reservation.status ===
                                    "COMPLETED_PAYMENT" ? (
                                        <>
                                            <span>
                                                {reservation.postpaidAmount.toLocaleString()}
                                                원
                                            </span>
                                            <TotalPayment>
                                                {(
                                                    reservation.prepaidAmount +
                                                    reservation.postpaidAmount
                                                ).toLocaleString()}
                                                원
                                            </TotalPayment>
                                        </>
                                    ) : (
                                        <PendingPayment>
                                            {reservation.status ===
                                            "PENDING_PAYMENT"
                                                ? "호스트 승인대기"
                                                : "정산예정"}
                                        </PendingPayment>
                                    )}
                                </Values>
                            </InfoContainer>

                            <ActionSection>
                                {reservation.status !== "COMPLETED_PAYMENT" && (
                                    <CancellationNotice>
                                        예약 취소는 채팅으로 문의해주세요.
                                    </CancellationNotice>
                                )}
                                <CancelButton disabled>예약취소</CancelButton>
                            </ActionSection>
                        </InfoSection>
                    </BottomSection>
                </DetailCard>

                {showMap && (
                    <Modal>
                        <ModalContent>
                            <ModalHeader>
                                <ModalTitle>
                                    {reservation.kitchenName} 위치
                                </ModalTitle>
                                <CloseButton onClick={() => setShowMap(false)}>
                                    ×
                                </CloseButton>
                            </ModalHeader>
                            <MapContainer ref={mapRef}>
                                {mapLoading && (
                                    <div className="map-loading">
                                        지도를 불러오는 중...
                                    </div>
                                )}
                            </MapContainer>
                        </ModalContent>
                    </Modal>
                )}
            </ContentWrapper>
        </Container>
    );
};

export default ReservationDetail;
