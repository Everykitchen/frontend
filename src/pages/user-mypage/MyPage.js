import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../components/UserSideBar";
import profileImg from "../../assets/image/profile.png";
import editIcon from "../../assets/icons/editicon.svg";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px;
    margin-top: 30px;
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
`;

const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    align-items: center;
    object-fit: cover;
`;

const ProfileInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
`;

const EditIcon = styled.img`
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 10px;
`;

const UserName = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const InfoSection = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const Label = styled.div`
    width: 200px;
    font-weight: bold;
    padding: 10px 0px;
`;

const Data = styled.div`
    color: #555;
    padding-left: 5px;
    font-size: 14px;
`;

const TagContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const Tag = styled.span`
    background: #ddd;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 14px;
`;

const LogoutWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
`;

const LogoutButton = styled.button`
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

const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get("/api/auth/user/my-information");
                setUserInfo(res.data);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패", err);
            }
        };
        fetchUserInfo();
    }, []);

    return (
        <div>
            <Container>
                <SideBar />
                <Content>
                    <ProfileSection>
                        <ProfileImage
                            src={userInfo?.image || profileImg}
                            alt="프로필 이미지"
                        />
                        <ProfileInfo>
                            <div>
                                <UserName>
                                    {userInfo?.name || "사용자명"}
                                </UserName>
                                <div>
                                    <InfoRow>
                                        <Data>이메일 :</Data>
                                        <Data>{userInfo?.email}</Data>
                                    </InfoRow>
                                    <InfoRow>
                                        <Data>휴대폰 :</Data>
                                        <Data>{userInfo?.phoneNumber}</Data>
                                    </InfoRow>
                                </div>
                            </div>
                            <EditIcon src={editIcon} alt="프로필 편집" />
                        </ProfileInfo>
                    </ProfileSection>
                    <InfoSection>
                        <InfoRow>
                            <Label>주로 활동하는 지역</Label>
                            <TagContainer>
                                <Tag>서울시 서초구</Tag>
                                <Tag>서울시 종로구</Tag>
                            </TagContainer>
                        </InfoRow>
                        <InfoRow>
                            <Label>선호 활동</Label>
                            <TagContainer>
                                <Tag>쿠킹</Tag>
                                <Tag>베이킹</Tag>
                            </TagContainer>
                        </InfoRow>
                        <LogoutWrapper>
                            <LogoutButton onClick={handleLogout}>
                                로그아웃
                            </LogoutButton>
                        </LogoutWrapper>
                    </InfoSection>
                </Content>
            </Container>
        </div>
    );
};

export default MyPage;
