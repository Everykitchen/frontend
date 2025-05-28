import styled from "styled-components";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaWonSign,
    FaSlidersH,
    FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import CalendarBox from "./CalendarBox";
import CommonButton from "./Button";

const MAIN_ORANGE = "#ffa500";

const BarWrapper = styled.div`
    width: 100%;
    max-width: 700px;
    margin: 0 auto 20px auto;
    background: #fefefe;
    border: 1.7px solid ${MAIN_ORANGE};
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    height: 45px;
    box-sizing: border-box;
    position: relative;
`;

const ItemWrapper = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const ItemButton = styled.button`
    background: none;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 16.5px;
    color: ${({ selected }) => (selected ? "#ff6f1f" : "#444")};
    font-weight: 500;
    cursor: pointer;
    padding: 0 22px;
    height: 48px;
    transition: color 0.2s;
    position: relative;
    z-index: 2;
    background: none;
    svg {
        color: ${({ selected }) => (selected ? "#ff6f1f" : "#444")};
        font-size: 17px;
        transition: color 0.2s;
    }
    &:hover {
        color: #ff6f1f;
        svg { color: #ff6f1f; }
    }
`;

const CancelIcon = styled(FaTimes)`
    margin-left: 2px;
    font-size: 12px;
    color: ${({ selected }) => (selected ? "#ff6f1f" : "#bbb")};
    cursor: pointer;
    &:hover { color: #ff6f1f; }
`;

const Divider = styled.div`
    width: 1.2px;
    height: 22px;
    background: ${MAIN_ORANGE};
`;

const Popup = styled.div`
    position: absolute;
    left: 50%;
    top: 48px;
    transform: translateX(-50%);
    min-width: 360px;
    max-width: 500px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.10);
    padding: 18px 24px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RegionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    width: 100%;
    min-width: 360px;
`;
const RegionTitle = styled.div`
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
`;
const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
`;
const ActionButton = styled(CommonButton)`
    background-color: rgb(255, 242, 217);
    color: #444;
    font-size: 13px;
    font-weight: 500;
    &:hover {
        background-color: rgb(255, 229, 177);
        color: #000;
    }
`;

const StyledCountButton = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 17px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;

`;

const regions = {
    서울: [
        "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
    ],
    경기: [
        "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "김포시",
    ],
    인천: ["중구", "동구", "연수구", "부평구", "계양구", "서구"],
    부산: ["해운대구", "부산진구", "동래구", "수영구","강서구", "사상구","사하구","서구","동구","영도구","연제구","금정구"],
    제주: ["제주시", "서귀포시"],
};

const facilities = [
    "인덕션", "오븐", "가스레인지", "제빙기", "믹서기", "에어프라이기", "냉장고", "식기세척기",
];

const StyledRegionItem = styled.div`
    padding: 6px 12px;
    border-radius: 6px;
    text-align: center;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 13px;
    margin-bottom: 2px;
    transition: background 0.15s, color 0.15s;
    &:hover {
        background:rgb(255, 248, 233);
        color: #ff6f1f;
    }
`;
const StyledDistrictItem = styled.div`
    padding: 6px 12px;
    border-radius: 6px;
    text-align: center;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 13px;
    margin-bottom: 2px;
    transition: background 0.15s, color 0.15s;
    &:hover {
        background:rgb(255, 248, 233);
        color: #ff6f1f;
    }
`;
const StyledFacilityItem = styled.div`
    padding: 6px 18px;
    border-radius: 6px;
    text-align: center;
    background: none;
    cursor: pointer;
    font-size: 13px;
    margin-bottom: 2px;
    color: ${({ selected }) => (selected ? "#ff6f1f" : "#000")};
    font-weight: ${({ selected }) => (selected ? 700 : 600)};
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
    &:hover {
        color: #ff6f1f;
    }
`;

const NewFilterBar = ({ onFilterChange }) => {
    const filters = [
        { icon: <FaMapMarkerAlt />, label: "지역" },
        { icon: <FaCalendarAlt />, label: "날짜" },
        { icon: <FaUserFriends />, label: "인원" },
        { icon: <FaWonSign />, label: "가격" },
        { icon: <FaSlidersH />, label: "시설" },
    ];
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({ city: null, district: null });
    const [activeIdx, setActiveIdx] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [guestCount, setGuestCount] = useState(null);
    const [priceRange, setPriceRange] = useState(null);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const toggleFacility = (item) => {
        setSelectedFacilities((prev) =>
            prev.includes(item)
                ? prev.filter((f) => f !== item)
                : [...prev, item]
        );
    };

    const resetFilter = (label) => {
        switch (label) {
            case "지역":
                setSelectedLocation({ city: null, district: null });
                break;
            case "날짜":
                setSelectedDate(null);
                break;
            case "인원":
                setGuestCount(null);
                break;
            case "가격":
                setPriceRange(null);
                break;
            case "시설":
                setSelectedFacilities([]);
                break;
            default:
                break;
        }
    };

    const hasValue = (label) => {
        switch (label) {
            case "지역":
                return !!selectedLocation.district;
            case "날짜":
                return !!selectedDate;
            case "인원":
                return guestCount !== null;
            case "가격":
                return priceRange !== null;
            case "시설":
                return selectedFacilities.length > 0;
            default:
                return false;
        }
    };

    useEffect(() => {
        onFilterChange && onFilterChange({
            location: selectedLocation.district ? `${selectedLocation.city} ${selectedLocation.district}` : "",
            date: selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : "",
            count: guestCount || null,
            price: priceRange || 200000,
            facilities: selectedFacilities,
        });
    }, [selectedLocation, selectedDate, guestCount, priceRange, selectedFacilities]);

    const getFilterLabel = (label) => {
        switch (label) {
            case "지역":
                return selectedLocation.district || label;
            case "날짜":
                return selectedDate ? new Date(selectedDate).toLocaleDateString("ko-KR") : label;
            case "인원":
                return guestCount > 1 ? `${guestCount}명` : label;
            case "가격":
                return priceRange ? `${priceRange.toLocaleString()}원 이하` : label;
            case "시설":
                return selectedFacilities.length > 0 ? `${selectedFacilities.length}개 선택됨` : label;
            default:
                return label;
        }
    };

    const renderPopup = (idx, label) => {
        if (activeIdx !== idx) return null;
        if (label === "지역") {
            return (
                <Popup>
                    {!selectedRegion ? (
                        <RegionGrid>
                            {Object.keys(regions).map((region, i) => (
                                <StyledRegionItem
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                >
                                    {region}
                                </StyledRegionItem>
                            ))}
                        </RegionGrid>
                    ) : (
                        <>
                            <RegionTitle>{selectedRegion}</RegionTitle>
                            <RegionGrid>
                                {regions[selectedRegion].map((district, i) => (
                                    <StyledDistrictItem
                                        key={district}
                                        onClick={() => {
                                            setSelectedLocation({ city: selectedRegion, district });
                                            setSelectedRegion(null);
                                            setActiveIdx(null);
                                        }}
                                    >
                                        {district}
                                    </StyledDistrictItem>
                                ))}
                            </RegionGrid>
                            <ButtonRow>
                                <ActionButton reset onClick={() => setSelectedRegion(null)}>이전</ActionButton>
                            </ButtonRow>
                        </>
                    )}
                </Popup>
            );
        }
        if (label === "날짜") {
            return (
                <Popup>
                    <CalendarBox
                        value={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setActiveIdx(null);
                        }}
                    />
                </Popup>
            );
        }
        if (label === "인원") {
            return (
                <Popup>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <StyledCountButton
                            onClick={() => setGuestCount(Math.max(1, (guestCount || 1) - 1))}
                        >
                            -
                        </StyledCountButton>
                        <span style={{ fontSize: "15px", fontWeight: "600" }}>{guestCount ? `${guestCount} 명 ` : "인원"}</span>
                        <StyledCountButton
                            onClick={() => setGuestCount((guestCount || 1) + 1)}
                        >
                            +
                        </StyledCountButton>
                    </div>
                </Popup>
            );
        }
        if (label === "가격") {
            return (
                <Popup>
                    <div style={{ fontSize: "15px",fontWeight: "700", marginBottom: "10px" }}>
                        최대 가격: <strong>{(priceRange ?? 200000).toLocaleString()}원</strong>
                    </div>
                    <input
                        type="range"
                        min="10000"
                        max="200000"
                        step="10000"
                        value={priceRange ?? 200000}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
                </Popup>
            );
        }
        if (label === "시설") {
            return (
                <Popup style={{ minWidth: "360px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", width: "100%" }}>
                        {facilities.map((item, i) => (
                            <StyledFacilityItem
                                key={item}
                                selected={selectedFacilities.includes(item)}
                                onClick={() => toggleFacility(item)}
                            >
                                {item}
                            </StyledFacilityItem>
                        ))}
                    </div>
                </Popup>
            );
        }
        return null;
    };

    return (
        <BarWrapper>
            {filters.map((filter, idx) => (
                <ItemWrapper key={filter.label}>
                    {idx > 0 && <Divider />}
                    <ItemButton
                        selected={hasValue(filter.label)}
                        onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                    >
                        {filter.icon}
                        <span>{getFilterLabel(filter.label)}</span>
                        {hasValue(filter.label) && (
                            <CancelIcon
                                selected={hasValue(filter.label)}
                                onClick={e => {
                                    e.stopPropagation();
                                    resetFilter(filter.label);
                                }}
                                title="필터 해제"
                            />
                        )}
                    </ItemButton>
                    {renderPopup(idx, filter.label)}
                </ItemWrapper>
            ))}
        </BarWrapper>
    );
};

export default NewFilterBar; 