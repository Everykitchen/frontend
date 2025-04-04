import styled from "styled-components";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px;
`;

const ProfileCard = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
`;

const ProfileImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
`;

const UserName = styled.h2`
    font-size: 22px;
    font-weight: bold;
`;

const VipBadge = styled.span`
    color: orange;
    font-weight: bold;
`;

const InfoSection = styled.div`
    margin-top: 20px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const Label = styled.div`
    width: 120px;
    font-weight: bold;
`;

const Data = styled.div`
    color: #555;
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

const MyPage = () => {
    return (
        <div>
            <NavBar />
            <Container>
                <SideBar />
                <Content>
                    <ProfileCard>
                        <ProfileImage src="/profile.jpg" alt="프로필 이미지" />
                        <div>
                            <UserName>루비루바라라부룩방구</UserName>
                            <VipBadge>나의 등급 : VIP</VipBadge>
                        </div>
                    </ProfileCard>

                    <InfoSection>
                        <InfoRow>
                            <Label>이메일</Label>
                            <Data>rubyru@gmail.com</Data>
                        </InfoRow>
                        <InfoRow>
                            <Label>전화번호</Label>
                            <Data>010-0000-0000</Data>
                        </InfoRow>
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
                    </InfoSection>
                </Content>
            </Container>
        </div>
    );
};

export default MyPage;
