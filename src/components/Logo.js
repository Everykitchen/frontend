import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LogoWrapper = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
`;

const LogoPart1 = styled.span`
    background: linear-gradient(to right, #f0b52f, #f0b52f);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    font-size: 24px;
    font-weight: bold;
`;

const LogoPart2 = styled.span`
    background: linear-gradient(to right, #ff6f1f, #ff6f1f);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    font-size: 24px;
    font-weight: bold;
`;

const Logo = () => {
    return (
        <LogoWrapper to="/">
            <LogoPart1>에브리</LogoPart1>
            <LogoPart2>키친</LogoPart2>
        </LogoWrapper>
    );
};

export default Logo;