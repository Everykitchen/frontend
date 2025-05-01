import styled from 'styled-components';

const MessageContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.isSender ? 'row-reverse' : 'row'};
    margin-bottom: 20px;
    padding: 0 20px;
`;

const MessageBubble = styled.div`
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
    background-color: ${props => props.isSender ? '#FFBC39' : '#F3F3F3'};
    color: ${props => props.isSender ? '#fff' : '#333'};
`;

const TimeStamp = styled.span`
    font-size: 12px;
    color: #888;
    align-self: flex-end;
    margin: ${props => props.isSender ? '0 12px 0 0' : '0 0 0 12px'};
`;

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${ampm} ${formattedHours}:${formattedMinutes}`;
};

const ChatMessage = ({ message, isHost }) => {
    const isSender = (isHost && message.role === 'host') || (!isHost && message.role === 'user');

    return (
        <MessageContainer isSender={isSender}>
            <MessageBubble isSender={isSender}>
                {message.chat}
            </MessageBubble>
            <TimeStamp isSender={isSender}>
                {formatTime(message.sentAt)}
            </TimeStamp>
        </MessageContainer>
    );
};

export default ChatMessage;