import React, { useState, useRef } from "react";
import styled from "styled-components";
import ImageGallery from "./ImageGallery";
import ReservationSidebar from "./ReservationSidebar";
import InfoSection from "./InfoSection";
import starIcon from "../../assets/icons/starIcon.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";
import kitchenImage1 from "../../assets/jpg/kitchen1.jpg";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px 80px;
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 80px;
    align-items: flex-start;
`;

const LeftSection = styled.div`
    flex: 2;
`;

const KitchenName = styled.h1`
    font-size: 32px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: -0.64px;
`;

const ShareButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #ebebeb;
    }
`;

const ShareModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 90%;
    max-width: 400px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const UrlInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 14px;
`;

const CopyButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #ffbc39;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #efac29;
    }
`;

// 임시 데이터 (개발 중에만 사용)
const tempKitchenData = {
    id: 123456,
    kitchenName: "소담 쿠킹 스튜디오",
    description: "우리 주방은 최신식 시설과 넓은 공간을 자랑합니다. 인덕션, 오븐 등 다양한 조리도구가 구비되어 있어 어떤 요리든 가능합니다. 자연광이 잘 들어와 사진 촬영도 좋습니다.",
    likeCount: 10,
    phoneNumber: "010-2220-5930",
    images: [kitchenImage1, kitchenImage1, kitchenImage1, kitchenImage1, kitchenImage1],
    location: "서울시 서초구 서초동 123-45",
    latitude: 37.4969,
    longitude: 127.0278,
    size: 33.9,
    baseClientNumber: 2,
    maxClientNumber: 10,
    businessHours: "09:00 - 22:00",
    defaultPrice: [
        { week: "Mon", price: 30000 },
        { week: "Tue", price: 30000 },
        { week: "Wed", price: 30000 },
        { week: "Thu", price: 30000 },
        { week: "Fri", price: 30000 },
        { week: "Sat", price: 40000 },
        { week: "Sun", price: 40000 }
    ],
    kitchenFacility: [
        { facilityName: "인덕션", amount: 2, detail: "삼성 4구 인덕션" },
        { facilityName: "전자레인지", amount: 2, detail: "LG 스마트 인버터" },
        { facilityName: "발효기", amount: 2, detail: "발효파트너 프로" },
        { facilityName: "냉장고", amount: 1, detail: "삼성 비스포크 4도어" },
        { facilityName: "오븐", amount: 2, detail: "LG 디오스 오븐" },
        { facilityName: "싱크대", amount: 2, detail: "프리미엄 스테인리스 싱크대" }
    ],
    cookingTool: [
        { toolName: "전자저울", check: true },
        { toolName: "도마", check: true },
        { toolName: "칼 세트", check: true },
        { toolName: "냄비/후라이팬", check: true },
        { toolName: "믹싱볼", check: true },
        { toolName: "거품기", check: true },
        { toolName: "푸드프로세서", check: false },
        { toolName: "핸드믹서", check: true },
        { toolName: "반죽기", check: true },
        { toolName: "휘낭시에 틀", check: false },
        { toolName: "마들렌 틀", check: true },
        { toolName: "계량도구", check: true }
    ],
    providedItem: [
        { itemName: "위생장갑", check: true },
        { itemName: "앞치마", check: true },
        { itemName: "종이호일", check: true },
        { itemName: "키친타올", check: true },
        { itemName: "물티슈", check: true },
        { itemName: "주방세제", check: true },
        { itemName: "수세미", check: true },
        { itemName: "행주", check: true },
        { itemName: "쓰레기봉투", check: true }
    ],
    ingredientCategories: [
        {
            categoryName: "제과 재료",
            ingredients: [
                { name: "박력분", baseUnit: "kg", price: 3000 },
                { name: "강력분", baseUnit: "kg", price: 3500 },
                { name: "중력분", baseUnit: "kg", price: 3200 },
                { name: "아몬드가루", baseUnit: "kg", price: 25000 },
                { name: "코코아파우더", baseUnit: "kg", price: 18000 },
                { name: "베이킹파우더", baseUnit: "10g", price: 500 },
                { name: "베이킹소다", baseUnit: "10g", price: 500 },
                { name: "바닐라빈", baseUnit: "10g", price: 8000 },
                { name: "드라이이스트", baseUnit: "10g", price: 800 },
                { name: "타피오카전분", baseUnit: "kg", price: 5000 }
            ]
        },
        {
            categoryName: "기본 재료",
            ingredients: [
                { name: "설탕", baseUnit: "kg", price: 3000 },
                { name: "소금", baseUnit: "kg", price: 2000 },
                { name: "계란", baseUnit: "10g", price: 4500 },
                { name: "우유", baseUnit: "kg", price: 3000 },
                { name: "생크림", baseUnit: "kg", price: 8000 },
                { name: "버터", baseUnit: "kg", price: 12000 },
                { name: "식용유", baseUnit: "kg", price: 4500 },
                { name: "올리브유", baseUnit: "kg", price: 15000 },
                { name: "꿀", baseUnit: "kg", price: 20000 },
                { name: "메이플시럽", baseUnit: "kg", price: 18000 }
            ]
        }
    ],
    reviewCount: 10,
    reviews: [
        { name: "김지민", star: 1, review: "시설이 깨끗하고 도구도 잘 갖춰져 있어서 좋았어요!" },
        { name: "이서연", star: 4, review: "공간이 넓어서 편하게 요리할 수 있었습니다." },
        { name: "박현우", star: 5, review: "조리도구가 잘 갖춰져 있어서 편리했어요." },
        { name: "최예린", star: 5, review: "주방이 깔끔하고 채광이 좋아서 사진 찍기도 좋았습니다." },
        { name: "정도윤", star: 4, review: "오븐이 2대나 있어서 여러 가지 요리를 동시에 할 수 있어 좋았어요." },
        { name: "한소희", star: 5, review: "인덕션이 4구라서 한 번에 여러 요리를 할 수 있어서 시간 절약됐어요!" },
        { name: "송민재", star: 4, review: "발효기가 있어서 빵 만들기 정말 편했습니다. 다음에 또 오고 싶어요." },
        { name: "임수진", star: 5, review: "냉장고가 크고 깨끗해서 재료 보관하기 좋았어요. 주방 도구도 잘 갖춰져 있습니다." },
        { name: "강동현", star: 4, review: "주변 접근성이 좋고 주차도 편리해서 재료 운반하기 좋았습니다." },
        { name: "윤하은", star: 5, review: "호스트님이 친절하시고 시설도 잘 관리되어 있어서 만족스러웠어요. 강추합니다!" }
    ]
};

const KitchenDetailPage = ({ kitchen = tempKitchenData }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [count, setCount] = useState(kitchen.baseClientNumber);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedTab, setSelectedTab] = useState("공간정보");
    const [showShareModal, setShowShareModal] = useState(false);

    const sections = {
        공간정보: useRef(null),
        시설정보: useRef(null),
        재료정보: useRef(null),
        후기: useRef(null),
    };

    const handleTimeClick = (hour) => {
        if (startTime === null || (startTime !== null && endTime !== null)) {
            setStartTime(hour);
            setEndTime(null);
        } else if (startTime !== null && endTime === null) {
            if (hour > startTime) setEndTime(hour);
            else setStartTime(hour);
        }
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('URL이 복사되었습니다.');
                setShowShareModal(false);
            })
            .catch(err => {
                console.error('URL 복사 실패:', err);
                alert('URL 복사에 실패했습니다.');
            });
    };

    const averageRating = (kitchen.reviews.reduce((acc, curr) => acc + curr.star, 0) / kitchen.reviews.length).toFixed(1);

    return (
        <Container>
            <ImageGallery images={kitchen.images} />
            <div style={{ marginTop: 60 }} />

            <ContentWrapper>
                <LeftSection>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
                            <KitchenName>{kitchen.kitchenName}</KitchenName>
                            <ShareButton onClick={handleShare}>
                                <img src={shareIcon} alt="공유" style={{ width: 20, height: 20 }} />
                            </ShareButton>
                        </div>
                    </div>
                    <div style={{ margin: "8px 0", lineHeight: "1.4" }}>
                        <div>{kitchen.location}</div>
                        <div>{kitchen.defaultPrice[0].price.toLocaleString()}원 ~ / 1시간</div>
                        <div style={{ marginTop: 5, fontSize: 14, color: "#555" }}>
                            <img src={starIcon} alt="별점" style={{ width: 14, marginRight: 4 }} />
                            {kitchen.reviews.length > 0 ? 
                                `${averageRating} | ` 
                                : ''
                            }
                            후기 ({kitchen.reviewCount})
                        </div>
                    </div>

                    <InfoSection
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        sections={sections}
                        kitchenData={kitchen}
                    />
                </LeftSection>

                <ReservationSidebar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    count={count}
                    setCount={setCount}
                    startTime={startTime}
                    endTime={endTime}
                    handleTimeClick={handleTimeClick}
                    kitchenData={kitchen}
                />
            </ContentWrapper>

            {showShareModal && (
                <>
                    <Overlay onClick={() => setShowShareModal(false)} />
                    <ShareModal onClick={e => e.stopPropagation()}>
                        <h3>공유하기</h3>
                        <UrlInput 
                            value={window.location.href} 
                            readOnly 
                        />
                        <CopyButton onClick={handleCopyUrl}>
                            URL 복사하기
                        </CopyButton>
                    </ShareModal>
                </>
            )}
        </Container>
    );
};

export default KitchenDetailPage;
