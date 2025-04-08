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
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid black;
    align-items: center;
`;

const ProfileInfo = styled.div``;

const UserName = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin: 0px 0px 5px 0px;
`;

const InfoSection = styled.div`
    margin-top: 20px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
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

const MyPage = () => {
    return (
        <div>
            <Container>
                <SideBar />
                <Content>
                    <ProfileSection>
                        <ProfileImage src={profileImg} alt="프로필 이미지" />
                        <ProfileInfo>
                            <UserName>문민선</UserName>
                            <div>
                                <InfoRow>
                                    <Data>이메일 :</Data>
                                    <Data>munminsun@gmail.com</Data>
                                </InfoRow>
                                <InfoRow>
                                    <Data>휴대폰 :</Data>
                                    <Data>010-0000-0000</Data>
                                </InfoRow>
                            </div>
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
                    </InfoSection>
                </Content>
            </Container>
        </div>
    );
};

export default MyPage;
