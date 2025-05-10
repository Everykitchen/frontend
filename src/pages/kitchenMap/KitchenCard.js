import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const Card = styled.div`
    position: relative;
    padding: 16px;
    border: 2px solid ${({ isactive }) => (isactive ? "#ffbc39" : "#ddd")};
    border-radius: 12px;
    background: white;
    cursor: pointer;
    box-shadow: ${({ isactive }) =>
        isactive
            ? "0 0 0 3px rgba(255,188,57,0.3)"
            : "0 2px 6px rgba(0, 0, 0, 0.05)"};
    transition: all 0.2s;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h3`
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: bold;
    color: #222;
`;

const Location = styled.p`
    margin: 0 0 6px;
    font-size: 14px;
    color: #666;
`;

const Price = styled.div`
    font-size: 13px;
    color: #333;
`;

const Tag = styled.span`
    font-size: 12px;
    padding: 2px 6px;
    background: ${({ category }) =>
        category === "COOKING" ? "#4CAF50" : "#FF9800"};
    border-radius: 6px;
    color: white;
    margin-left: 6px;
`;

const Rating = styled.div`
    position: absolute;
    top: 12px;
    right: 16px;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #555;
    gap: 4px;
`;

const StarIcon = styled(FaStar)`
    color: #ffc107;
`;

const KitchenCard = ({ kitchen, isactive, onClick }) => (
    <Card isactive={isactive} onClick={onClick}>
        <Rating>
            <StarIcon />
            {kitchen.avgStar || 0} ({kitchen.reviewCount || 0})
        </Rating>
        <Info>
            <Title>
                {kitchen.kitchenName}
                {kitchen.category && (
                    <Tag category={kitchen.category}>
                        {kitchen.category === "COOKING" ? "쿠킹" : "베이킹"}
                    </Tag>
                )}
            </Title>
            <Location>{kitchen.location}</Location>
            <Price>{kitchen.minPrice?.toLocaleString()}원~</Price>
        </Info>
    </Card>
);

export default KitchenCard;
