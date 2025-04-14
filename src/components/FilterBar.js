import styled from "styled-components";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaWonSign,
    FaSlidersH,
} from "react-icons/fa";
import { useState } from "react";
import Calendar from "react-calendar";
import { addMonths } from "date-fns";
import "react-calendar/dist/Calendar.css";

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
    top: 48px;
    left: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 10;
    width: 600px;
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

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
`;

const ActionButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    background-color: ${(props) => (props.reset ? "#eee" : "#FFA500")};
    color: ${(props) => (props.reset ? "#444" : "white")};
    font-size: 13px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
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

const FilterBar = () => {
    const filters = [
        { icon: <FaMapMarkerAlt />, label: "지역" },
        { icon: <FaCalendarAlt />, label: "날짜" },
        { icon: <FaUserFriends />, label: "인원" },
        { icon: <FaWonSign />, label: "가격" },
        { icon: <FaSlidersH />, label: "필터" },
    ];

    const [activePopup, setActivePopup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [guestCount, setGuestCount] = useState(1);
    const [priceRange, setPriceRange] = useState(50000);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const toggleFacility = (item) => {
        if (selectedFacilities.includes(item)) {
            setSelectedFacilities((prev) => prev.filter((f) => f !== item));
        } else {
            setSelectedFacilities((prev) => [...prev, item]);
        }
    };

    const renderPopup = (label) => {
        if (label === "지역") {
            const locations = [
                "서울",
                "경기도",
                "인천",
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
            ];
            return (
                <Popup>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: "10px",
                        }}
                    >
                        {locations.map((loc, idx) => (
                            <PopupItem key={idx}>{loc}</PopupItem>
                        ))}
                    </div>
                </Popup>
            );
        }

        if (label === "날짜") {
            return (
                <Popup>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        locale="ko-KR"
                        prev2Label={null} // << 제거
                        next2Label={null} // >> 제거
                        minDate={new Date()} // 오늘 이후만 선택 가능
                        maxDate={addMonths(new Date(), 4)} // 4개월 이내까지만
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
                <Popup style={{ width: "300px" }}>
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
        </FilterContainer>
    );
};

export default FilterBar;
