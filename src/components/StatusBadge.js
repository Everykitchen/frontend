import styled from "styled-components";

const Badge = styled.div`
    width: 40px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 12px;
    color: white;
    background-color: ${(props) =>
        props.status === "진행중" ? "#4CAF50" : "#FF9800"};
`;

const StatusBadge = ({ status }) => {
    return <Badge status={status}>{status}</Badge>;
};

export default StatusBadge;
