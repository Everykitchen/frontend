import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "./Logo";

import mapIcon from "../assets/icons/mapIcon.svg";
import calendarIcon from "../assets/icons/calendarIcon.svg";
import heartIcon from "../assets/icons/heartIcon.svg";
import userIcon from "../assets/icons/userIcon.svg";
import searchIcon from "../assets/icons/searchIcon.svg";

const HeaderWrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 30px;
    background-color: white;
    border-bottom: 1px solid #ddd;
`;

const SearchSection = styled.div`
    position: relative;
    width: 400px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 20px 8px 20px; 
    border-radius: 30px;
    border: 1px solid #ddd;
    font-size: 14px;
    background-color: #f3f3f3;
    text-align: left;

    &:focus {
        outline: none;
        border-color: #ffbc39;
        background-color: #fff;
    }

    &::placeholder {
        color: #aaa;
        font-size: 14px;
    }
`;

const SearchIcon = styled.img`
    position: absolute;
    right: 1px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

const IconSection = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const IconLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const IconImg = styled.img`
    width: 20px;
    height: 20px;
`;

const Navbar = () => {
    return (
        <HeaderWrapper>
            <Logo />
            <SearchSection>
                <SearchInput placeholder="찾으시는 주방을 검색해보세요! " />
                <SearchIcon src={searchIcon} alt="검색" />
                </SearchSection>
            <IconSection>
                <IconLink to="/map">
                    <IconImg src={mapIcon} alt="지도" />
                </IconLink>
                <IconLink to="/calendar">
                    <IconImg src={calendarIcon} alt="달력" />
                </IconLink>
                <IconLink to="/favorites">
                    <IconImg src={heartIcon} alt="찜" />
                </IconLink>
                <IconLink to="/profile">
                    <IconImg src={userIcon} alt="프로필" />
                </IconLink>
            </IconSection>
        </HeaderWrapper>
    );
};

export default Navbar;
