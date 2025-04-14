// components/FilterBar.js
import styled from "styled-components";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaWonSign,
    FaSlidersH,
} from "react-icons/fa";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const FilterBar = () => {
    const filters = [
        { icon: <FaMapMarkerAlt />, label: "지역" },
        { icon: <FaCalendarAlt />, label: "날짜" },
        { icon: <FaUserFriends />, label: "인원" },
        { icon: <FaWonSign />, label: "가격" },
        { icon: <FaSlidersH />, label: "필터" },
    ];

    const [activePopup, setActivePopup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

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
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        inline
                        minDate={new Date()}
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
