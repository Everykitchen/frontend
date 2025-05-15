import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orangeCircle from "../assets/icons/orangeDot.svg";
import {SidebarContainer,Title, Underline, MenuList, MenuItemWrapper, 
    MenuItem, OrangeCircle, Divider
} from "./UserSideBar";

/**
 * 호스트 마이페이지의 사이드바 컴포넌트
 * 
 * 주요 기능:
 * - 호스트 마이페이지 내 각 섹션으로 이동할 수 있는 메뉴 제공
 * - 현재 활성화된 메뉴 표시 (주황색 동그라미 아이콘)
 * - UserSideBar와 스타일 공유하여 일관된 디자인 유지
 * 
 * Props:
 * - activeMenu: 외부에서 강제로 활성화할 메뉴 이름을 지정 (옵션)
 */
const HostSidebar = ({ activeMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // 호스트용 메뉴 아이템 정의
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
        // 외부에서 전달받은 activeMenu가 있으면 그것을 우선 확인
        if (activeMenu) {
            const menuItem = menuItems.find(item => !item.divider && item.label === activeMenu);
            if (menuItem && menuItem.path === path) {
                return true;
            }
        }
        
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