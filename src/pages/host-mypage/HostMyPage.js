import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import HostSideBar from "../../components/HostSideBar";
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
    LogoutActionButton,
} from "../../components/ProfileLayout";
import styled from "styled-components";

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 200px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
    margin: 4px 0;
`;

const ImageInput = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
`;

const ChangeImageButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #f5f5f5;
    color: #333;
    font-size: 13px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    margin-left: auto;
`;

const Button = styled.button`
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

const EditableInfoRow = styled(InfoRow)`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const HostMyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        image: profileImg,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("010-1111-1111");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(profileImg);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        return phoneRegex.test(number);
    };

    const handleEditClick = () => {
        setPhoneNumber(userInfo?.phoneNumber || "");
        setPreviewImage(userInfo?.image || profileImg);
        setIsEditing(true);
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            if (!validatePhoneNumber(phoneNumber)) {
                setError(
                    "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)"
                );
                return;
            }

            const formData = new FormData();
            if (selectedImage) {
                formData.append("image", selectedImage);
            }
            formData.append("phoneNumber", phoneNumber);

            const response = await api.put(
                "/api/auth/edit/my-information",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setUserInfo({
                    ...userInfo,
                    phoneNumber,
                    image: selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : userInfo.image,
                });
                setIsEditing(false);
                setError("");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError("로그인이 필요한 서비스입니다.");
                navigate("/login");
            } else if (err.response?.status === 400) {
                setError("전화번호 형식이 올바르지 않습니다.");
            } else {
                setError("회원정보 수정 중 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPhoneNumber(userInfo?.phoneNumber || "010-1111-1111");
        setPreviewImage(userInfo?.image || profileImg);
        setSelectedImage(null);
        setError("");
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/api/auth/host/my-information");
                const data = response.data;

                setUserInfo({
                    name: data.name || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    image: data.image || profileImg,
                });

                setPhoneNumber(data.phoneNumber || "");
                setPreviewImage(data.image || profileImg);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패", err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();
    }, [navigate]);

    return (
        <div>
            <Container>
                <HostSideBar />
                <Content>
                    <ProfileSection>
                        <div>
                            <ProfileImage
                                src={
                                    isEditing
                                        ? previewImage
                                        : userInfo?.image || profileImg
                                }
                                alt="프로필 이미지"
                            />
                            {isEditing && (
                                <ImageInput>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                    />
                                    <ChangeImageButton
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        이미지 변경
                                    </ChangeImageButton>
                                </ImageInput>
                            )}
                        </div>
                        <ProfileInfo>
                            <div>
                                <UserName>
                                    {userInfo?.name || "호스트명"}
                                </UserName>
                                <div>
                                    <InfoRow>
                                        <Data>이메일 :</Data>
                                        <Data>{userInfo?.email}</Data>
                                    </InfoRow>
                                    <EditableInfoRow>
                                        <Data>휴대폰 :</Data>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) =>
                                                    setPhoneNumber(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="010-1234-5678"
                                            />
                                        ) : (
                                            <Data>{userInfo?.phoneNumber}</Data>
                                        )}
                                    </EditableInfoRow>
                                    {error && (
                                        <ErrorMessage>{error}</ErrorMessage>
                                    )}
                                </div>
                            </div>
                            {isEditing ? (
                                <ButtonGroup>
                                    <Button onClick={handleSubmit}>저장</Button>
                                    <Button
                                        className="cancel"
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </Button>
                                </ButtonGroup>
                            ) : (
                                <StyledEditIcon
                                    src={editIcon}
                                    alt="프로필 편집"
                                    onClick={handleEditClick}
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </ProfileInfo>
                    </ProfileSection>
                    <InfoSection>
                        <InfoRow>
                            <Label>담당 공유주방 지역</Label>
                            <TagContainer>
                                <Tag>서울시 마포구</Tag>
                                <Tag>서울시 동작구</Tag>
                            </TagContainer>
                        </InfoRow>
                        <InfoRow>
                            <Label>운영 형태</Label>
                            <TagContainer>
                                <Tag>개별 운영</Tag>
                                <Tag>공유 운영</Tag>
                            </TagContainer>
                        </InfoRow>
                        <LogoutWrapper>
                            <LogoutActionButton />
                        </LogoutWrapper>
                    </InfoSection>
                </Content>
            </Container>
        </div>
    );
};

export default HostMyPage;
