import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const Card = styled.div`
    position: relative;
    padding: 16px;
    margin-bottom: 10px;
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
    gap: 6px;
`;

const TitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #222;
    flex: 1;
    word-break: keep-all;
`;

const TagContainer = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

const Tag = styled.span`
    display: inline-block;
    font-size: 11px;
    padding: 2px 8px;
    background: ${({ category }) =>
        category === "COOKING" ? "#FF9800" : "#4CAF50"};
    border-radius: 12px;
    color: white;
    white-space: nowrap;
`;

const Location = styled.p`
    margin: 0;
    font-size: 14px;
    color: #666;
`;

const Price = styled.div`
    font-size: 13px;
    color: #333;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #555;
    white-space: nowrap;
`;

const StarIcon = styled(FaStar)`
    color: #ffc107;
    flex-shrink: 0;
`;

const KitchenCard = ({ kitchen, isactive, onClick }) => (
    <Card isactive={isactive} onClick={onClick}>
        <Info>
            <TitleRow>
                <Title>{kitchen.kitchenName}</Title>
                <Rating>
                    <StarIcon />
                    {kitchen.avgStar || 0} ({kitchen.reviewCount || 0})
                </Rating>
            </TitleRow>

            <TagContainer>
                {kitchen.category && (
                    <Tag category={kitchen.category}>
                        {kitchen.category === "COOKING" ? "쿠킹" : "베이킹"}
                    </Tag>
                )}
            </TagContainer>

            <Location>{kitchen.location}</Location>
            <Price>{kitchen.minPrice?.toLocaleString()}원~</Price>
        </Info>
    </Card>
);

export default KitchenCard;
