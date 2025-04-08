import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import orangeCircle from "../assets/icons/orangeDot.svg";

const SidebarContainer = styled.div`
    width: 240px;
    background-color: white;
    border-right: 1px solid #ddd;
    padding: 40px 30px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Underline = styled.div`
    width: 100%;
    max-width: 100px;
    height: 4px;
    background-color: #ffbc39;
    margin-bottom: 32px;
    border-radius: 2px;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const MenuItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    color: ${(props) => (props.active ? "black" : "#B8B8B8")};
    padding: 10px 0;
    cursor: pointer;
`;

const OrangeCircle = styled.img`
    width: 8px;
    height: 8px;
    margin-left: 8px;
    visibility: ${(props) => (props.active ? "visible" : "hidden")};
`;

const Divider = styled.div`
    height: 1px;
    background-color: #ddd;
    margin: 8px 0;
`;

const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/mypage/reservations", label: "예약 내역" },
        { path: "/mypage/chat", label: "채팅 내역" },
        { divider: true },
        { path: "/mypage/reviews", label: "후기 관리" },
        { path: "/mypage/favorites", label: "찜 목록" },
        { divider: true },
        { path: "/mypage/profile", label: "회원 정보 수정" },
    ];

    return (
        <SidebarContainer>
            <Title>마이페이지</Title>
            <Underline />
            <MenuList>
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return <Divider key={`divider-${index}`} />;
                    }
                    const isActive = location.pathname === item.path;
                    return (
                        <MenuItemWrapper key={item.path}>
                            <MenuItem active={isActive} onClick={() => navigate(item.path)}>
                                {item.label}
                                <OrangeCircle src={orangeCircle} alt="active" active={isActive} />
                            </MenuItem>
                        </MenuItemWrapper>
                    );
                })}
            </MenuList>
        </SidebarContainer>
    );
};

export default UserSidebar;