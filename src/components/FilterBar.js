import styled from "styled-components";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaWonSign,
    FaSlidersH,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import CalendarBox from "./CalendarBox";
import CommonButton from "./Button";

const FilterContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
    position: relative;
`;

const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 2px solid #ffa500;
    border-radius: 24px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    color: #444;

    &:hover {
        background-color: #fff8ec;
    }
`;

const Popup = styled.div`
    position: absolute;
    top: 60px;
    left: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 16px 24px;
    z-index: 10;
    min-width: 280px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PopupItem = styled.div`
    padding: 6px 12px;
    border-radius: 6px;
    text-align: center;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 13px;

    &:hover {
        background-color: #ffdca8;
    }
`;

const RegionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
`;

const RegionTitle = styled.div`
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
`;

const LocationPopup = styled(Popup)`
    min-width: 360px;
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
`;

const ActionButton = styled(CommonButton)`
    background-color: ${(props) => (props.reset ? "#eee" : "#ffbc39")};
    color: ${(props) => (props.reset ? "#444" : "white")};
    font-size: 13px;
    font-weight: 500;
`;

const countButtonStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    background: "#fff",
    fontSize: "16px",
    cursor: "pointer",
};

const regions = {
    서울: [
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
    ],
    경기: [
        "수원시",
        "성남시",
        "고양시",
        "용인시",
        "부천시",
        "안산시",
        "안양시",
        "남양주시",
        "화성시",
        "평택시",
        "의정부시",
        "시흥시",
        "파주시",
        "김포시",
    ],
    인천: ["중구", "동구", "연수구", "부평구", "계양구", "서구"],
    부산: ["해운대구", "부산진구", "동래구", "수영구"],
    제주: ["제주시", "서귀포시"],
};

const FilterBar = ({ onFilterChange }) => {
    const filters = [
        { icon: <FaMapMarkerAlt />, label: "지역" },
        { icon: <FaCalendarAlt />, label: "날짜" },
        { icon: <FaUserFriends />, label: "인원" },
        { icon: <FaWonSign />, label: "가격" },
        { icon: <FaSlidersH />, label: "필터" },
    ];

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({
        city: null,
        district: null,
    });
    const [activePopup, setActivePopup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [guestCount, setGuestCount] = useState(1);
    const [priceRange, setPriceRange] = useState(50000);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const toggleFacility = (item) => {
        setSelectedFacilities((prev) =>
            prev.includes(item)
                ? prev.filter((f) => f !== item)
                : [...prev, item]
        );
    };

    const resetAllFilters = () => {
        setSelectedRegion(null);
        setSelectedLocation({ city: null, district: null });
        setGuestCount(1);
        setPriceRange(50000);
        setSelectedFacilities([]);
        setActivePopup(null);
        onFilterChange({ location: "", count: 1, price: 50000 });
    };

    useEffect(() => {
        onFilterChange({
            location: selectedLocation.district
                ? `${selectedLocation.city} ${selectedLocation.district}`
                : "",
            count: guestCount,
            price: priceRange,
        });
    }, [selectedLocation, guestCount, priceRange]);

    const renderPopup = (label) => {
        if (label === "지역") {
            return (
                <LocationPopup>
                    {!selectedRegion ? (
                        <RegionGrid>
                            {Object.keys(regions).map((region, idx) => (
                                <PopupItem
                                    key={idx}
                                    onClick={() => setSelectedRegion(region)}
                                >
                                    {region}
                                </PopupItem>
                            ))}
                        </RegionGrid>
                    ) : (
                        <>
                            <RegionTitle>{selectedRegion}</RegionTitle>
                            <RegionGrid>
                                {regions[selectedRegion].map(
                                    (district, idx) => (
                                        <PopupItem
                                            key={idx}
                                            onClick={() => {
                                                setSelectedLocation({
                                                    city: selectedRegion,
                                                    district,
                                                });
                                                setActivePopup(null);
                                                setSelectedRegion(null);
                                            }}
                                        >
                                            {district}
                                        </PopupItem>
                                    )
                                )}
                            </RegionGrid>
                            <ButtonRow>
                                <ActionButton
                                    reset
                                    onClick={() => setSelectedRegion(null)}
                                >
                                    이전
                                </ActionButton>
                                <ActionButton
                                    onClick={() => setActivePopup(null)}
                                >
                                    닫기
                                </ActionButton>
                            </ButtonRow>
                        </>
                    )}
                </LocationPopup>
            );
        }

        if (label === "날짜") {
            return (
                <Popup>
                    <CalendarBox
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                    <ButtonRow>
                        <ActionButton
                            reset
                            onClick={() => setSelectedDate(null)}
                        >
                            초기화
                        </ActionButton>
                        <ActionButton onClick={() => setActivePopup(null)}>
                            확인
                        </ActionButton>
                    </ButtonRow>
                </Popup>
            );
        }

        if (label === "인원") {
            return (
                <Popup>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <button
                            style={countButtonStyle}
                            onClick={() =>
                                setGuestCount(Math.max(1, guestCount - 1))
                            }
                        >
                            -
                        </button>
                        <span style={{ fontSize: "16px" }}>{guestCount}명</span>
                        <button
                            style={countButtonStyle}
                            onClick={() => setGuestCount(guestCount + 1)}
                        >
                            +
                        </button>
                    </div>
                    <ButtonRow>
                        <ActionButton reset onClick={() => setGuestCount(1)}>
                            초기화
                        </ActionButton>
                        <ActionButton onClick={() => setActivePopup(null)}>
                            확인
                        </ActionButton>
                    </ButtonRow>
                </Popup>
            );
        }

        if (label === "가격") {
            return (
                <Popup>
                    <div style={{ fontSize: "14px", marginBottom: "12px" }}>
                        최대 가격:{" "}
                        <strong>{priceRange.toLocaleString()}원</strong>
                    </div>
                    <input
                        type="range"
                        min="10000"
                        max="200000"
                        step="10000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
                    <ButtonRow>
                        <ActionButton
                            reset
                            onClick={() => setPriceRange(50000)}
                        >
                            초기화
                        </ActionButton>
                        <ActionButton onClick={() => setActivePopup(null)}>
                            확인
                        </ActionButton>
                    </ButtonRow>
                </Popup>
            );
        }

        if (label === "필터") {
            const facilities = [
                "인덕션",
                "오븐",
                "가스레인지",
                "제빙기",
                "믹서기",
                "에어프라이기",
                "냉장고",
                "식기세척기",
            ];
            return (
                <Popup style={{ minWidth: "300px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "12px",
                        }}
                    >
                        {facilities.map((item, idx) => (
                            <PopupItem
                                key={idx}
                                onClick={() => toggleFacility(item)}
                                style={{
                                    color: selectedFacilities.includes(item)
                                        ? "#FF6600"
                                        : "#000",
                                    fontWeight: selectedFacilities.includes(
                                        item
                                    )
                                        ? "bold"
                                        : "normal",
                                    backgroundColor: "transparent",
                                }}
                            >
                                {item}
                            </PopupItem>
                        ))}
                    </div>
                    <ButtonRow>
                        <ActionButton
                            reset
                            onClick={() => setSelectedFacilities([])}
                        >
                            초기화
                        </ActionButton>
                        <ActionButton onClick={() => setActivePopup(null)}>
                            확인
                        </ActionButton>
                    </ButtonRow>
                </Popup>
            );
        }

        return null;
    };

    return (
        <FilterContainer>
            {filters.map((filter, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                    <FilterButton
                        onClick={() =>
                            setActivePopup(activePopup === idx ? null : idx)
                        }
                    >
                        {filter.icon}
                        {filter.label}
                    </FilterButton>
                    {activePopup === idx && renderPopup(filter.label)}
                </div>
            ))}
            <ActionButton reset onClick={resetAllFilters}>
                전체 초기화
            </ActionButton>
        </FilterContainer>
    );
};

export default FilterBar;
