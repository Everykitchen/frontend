import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orangeCircle from "../assets/icons/orangeDot.svg";
import {SidebarContainer,Title, Underline, MenuList, MenuItemWrapper, 
    MenuItem, OrangeCircle, Divider
} from "./UserSideBar";

const HostSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/host-mypage/reservations", label: "예약 관리" },
        { path: "/host-mypage/sales", label: "매출 관리" },
        { divider: true },
        { path: "/host-mypage/kitchen-management", label: "주방 관리" },
        { path: "/host-mypage/chats", label: "채팅 내역" },
        { divider: true },
        { path: "/host-mypage", label: "회원 정보 수정" },
    ];

    const isMenuActive = (path) => {
        // 정확한 경로 매칭
        if (location.pathname === path) return true;
        
        // 예약 상세 페이지 경로 체크 (/host-mypage/reservations/:id)
        if (path === "/host-mypage/reservations" && location.pathname.startsWith("/host-mypage/reservations/")) {
            return true;
        }
        
        // 채팅방 경로 체크 (/host-mypage/chats/:id)
        if (path === "/host-mypage/chats" && location.pathname.startsWith("/host-mypage/chats/")) {
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

export default HostSidebar;