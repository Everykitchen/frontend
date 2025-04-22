import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../components/UserSideBar";
import profileImg from "../../assets/image/profile.png";
import editIcon from "../../assets/icons/editicon.svg";
import {
    Container,
    Content,
    ProfileSection,
    ProfileImage,
    ProfileInfo,
    EditIcon as StyledEditIcon,
    UserName,
    InfoSection,
    InfoRow,
    Label,
    Data,
    TagContainer,
    Tag,
    LogoutWrapper,
    LogoutButton,
} from "../../components/ProfileLayout";

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
                            <StyledEditIcon src={editIcon} alt="프로필 편집" />
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
