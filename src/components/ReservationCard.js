import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import kitchenImage from "../assets/jpg/kitchen1.jpg";

/**
 * 예약 내역 목록에서 각 예약을 표시하는 카드 컴포넌트
 *
 * 주요 기능:
 * - 예약 정보를 카드 형태로 표시
 * - 예약 상태에 따른 뱃지 표시 (진행중, 완료)
 * - 호버 효과로 사용자 인터랙션 제공
 * - 클릭 시 해당 예약의 상세 페이지로 이동
 * - 이미지 로드 실패 시 기본 이미지 제공
 *
 * HostReservationCard와 디자인 일관성을 유지하여 사용자 경험 향상
 *
 * Props:
 * - reservation: 예약 정보 객체 (필수)
 */
const Card = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    cursor: pointer;
    background: #fcfcfc;
    display: flex;
    gap: 30px;
    width: 100%;
    height: 130px;

    &:hover {
        background: #fafafa;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
        transition: all 0.2s ease;
    }
`;

const KitchenImage = styled.img`
    width: 160px;
    height: 100px;
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
    position: relative;
`;

const ReservationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
`;

const ReservationNumber = styled.div`
    color: #666;
    font-size: 13px;
    font-weight: 400;
`;

const KitchenName = styled.div`
    font-size: 18px;
    font-weight: 600;
`;

const UserName = styled.div`
    font-size: 16px;
    font-weight: 500;
`;

const DateTime = styled.div`
    color: #666;
    font-size: 18px;
    font-weight: 400;
`;

const Location = styled.div`
    color: #666;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 8px;
`;

const Status = styled.div`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    width: fit-content;
    background: ${(props) => getStatusColor(props.status)};
    color: white;
    position: absolute;
    top: 0;
    right: 0;
`;

const getStatusColor = (status) => {
    switch (status) {
        case "예약대기":
            return "#FF6B6B"; // 레드오렌지
        case "예약완료":
            return "#FFBC39"; // 노랑
        case "정산대기":
            return "#FF914D"; // 초록
        case "정산완료":
            return "#9B9B9B"; // 회색
        default:
            return "#999999";
    }
};

const ReservationCard = ({ reservation }) => {
    const navigate = useNavigate();

    // 이미지 에러 핸들러: 로드 실패 시 기본 이미지로 대체
    const handleImgError = (e) => {
        e.target.src = kitchenImage;
    };

    /**
     * 예약 상태 코드를 UI에 표시할 라벨로 변환
     * @param {string} status 예약 상태 코드
     * @returns {string} UI에 표시할 상태 텍스트
     */
    const mapStatusToLabel = (status) => {
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

    /**
     * 주소를 간략하게 표시 (앞 두 단어만)
     * @param {string} location 전체 주소
     * @returns {string} 축약된 주소
     */
    const formatLocation = (location) => {
        if (!location) return "";
        const words = location.split(" ");
        return words.slice(0, 2).join(" ");
    };

    /**
     * 날짜, 시간, 인원을 포함한 예약 시간 정보 포맷
     * @returns {string} 포맷된 예약 시간 정보
     */
    const formatDateTime = () => {
        // 날짜가 없거나 시간이 없는 경우 빈 문자열 반환
        if (!reservation.reservationDate || !reservation.reservationTime) {
            return "";
        }

        // 인원수
        const people = reservation.numberOfPeople || reservation.people || 0;

        return `${reservation.reservationDate} ${reservation.reservationTime} (${people}인)`;
    };

    return (
        <Card
            onClick={() =>
                navigate(`/mypage/reservations/${reservation.reservationId}`)
            }
        >
            <KitchenImage
                src={reservation.kitchenImageUrl || kitchenImage}
                alt="주방 이미지"
                onError={handleImgError}
            />
            <ContentWrapper>
                <ReservationInfo>
                    <ReservationNumber>
                        예약번호 {reservation.reservationId}
                    </ReservationNumber>
                    <KitchenName>{reservation.kitchenName}</KitchenName>
                    <Location>
                        {formatLocation(reservation.kitchenLocation)}
                    </Location>
                    <DateTime>
                        {reservation.reservationDate}{" "}
                        {reservation.reservationTime} (
                        {reservation.clientNumber}인)
                    </DateTime>
                    {reservation.clientName && (
                        <UserName>{reservation.clientName} 님</UserName>
                    )}
                </ReservationInfo>
                <Status status={mapStatusToLabel(reservation.status)}>
                    {mapStatusToLabel(reservation.status)}
                </Status>
            </ContentWrapper>
        </Card>
    );
};

export default ReservationCard;
