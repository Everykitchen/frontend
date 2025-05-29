import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import HostSideBar from "../../components/HostSideBar";
import profileImg from "../../assets/image/profile.png";
import editIcon from "../../assets/icons/editicon.svg";
import styled from "styled-components";
import {
    Container,
    Content,
    ProfileSection,
    ProfileImageSection,
    ProfileImage,
    InfoSection,
    ActionSection,
    InfoRow,
    NameRow,
    Label,
    Data,
    EditIcon,
    UserName,
    LogoutActionButton,
    ImageInput,
    ChangeImageButton,
    ButtonSection,
    Button,
    NameInput,
    PhoneInputGroup,
    BirthdayInputGroup,
    Separator,
    PhoneInput,
    BirthdayInput,
    SectionRow,
    SectionColumn,
    SectionTitle,
    Card,
    ItemList,
    ItemHeader,
    KitchenHeader,
    Item,
    ReservationItem,
    KitchenItem,
    ItemText,
    EmptyMessage,
    Divider,
} from "../../components/ProfileLayout";
import { formatPhoneNumber, validatePhoneNumber, formatBirthday, validateBirthday } from "../../utils/formatUtils";

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
    margin: 4px 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    margin-left: auto;
`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const HostMyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        id: 0,
        name: "",
        email: "",
        birthday: "",
        phoneNumber: "",
        image: profileImg,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber1, setPhoneNumber1] = useState("");
    const [phoneNumber2, setPhoneNumber2] = useState("");
    const [phoneNumber3, setPhoneNumber3] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(profileImg);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    
    // 최근 예약 내역과 주방 목록 상태 추가
    const [recentReservations, setRecentReservations] = useState([]);
    const [kitchenList, setKitchenList] = useState([]);

    const handleEditClick = () => {
        setName(userInfo?.name || "");
        const [p1, p2, p3] = (userInfo?.phoneNumber || "").split("-");
        setPhoneNumber1(p1 || "");
        setPhoneNumber2(p2 || "");
        setPhoneNumber3(p3 || "");
        
        const [year, month, day] = (userInfo?.birthday || "").split("-");
        setBirthYear(year || "");
        setBirthMonth(month || "");
        setBirthDay(day || "");
        
        setPreviewImage(userInfo?.image || profileImg);
        setIsEditing(true);
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 파일 크기 체크
        if (file.size > MAX_FILE_SIZE) {
            setError("이미지 파일은 5MB 이하만 등록 가능합니다.");
            e.target.value = ''; // 파일 입력 초기화
            return;
        }

        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
        setError(""); // 이전 에러 메시지 초기화
    };

    const handlePhoneNumberChange = (value, index) => {
        if (value.length > 4) return;
        if (!/^\d*$/.test(value)) return;

        switch(index) {
            case 1: setPhoneNumber1(value); break;
            case 2: setPhoneNumber2(value); break;
            case 3: setPhoneNumber3(value); break;
        }
    };

    const handleBirthdayChange = (value, type) => {
        if (!/^\d*$/.test(value)) return;

        switch(type) {
            case 'year':
                if (value.length > 4) return;
                setBirthYear(value);
                break;
            case 'month':
                if (value.length > 2) return;
                setBirthMonth(value.padStart(2, '0'));
                break;
            case 'day':
                if (value.length > 2) return;
                setBirthDay(value.padStart(2, '0'));
                break;
        }
    };

    const handleSubmit = async () => {
        try {
            if (!name.trim()) {
                setError("이름을 입력해주세요.");
                return;
            }

            // 전화번호 유효성 검사
            const phoneValidation = validatePhoneNumber(phoneNumber1, phoneNumber2, phoneNumber3);
            if (!phoneValidation.isValid) {
                setError(phoneValidation.message);
                return;
            }

            // 생년월일 유효성 검사
            const birthdayValidation = validateBirthday(birthYear, birthMonth, birthDay);
            if (!birthdayValidation.isValid) {
                setError(birthdayValidation.message);
                return;
            }

            const phoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;
            const birthday = `${birthYear}-${birthMonth}-${birthDay}`;

            const formData = new FormData();
            formData.append("name", name);
            formData.append("birthday", birthday);
            formData.append("phoneNumber", phoneNumber);
            
            if (selectedImage) {
                formData.append("imageFile", selectedImage);
            }

            const response = await api.put(
                "/api/auth/edit-host",
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
                    name,
                    phoneNumber,
                    birthday,
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
                setError("입력 정보가 올바르지 않습니다.");
            } else {
                setError("회원정보 수정 중 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(userInfo?.name || "");
        const [p1, p2, p3] = (userInfo?.phoneNumber || "").split("-");
        setPhoneNumber1(p1 || "");
        setPhoneNumber2(p2 || "");
        setPhoneNumber3(p3 || "");
        
        const [year, month, day] = (userInfo?.birthday || "").split("-");
        setBirthYear(year || "");
        setBirthMonth(month || "");
        setBirthDay(day || "");
        
        setPreviewImage(userInfo?.image || profileImg);
        setSelectedImage(null);
        setError("");
    };

    // 최근 예약 내역 조회
    const fetchRecentReservations = async () => {
        try {
            const res = await api.get('/api/host/reservation?page=0&size=5');
            setRecentReservations(res.data.content || []);
        } catch (err) {
            console.error("최근 예약 내역 조회 실패", err);
        }
    };

    // 주방 목록 조회
    const fetchKitchens = async () => {
        try {
            const res = await api.get("/api/host/my-kitchens");
            setKitchenList(res.data || []);
        } catch (err) {
            console.error("주방 목록 조회 실패", err);
        }
    };

    // 주소 처리 함수 (앞 두 단어만 표시)
    const formatAddress = (address) => {
        if (!address) return "";
        const words = address.split(" ");
        return words.slice(0, 2).join(" ");
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    };

    // 시간 포맷팅 함수
    const formatTime = (startTime, endTime) => {
        if (!startTime || !endTime) return '';
        // 간결한 HH-HH 형식으로 변환
        const start = startTime.substring(0, 2);
        const end = endTime.substring(0, 2);
        return `${start} - ${end}`;
    };

    // 예약 상태 변환 함수
    const getStatusLabel = (status) => {
        if (status === "RESERVED" || status === "PENDING_PAYMENT") return "진행중";
        if (status === "COMPLETED_PAYMENT") return "완료";
        return status;
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userType");
            window.location.href = "/login";
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/api/auth/host/my-information");
                const data = response.data;
                
                // 전화번호 포맷팅
                const { p1, p2, p3 } = formatPhoneNumber(data.phoneNumber);
                setPhoneNumber1(p1);
                setPhoneNumber2(p2);
                setPhoneNumber3(p3);
                
                // 생년월일 포맷팅
                const { year, month, day } = formatBirthday(data.birthday);
                setBirthYear(year);
                setBirthMonth(month);
                setBirthDay(day);
                
                setUserInfo({
                    id: data.id || 0,
                    name: data.name || "",
                    email: data.email || "",
                    birthday: data.birthday || "",
                    phoneNumber: data.phoneNumber || "",
                    image: data.image || profileImg,
                });

                setName(data.name || "");
                setPreviewImage(data.image || profileImg);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패", err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();
        fetchRecentReservations();
        fetchKitchens();
    }, [navigate]);

    return (
        <div>
            <Container>
                <HostSideBar />
                <Content>
                    <ProfileSection>
                        <ProfileImageSection>
                            <ProfileImage
                                src={isEditing ? previewImage : userInfo?.image || profileImg}
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
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        이미지 변경
                                    </ChangeImageButton>
                                </ImageInput>
                            )}
                        </ProfileImageSection>

                        <InfoSection>
                            <NameRow>
                                {isEditing ? (
                                    <NameInput 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="이름을 입력하세요" 
                                    />
                                ) : (
                                    <UserName>{userInfo?.name || "호스트명"}</UserName>
                                )}
                            </NameRow>
                            <InfoRow>
                                <Label>이메일</Label>
                                <Data>{userInfo?.email}</Data>
                            </InfoRow>
                            <InfoRow>
                                <Label>휴대폰</Label>
                                {isEditing ? (
                                    <PhoneInputGroup>
                                        <PhoneInput type="text" value={phoneNumber1} onChange={(e) => handlePhoneNumberChange(e.target.value, 1)} maxLength={3} placeholder="010" />
                                        <Separator>-</Separator>
                                        <PhoneInput type="text" value={phoneNumber2} onChange={(e) => handlePhoneNumberChange(e.target.value, 2)} maxLength={4} placeholder="1234" />
                                        <Separator>-</Separator>
                                        <PhoneInput type="text" value={phoneNumber3} onChange={(e) => handlePhoneNumberChange(e.target.value, 3)} maxLength={4} placeholder="5678" />
                                    </PhoneInputGroup>
                                ) : (
                                    <Data>{userInfo?.phoneNumber}</Data>
                                )}
                            </InfoRow>
                            <InfoRow>
                                <Label>생년월일</Label>
                                {isEditing ? (
                                    <BirthdayInputGroup>
                                        <BirthdayInput type="text" value={birthYear} onChange={(e) => handleBirthdayChange(e.target.value, 'year')} maxLength={4} placeholder="YYYY" />
                                        <Separator>-</Separator>
                                        <BirthdayInput type="text" value={birthMonth} onChange={(e) => handleBirthdayChange(e.target.value, 'month')} maxLength={2} placeholder="MM" />
                                        <Separator>-</Separator>
                                        <BirthdayInput type="text" value={birthDay} onChange={(e) => handleBirthdayChange(e.target.value, 'day')} maxLength={2} placeholder="DD" />
                                    </BirthdayInputGroup>
                                ) : (
                                    <Data>{userInfo?.birthday}</Data>
                                )}
                            </InfoRow>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                        </InfoSection>

                        <ActionSection>
                            {!isEditing ? (
                                <>
                                    <EditIcon
                                        src={editIcon}
                                        alt="프로필 편집"
                                        onClick={handleEditClick}
                                    />
                                    <LogoutActionButton />
                                </>
                            ) : (
                                <ButtonGroup>
                                    <Button onClick={handleSubmit}>저장</Button>
                                    <Button className="cancel" onClick={handleCancel}>취소</Button>
                                </ButtonGroup>
                            )}
                        </ActionSection>
                    </ProfileSection>
                    
                    
                    <SectionRow>
                        <SectionColumn>
                            <SectionTitle>최근 예약 내역</SectionTitle>
                            <Card onClick={() => navigate('/host-mypage/reservations')}>
                                <ItemList>
                                    <ItemHeader>
                                        <div>예약일</div>
                                        <div>시간</div>
                                        <div>예약자 성함</div>
                                    </ItemHeader>
                                    {recentReservations.length > 0 ? (
                                        recentReservations.map((reservation) => (
                                            <ReservationItem key={reservation.reservationId}>
                                                <ItemText>{formatDate(reservation.date)}</ItemText>
                                                <ItemText>{formatTime(reservation.startTime, reservation.endTime)}</ItemText>
                                                <ItemText>{reservation.clientName}</ItemText>
                                            </ReservationItem>
                                        ))
                                    ) : (
                                        <EmptyMessage>최근 예약 내역이 없습니다.</EmptyMessage>
                                    )}
                                </ItemList>
                            </Card>
                        </SectionColumn>
                        
                        <SectionColumn>
                            <SectionTitle>운영 중인 주방</SectionTitle>
                            <Card onClick={() => navigate('/host-mypage/kitchen-management')}>
                                <ItemList>
                                    <KitchenHeader>
                                        <div>주방명</div>
                                        <div>주소</div>
                                    </KitchenHeader>
                                    {kitchenList.length > 0 ? (
                                        kitchenList.map((kitchen) => (
                                            <KitchenItem key={kitchen.id || kitchen.kitchenId}>
                                                <ItemText>{kitchen.kitchenName}</ItemText>
                                                <ItemText>{formatAddress(kitchen.location)}</ItemText>
                                            </KitchenItem>
                                        ))
                                    ) : (
                                        <EmptyMessage>운영 중인 주방이 없습니다.</EmptyMessage>
                                    )}
                                </ItemList>
                            </Card>
                        </SectionColumn>
                    </SectionRow>
                </Content>
            </Container>
        </div>
    );
};

export default HostMyPage;
