import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import SideBar from "../../components/UserSideBar";
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

const PhoneInputGroup = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
`;

const BirthdayInputGroup = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
`;

const Separator = styled.span`
    color: #666;
    font-size: 14px;
`;

const PhoneInput = styled.input`
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

const BirthdayInput = styled(PhoneInput)``;

const SectionRow = styled.div`
    display: flex;
    gap: 40px;
    width: 100%;
`;

const SectionColumn = styled.div`
    flex: 1;
    width: 100%;
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    margin-bottom: 16px;
    color: #000;
    font-weight: 600;
`;

const Card = styled.div`
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

const ItemList = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
`;

const ItemHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.7fr 1fr;
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

const ChatHeader = styled(ItemHeader)`
    grid-template-columns: 1fr 1fr 1fr;
`;

const Item = styled.div`
    padding: 12px 0px;
`;

const ReservationItem = styled(Item)`
    display: grid;
    grid-template-columns: 1fr 0.7fr 1fr;
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

const ChatItem = styled(Item)`
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

const ItemText = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #333;
`;

const StatusText = styled(ItemText)`
    color: ${props => props.status === '예약중' ? '#FFBC39' : '#9B9B9B'};
    font-weight: 600;
`;

const EmptyMessage = styled.div`
    padding: 30px 0;
    text-align: center;
    color: #666;
    font-size: 14px;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #E0E0E0;
    margin: 20px 0;
`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const MyPage = () => {
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
    
    // 최근 예약 내역과 채팅 내역 상태
    const [recentReservations, setRecentReservations] = useState([]);
    const [recentChats, setRecentChats] = useState([]);

    const handleEditClick = () => {
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
            formData.append("birthday", birthday);
            formData.append("phoneNumber", phoneNumber);
            
            if (selectedImage) {
                formData.append("imageFile", selectedImage);
            }

            const response = await api.put(
                "/api/auth/edit-user",
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
            const response = await api.get('/api/user/reservation?page=0&size=5');
            setRecentReservations(response.data.content || []);
        } catch (err) {
            console.error("최근 예약 내역 조회 실패", err);
        }
    };

    // 최근 채팅 내역 조회
    const fetchRecentChats = async () => {
        try {
            const response = await api.get('/api/user/chat-history');
            // 최근 5개만 가져오기
            setRecentChats(response.data.slice(0, 5) || []);
        } catch (err) {
            console.error("최근 채팅 내역 조회 실패", err);
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
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

    // 예약 시간 포맷팅 - 기존 reservationTime 문자열을 09-11 형식으로 변환
    const formatReservationTime = (timeStr) => {
        if (!timeStr) return '';
        // 문자열 형식이 "09:00 ~ 11:00"와 같은 형태라고 가정
        const parts = timeStr.split(' ~ ');
        if (parts.length !== 2) return timeStr;
        
        const start = parts[0].substring(0, 2);
        const end = parts[1].substring(0, 2);
        return `${start}-${end}`;
    };

    // 채팅 예약 상태 반환 함수
    const getChatStatus = (status) => {
        if (!status) return '미예약';
        
        if (['RESERVED', 'PENDING_PAYMENT', 'COMPLETED_PAYMENT'].includes(status)) {
            return '예약중';
        }
        
        return '미예약';
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
                const response = await api.get("/api/auth/user/my-information");
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
                
                setPreviewImage(data.image || profileImg);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패", err);
            }
        };
        
        fetchUserInfo();
        fetchRecentReservations();
        fetchRecentChats();
    }, []);

    return (
        <div>
            <Container>
                <SideBar />
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
                                <UserName>{userInfo?.name || "사용자명"}</UserName>
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

                    <Divider />

                    <SectionRow>
                        <SectionColumn>
                            <SectionTitle>최근 예약 내역</SectionTitle>
                            <Card onClick={() => navigate('/mypage/reservations')}>
                                <ItemList>
                                    <ItemHeader>
                                        <div>예약일</div>
                                        <div>시간</div>
                                        <div>주방명</div>
                                    </ItemHeader>
                                    {recentReservations.length > 0 ? (
                                        recentReservations.map((reservation) => (
                                            <ReservationItem key={reservation.reservationId}>
                                                <ItemText>{formatDate(reservation.date || reservation.reservationDate)}</ItemText>
                                                <ItemText>
                                                    {reservation.reservationTime 
                                                        ? formatReservationTime(reservation.reservationTime) 
                                                        : formatTime(reservation.startTime, reservation.endTime)}
                                                </ItemText>
                                                <ItemText>{reservation.kitchenName}</ItemText>
                                            </ReservationItem>
                                        ))
                                    ) : (
                                        <EmptyMessage>최근 예약 내역이 없습니다.</EmptyMessage>
                                    )}
                                </ItemList>
                            </Card>
                        </SectionColumn>

                        <SectionColumn>
                            <SectionTitle>최근 채팅 내역</SectionTitle>
                            <Card onClick={() => navigate('/mypage/chats')}>
                                <ItemList>
                                    <ChatHeader>
                                        <div>채팅일자</div>
                                        <div>예약상태</div>
                                        <div>주방명</div>
                                    </ChatHeader>
                                    {recentChats.length > 0 ? (
                                        recentChats.map((chat) => (
                                            <ChatItem key={chat.chattingRoomId}>
                                                <ItemText>{formatDate(chat.lastMessageTime)}</ItemText>
                                                <StatusText status={getChatStatus(chat.reservationStatus)}>{getChatStatus(chat.reservationStatus)}</StatusText>
                                                <ItemText>{chat.kitchenName}</ItemText>
                                            </ChatItem>
                                        ))
                                    ) : (
                                        <EmptyMessage>최근 채팅 내역이 없습니다.</EmptyMessage>
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

export default MyPage;
