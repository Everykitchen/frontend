import styled from "styled-components";

const SidebarContainer = styled.div`
    width: 250px;
    padding: 20px;
    background: #f8f8f8;
`;

const Title = styled.h2`
    font-size: 20px;
    margin-top: 50px;
    margin-bottom: 10px;
`;

const Divider = styled.div`
    width: 200px;
    height: 2px;
    background-color: #ffbc39;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
`;

const MenuItem = styled.li`
    padding: 10px;
    cursor: pointer;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    color: ${(props) => (props.active ? "orange" : "black")};
`;

const Sidebar = () => {
    return (
        <SidebarContainer>
            <Title>마이 페이지</Title>
            <Divider />
            <MenuList>
                <MenuItem active>예약 내역</MenuItem>
                <MenuItem>채팅 내역</MenuItem>
                <MenuItem>후기 관리</MenuItem>
                <MenuItem>찜 목록</MenuItem>
                <MenuItem>회원 정보 수정</MenuItem>
            </MenuList>
        </SidebarContainer>
    );
};

export default Sidebar;
