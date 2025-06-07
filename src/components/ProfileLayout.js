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
    gap: 40px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
    margin-bottom: 40px;
`;

export const ProfileImageSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 200px;
`;

export const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
`;

export const InfoSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 300px;
`;

export const ActionSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    min-width: 100px;
    padding: 8px 0;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 30px;
`;

export const NameRow = styled(InfoRow)`
    margin-bottom: 5px;
`;

export const Label = styled.div`
    color: #666;
    font-size: 14px;
    min-width: 80px;
    font-weight: 500;
`;

export const Data = styled.div`
    color: #333;
    font-size: 14px;
    text-align: right;
    flex: 1;
    padding-right: 65%;
`;

export const EditIcon = styled.img`
    width: 48px;
    height: 48px;
    cursor: pointer;
    margin-right: 30px;
    transition: opacity 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

export const ImageInput = styled.div`
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

export const ChangeImageButton = styled.button`
    background:rgb(243, 243, 243);
    color: black;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background:rgb(238, 238, 238);
    }
`;

export const UserName = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 14px;
`;

export const LogoutWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const LogoutButton = styled.button`
    background:rgb(255, 95, 77);
    padding: 10px 24px;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    color: white;
    font-size: 15px;
    margin-right: 10px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #e04345;
    }
`;

export const Button = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
    background: #ffbc39;
    color: white;

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    &.cancel {
        background: #f5f5f5;
        color: #333;
    }
`;

export const NameInput = styled.input`
    font-size: 32px;
    font-weight: 600;
    border: none;
    background: transparent;
    border-bottom: 1.5px solid #eee;
    margin-bottom: 16px;
    width: auto;
    color: #222;
    padding: 0 4px;
    &:focus {
        outline: none;
        border-color: #FF7926;
    }
`;

export const PhoneInputGroup = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
`;

export const BirthdayInputGroup = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
`;

export const Separator = styled.span`
    color: #666;
    font-size: 14px;
`;

export const PhoneInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 60px;
    text-align: center;

    &:focus {
        outline: none;
        border-color: #FF7926;
    }
`;

export const BirthdayInput = styled(PhoneInput)``;

export const SectionRow = styled.div`
    display: flex;
    gap: 40px;
    width: 100%;
`;

export const SectionColumn = styled.div`
    flex: 1;
    width: 100%;
`;

export const SectionTitle = styled.h3`
    font-size: 20px;
    margin-bottom: 16px;
    color: #000;
    font-weight: 600;
`;

export const Card = styled.div`
    width: 100%;
    background: #FCFCFC;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: box-shadow 0.2s;
    height: 330px;

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

export const ItemList = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
`;

export const ItemHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 12px 0px;
    font-weight: 500;
    color: #000;
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 10px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.5px;
        background-color: #FF7926;
    }
    
    & > div:first-child {
        text-align: left;
        padding-left: 10px;
    }
    
    & > div:last-child {
        text-align: right;
        padding-right: 10px;
    }
`;

export const KitchenHeader = styled(ItemHeader)`
    grid-template-columns: 1fr 1fr;
`;

export const Item = styled.div`
    padding: 12px 0px;
`;

export const ReservationItem = styled(Item)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    color: #333;
    height: 48px;
    align-items: center;
    
    & > span:first-child {
        text-align: left;
        padding-left: 10px;
    }
    
    & > span:last-child {
        text-align: right;
        padding-right: 10px;
    }
`;

export const KitchenItem = styled(Item)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: #333;
    height: 48px;
    align-items: center;
    
    & > span:first-child {
        text-align: left;
        padding-left: 10px;
    }
    
    & > span:last-child {
        text-align: right;
        padding-right: 10px;
    }
`;

export const ItemText = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #333;
`;

export const EmptyMessage = styled.div`
    padding: 30px 0;
    text-align: center;
    color: #666;
    font-size: 14px;
`;

export const LogoutActionButton = () => {
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
