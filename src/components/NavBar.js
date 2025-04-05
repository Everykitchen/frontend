import { Link } from "react-router-dom";
import { FaMap, FaUser, FaHeart, FaCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import styled from "styled-components";

const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: white;
    border-bottom: 1px solid #ddd;
`;

const Logo = styled(Link)`
    font-size: 20px;
    font-weight: bold;
    color: #ff9900;
    text-decoration: none;
    margin-left: 10px;
`;

const NavMiddle = styled.div`
    display: flex;
    align-items: center;
`;

const SearchBar = styled.input`
    flex-grow: 1;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 20px;
    width: 600px;
    text-align: center;
`;

const NavRight = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    a {
        color: black;
        text-decoration: none;
    }
`;

const NavBar = () => {
    return (
        <Navbar>
            <Logo to="/">에브리키친</Logo>
            <NavMiddle>
                <SearchBar
                    type="text"
                    placeholder="찾으시는 주방을 검색해보세요"
                />
                <IoSearch size={20} />
            </NavMiddle>
            <NavRight>
                <Link to="/map">
                    <FaMap size={20} />
                </Link>
                <Link to="/calendar">
                    <FaCalendarAlt size={20} />
                </Link>
                <Link to="/favorites">
                    <FaHeart size={20} />
                </Link>
                <Link to="/mypage">
                    <FaUser size={20} />
                </Link>
            </NavRight>
        </Navbar>
    );
};

export default NavBar;
