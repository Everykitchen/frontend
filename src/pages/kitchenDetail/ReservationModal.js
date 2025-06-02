import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { format } from "date-fns";
import useKakaoLink from "../../hooks/useKakaoLink";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 24px;
    border-radius: 10px;
    width: 400px;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 24px;
    top: 24px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    color: #666;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
`;

const InfoItem = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
        margin-bottom: 24px;
    }
`;

const Label = styled.div`
    font-size: 14px;
    color: #666;
`;

const Value = styled.div`
    font-size: 16px;
    color: #333;
    text-align: right;
`;

const ConfirmButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 12px;
    font-weight: bold;
    border-radius: 10px;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    margin-top: 12px;
`;

const ConfirmationModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 10px;
    width: 350px;
    z-index: 100000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ConfirmationOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
`;

const ConfirmationTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 20px;
    text-align: center;
    color: #333;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
`;

const ConfirmationButton = styled.button`
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    
    &.yes {
        background-color: #ffbc39;
        color: white;
        &:hover {
            background-color: #ffa500;
        }
    }
    
    &.no {
        background-color: #f5f5f5;
        color: #666;
        &:hover {
            background-color: #e5e5e5;
        }
    }
`;

const ReservationModal = ({
    isOpen,
    onClose,
    kitchenId,
    kitchenName,
    reservationDate,
    startTime,
    endTime,
    guestCount,
    totalPrice,
    selectedIds,
    userName,
    accountNumber,
    bankName,
    accountHolderName,
    onReservationSuccess,
}) => {
    useKakaoLink();
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [kakaoMessage, setKakaoMessage] = useState("");

    // 모달이 열리면 body 스크롤 막기
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 요일 구하기
    const getDayOfWeek = (date) => {
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return days[date.getDay()];
    };

    const sendKakaoMessage = () => {
        const message =
            `[에브리키친 예약 안내]\n` +
            `주방명: ${kitchenName}\n` +
            `예약자: ${userName}\n` +
            `날짜: ${format(reservationDate, "yyyy.MM.dd")} (${getDayOfWeek(
                reservationDate
            )})\n` +
            `시간: ${startTime}:00 ~ ${endTime}:00\n` +
            `인원: ${guestCount}명\n` +
            `금액: ₩${totalPrice.toLocaleString()}\n\n` +
            `계좌: ${bankName} ${accountNumber} (${accountHolderName})\n` +
            `※ 송금 후 입금확인되면 예약이 확정됩니다.`;

        setKakaoMessage(message);
        window.Kakao.Link.sendDefault({
            objectType: "text",
            text: message,
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
            buttons: [
                {
                    title: "예약 페이지 바로가기",
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
        setShowConfirmation(true);
    };

    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            try {
                const payload = {
                    availableIds: selectedIds,
                    clientNumber: guestCount,
                };

                const response = await axios.post(
                    `/api/user/kitchen/${kitchenId}/reservation`,
                    payload
                );

                alert("예약이 완료되었습니다.");
                navigate("/mypage/reservations");
            } catch (error) {
                console.error("예약 실패:", error);
                alert("예약에 실패했습니다. 다시 시도해주세요.");
            }
        } else {
            // "아니오" 선택 시 다시 카카오톡 메시지 전송
            window.Kakao.Link.sendDefault({
                objectType: "text",
                text: kakaoMessage,
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
                buttons: [
                    {
                        title: "예약 페이지 바로가기",
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        }
        setShowConfirmation(false);
    };

    // Portal을 사용하여 모달을 root 레벨에서 렌더링
    return ReactDOM.createPortal(
        <>
            <ModalOverlay onClick={onClose}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <CloseButton onClick={onClose}>×</CloseButton>
                    <Title>예약 확인</Title>

                    <InfoItem>
                        <Label>주방명</Label>
                        <Value>{kitchenName}</Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>예약자명</Label>
                        <Value>{userName}</Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>예약일자</Label>
                        <Value>
                            {format(reservationDate, "yyyy.MM.dd")}(
                            {getDayOfWeek(reservationDate)})
                        </Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>예약시간</Label>
                        <Value>
                            {startTime}:00 ~ {endTime}:00
                        </Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>예약인원</Label>
                        <Value>{guestCount}명</Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>대여료</Label>
                        <Value>₩{totalPrice.toLocaleString()}</Value>
                    </InfoItem>

                    <ConfirmButton
                        onClick={sendKakaoMessage}
                        style={{ backgroundColor: "#44c400" }}
                    >
                        카카오톡으로 송금 안내 받기
                    </ConfirmButton>
                </ModalContent>
            </ModalOverlay>

            {showConfirmation && (
                <>
                    <ConfirmationOverlay onClick={() => setShowConfirmation(false)} />
                    <ConfirmationModal onClick={(e) => e.stopPropagation()}>
                        <CloseButton 
                            onClick={() => setShowConfirmation(false)}
                            style={{ right: "12px", top: "12px" }}
                        >
                            ×
                        </CloseButton>
                        <ConfirmationTitle>
                            카카오톡으로 송금 안내 메시지를 전송하셨나요?
                        </ConfirmationTitle>
                        <ButtonGroup>
                            <ConfirmationButton 
                                className="yes"
                                onClick={() => handleConfirmation(true)}
                            >
                                네
                            </ConfirmationButton>
                            <ConfirmationButton 
                                className="no"
                                onClick={() => handleConfirmation(false)}
                            >
                                아니오
                            </ConfirmationButton>
                        </ButtonGroup>
                    </ConfirmationModal>
                </>
            )}
        </>,
        document.body
    );
};

export default ReservationModal;
