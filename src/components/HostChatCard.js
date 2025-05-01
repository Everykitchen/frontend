import styled from "styled-components";
import kitchenImage from "../assets/jpg/kitchen1.jpg";

const Card = styled.div`
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 8px;
    cursor: pointer;
    background: #fcfcfc;
    display: flex;
    gap: 24px;
    min-height: 180px;

    &:hover {
        background: #FAFAFA;
    }
`;

const KitchenImage = styled.img`
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
`;

const MainInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 2;
`;

const KitchenName = styled.div`
    font-size: 18px;
    font-weight: 500;
    margin-top: 12px;
    margin-bottom: 12px;
`;

const Location = styled.div`
    color: #666;
    font-size: 14px;
    margin-bottom: 24px;
`;

const UserInfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
`;

const UserName = styled.div`
    font-weight: 600;
    font-size: 20px;
`;

const RecentReservationBox = styled.div`
    display: inline-block;
    background: #F3F3F3;
    color: #888;
    font-size: 12px;
    border-radius: 4px;
    padding: 2px 8px;
    margin-left: 8px;
`;

const Status = styled.div`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 400;
    background-color: ${props => props.status === '예약중' ? '#FFBC39' : '#9B9B9B'};
    color: white;
    width: fit-content;
`;

const RightSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-width: 200px;
    padding-left: 0;
    margin-bottom: 18px;
    margin-right: 18px;
`;

const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 400;

`;

const RecentChatLabel = styled.div`
    font-size: 15px;
    font-weight: 600;
`;

const RecentChatTime = styled.div`
    color: #888;
    font-size: 13px;
`;

const LastMessage = styled.div`
    color: #333;
    font-size: 14px;
    font-weight: 400;
    word-break: break-all;
    line-height: 1.4;
`;

function getDaysAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff === 0 ? '오늘' : `${diff}일전`;
}

const HostChatCard = ({ chat, onClick }) => {
    const formatRecentReservation = (dateString) => {
        const date = new Date(dateString);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        // 임시로 시간과 인원 하드코딩 (실제로는 chat 객체에서 받아와야 함)
        const time = "15:00 ~ 17:00";
        const people = chat.people || 2;
        return `최근 예약: ${y}.${m}.${d}  ${time} (${people}인)`;
    };

    return (
        <Card onClick={onClick}>
            <KitchenImage src={kitchenImage} alt="주방 이미지" />
            <ContentWrapper>
                <MainInfo>
                    <KitchenName>{chat.kitchenName}</KitchenName>
                    <Location>{chat.kitchenLocation}</Location>
                    <UserInfoRow>
                        <UserName>{chat.userName}</UserName>
                        <RecentReservationBox>
                            {formatRecentReservation(chat.lastReservationDate)}
                        </RecentReservationBox>
                    </UserInfoRow>
                    <Status status={chat.status}>{chat.status}</Status>
                </MainInfo>
                <RightSection>
                    <ChatHeader>
                        <RecentChatLabel>최근 채팅</RecentChatLabel>
                        <RecentChatTime>{getDaysAgo(chat.lastMessageTime)}</RecentChatTime>
                    </ChatHeader>
                    <LastMessage>{chat.lastMessage}</LastMessage>
                </RightSection>
            </ContentWrapper>
        </Card>
    );
};

export default HostChatCard; 