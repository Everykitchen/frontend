import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import orangeCircle from "../assets/icons/orangeDot.svg";

/**
 * 사용자 마이페이지의 사이드바 컴포넌트
 * 
 * 주요 기능:
 * - 마이페이지 내 각 섹션으로 이동할 수 있는 메뉴 제공
 * - 현재 활성화된 메뉴 표시 (주황색 동그라미 아이콘)
 * - 반응형 디자인 지원
 * 
 * Props:
 * - activeMenu: 외부에서 강제로 활성화할 메뉴 이름을 지정 (옵션)
 */
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
    background-color: "#B8B8B8";
    margin: 8px 0;
`;

const UserSidebar = ({ activeMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/mypage/reservations", label: "예약 내역" },
        { path: "/mypage/chats", label: "채팅 내역" },
        { divider: true },
        { path: "/mypage/reviews", label: "후기 관리" },
        { path: "/mypage/likes", label: "찜 목록" },
        { divider: true },
        { path: "/mypage", label: "회원 정보 수정" },
    ];

    const isMenuActive = (path) => {
        // 외부에서 전달받은 activeMenu가 있으면 그것을 우선 확인
        if (activeMenu) {
            const menuItem = menuItems.find(item => !item.divider && item.label === activeMenu);
            if (menuItem && menuItem.path === path) {
                return true;
            }
        }
        
        // 정확한 경로 매칭
        if (location.pathname === path) return true;

        // 채팅방 경로 체크 (/mypage/chats/:id)
        if (
            path === "/mypage/chats" &&
            location.pathname.startsWith("/mypage/chats/")
        ) {
            return true;
        }
        
        // 예약 상세 페이지 체크 (/mypage/reservations/:id)
        if (
            path === "/mypage/reservations" &&
            location.pathname.startsWith("/mypage/reservations/")
        ) {
            return true;
        }

        return false;
    };

    return (
        <SidebarContainer>
            <Title>마이페이지</Title>
            <Underline />
            <MenuList>
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return <Divider key={`divider-${index}`} />;
                    }
                    const isActive = isMenuActive(item.path);
                    return (
                        <MenuItemWrapper key={item.path}>
                            <MenuItem
                                active={isActive}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                                <OrangeCircle
                                    src={orangeCircle}
                                    alt="active"
                                    active={isActive}
                                />
                            </MenuItem>
                        </MenuItemWrapper>
                    );
                })}
            </MenuList>
        </SidebarContainer>
    );
};

export default UserSidebar;

export {
    SidebarContainer,
    Title,
    Underline,
    MenuList,
    MenuItemWrapper,
    MenuItem,
    OrangeCircle,
    Divider,
};
