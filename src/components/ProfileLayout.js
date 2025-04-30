import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

export const Content = styled.div`
    flex: 1;
    padding: 40px;
    margin-top: 30px;
`;

export const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
`;

export const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    align-items: center;
    object-fit: cover;
`;

export const ProfileInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
`;

export const EditIcon = styled.img`
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 10px;
`;

export const UserName = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const InfoSection = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

export const Label = styled.div`
    width: 200px;
    font-weight: bold;
    padding: 10px 0px;
`;

export const Data = styled.div`
    color: #555;
    padding-left: 5px;
    font-size: 14px;
`;

export const TagContainer = styled.div`
    display: flex;
    gap: 10px;
`;

export const Tag = styled.span`
    background: #ddd;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 14px;
`;

export const LogoutWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
`;

export const LogoutButton = styled.button`
    background: #ff4d4f;
    padding: 10px 24px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 14px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #e04345;
    }
`;

export const LogoutActionButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("token");

        try {
            await axios.post("/api/auth/logout", null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error("서버 로그아웃 실패:", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");

        window.location.href = "/login";
    };

    return (
        <LogoutWrapper>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </LogoutWrapper>
    );
};
