import React from "react";
import styled from "styled-components";
import defaultKitchenImage from "../../assets/jpg/kitchen1.jpg";

const InfoSidebar = styled.div`
    width: 280px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 21px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const SidebarImage = styled.img`
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 12px;
`;

const SidebarTitle = styled.h3`
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: bold;
    color: #222;
`;

const SidebarLocation = styled.p`
    margin: 0 0 8px;
    font-size: 14px;
    color: #666;
`;

const SidebarPrice = styled.p`
    margin: 0 0 8px;
    font-size: 14px;
    color: #333;
`;

const SidebarRating = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #555;
    margin-bottom: 8px;
`;

const StarIcon = styled.span`
    color: #ffc107;
`;

const Tag = styled.span`
    display: inline-block;
    font-size: 11px;
    padding: 2px 8px;
    background: ${({ category }) =>
        category === "COOKING" ? "#FF9800" : "#4CAF50"};
    border-radius: 12px;
    color: white;
    margin-bottom: 8px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0px;
    right: 0px;
    border: none;
    color: gray;
    font-size: 18px;
    cursor: pointer;
`;

export default function KitchenInfo({ kitchen, onClose, onDetailClick }) {
    if (!kitchen) return null;

    const handleClick = (e) => {
        e.stopPropagation();
        onDetailClick?.();
    };

    return (
        <InfoSidebar onClick={handleClick}>
            <CloseButton onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}>&times;</CloseButton>
            <SidebarImage src={kitchen.imageUrl || defaultKitchenImage} alt="주방 사진" />
            <SidebarTitle>{kitchen.kitchenName}</SidebarTitle>
            <SidebarRating>
                <StarIcon>★</StarIcon>
                {kitchen.avgStar || 0} ({kitchen.reviewCount || 0})
            </SidebarRating>
            <Tag category={kitchen.category}>
                {kitchen.category === "COOKING" ? "쿠킹" : "베이킹"}
            </Tag>
            <SidebarLocation>{kitchen.location}</SidebarLocation>
            <SidebarPrice>{kitchen.minPrice?.toLocaleString()}원~</SidebarPrice>
        </InfoSidebar>
    );
}
