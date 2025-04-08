import styled from "styled-components";
import SideBar from "../components/UserSideBar";
import profileImg from "../assets/jpg/profile1.jpg";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px;
    margin-top: 50px;
`;

const ProfileCard = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
`;

const ProfileImage = styled.img`
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px grey;
    align-items: center;
`;

const UserName = styled.h2`
    font-size: 22px;
    font-weight: bold;
    margin: 0px;
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
            <Container>
                <SideBar />
                <Content>
                    <ProfileCard>
                        <ProfileImage src={profileImg} alt="프로필 이미지" />
                        <div>
                            <UserName>문민선</UserName>
                        </div>
                    </ProfileCard>

                    <InfoSection>
                        <InfoRow>
                            <Label>이메일</Label>
                            <Data>munminsun@gmail.com</Data>
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
