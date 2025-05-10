import styled from "styled-components";

const Card = styled.div`
    border: 2px solid ${({ isActive }) => (isActive ? "#ffbc39" : "#ddd")};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    background: white;
    cursor: pointer;
    box-shadow: ${({ isActive }) =>
        isActive
            ? "0 0 0 3px rgba(255,188,57,0.3)"
            : "0 2px 6px rgba(0, 0, 0, 0.05)"};
`;

const Title = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: bold;
`;

const Location = styled.p`
    margin: 4px 0;
    font-size: 14px;
    color: #666;
`;

const KitchenCard = ({ kitchen, isActive, onClick }) => (
    <Card isActive={isActive} onClick={onClick}>
        <h3>{kitchen.kitchenName}</h3>
        <p>{kitchen.location}</p>
    </Card>
);

export default KitchenCard;
