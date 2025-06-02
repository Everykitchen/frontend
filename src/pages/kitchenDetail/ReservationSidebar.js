import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addYears, format } from "date-fns";
import ko from "date-fns/locale/ko";
import ReservationModal from "./ReservationModal";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RightSection = styled.div`
    flex: 1;
    position: sticky;
    top: 60px;
    border: 1px solid #ffbc39;
    border-radius: 10px;
    padding: 16px 24px;
    height: calc(100vh - 150px);
    min-width: 300px;
    max-width: 330px;
    background-color: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
`;

const ScrollableContent = styled.div`
    overflow-y: auto;
    flex: 1;
    padding-right: 28px;
    margin-right: -20px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;

        &:hover {
            background: #999;
        }
    }
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
    text-align: center;
`;

const DatePickerWrapper = styled.div`
    .react-datepicker {
        font-family: inherit;
        border: none;
        width: 100%;
        font-size: 0.8rem;
    }

    .react-datepicker__month-container {
        width: 100%;
    }

    .react-datepicker__header {
        background-color: #fff;
        border-bottom: none;
        padding-top: 8px;
    }

    .react-datepicker__current-month {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    .react-datepicker__day-names {
        margin-top: 4px;
    }
    .react-datepicker__day-names {
        margin-top: 4px;
    }

    .react-datepicker__day-name {
        color: #666;
        font-size: 12px;
        width: 30px;
        line-height: 28px;
        margin: 0px;
        margin-top: 15px;
        margin-left: 5px;
        &:first-child {
            color: #ff0000;
        }
    }

    .react-datepicker__day {
        width: 30px;
        height: 28px;
        line-height: 28px;
        margin: 2px 2px;
        font-size: 12px;
        color: #333;

        &:hover {
            background-color: #fff5e6;
            border-radius: 50%;
        }

        &:first-child {
            color: #ff0000;
        }
    }

    .react-datepicker__day--selected {
        background-color: #ffbc39;
        color: white;
        border-radius: 50%;

        &:hover {
            background-color: #ffbc39;
        }

        &:first-child {
            color: white;
        }
    }

    .react-datepicker__day--disabled {
        color: #ccc;
        cursor: default;

        &:first-child {
            color: #ccc;
        }
    }
`;

const TimeContainer = styled.div`
    margin-top: 32px;
    position: relative;
    width: 100%;
`;

const TimeScrollContainer = styled.div`
    display: flex;
    overflow-x: auto;
    padding: 8px 0;
    scrollbar-width: thin;
    -ms-overflow-style: auto;
    width: 100%;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;

        &:hover {
            background: #999;
        }
    }
`;

const TimeBlockContainer = styled.div`
    position: relative;
    width: 40px;
    flex-shrink: 0;
`;

const TimeLabel = styled.div`
    position: absolute;
    top: -20px;
    right: -10px;
    font-size: 12px;
    color: #666;
`;

const FirstTimeLabel = styled.div`
    position: absolute;
    top: -20px;
    right: -10px;
    font-size: 12px;
    color: #666;
`;

const TimeBlock = styled.div`
    width: 40px;
    height: 36px;
    background-color: ${(props) => {
        if (props.disabled || props.$unavailable) return "#b8b8b8";
        if (props.selected) return "#ffbc39";
        return "#f6f6f6";
    }};
    border: 1px solid #ccc;
    cursor: ${(props) =>
        props.disabled || props.$unavailable ? "default" : "pointer"};
    position: relative;

    &:hover {
        background-color: ${(props) => {
            if (props.disabled || props.$unavailable) return null;
            if (props.selected) return "#ffbc39";
            return "#ffe4b3";
        }};
    }
`;

const TimeRange = styled.div`
    font-size: 12px;
    font-weight: bold;
    margin: 24px 0;
    white-space: pre-line;
`;

const PriceInfo = styled.div`
    margin-top: 24px;
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    gap: 16px;
    justify-content: center;
`;

const PriceItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
`;

const ColorIndicator = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 4px;
    background-color: ${(props) => props.color};
`;

const CounterWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;
`;

const CounterButton = styled.button`
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ReserveButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 12px;
    font-weight: bold;
    border-radius: 10px;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    margin-top: 16px;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

const ErrorMessage = styled.div`
    color: #ff0000;
    font-size: 12px;
    margin-top: 8px;
    text-align: center;
`;

const ReservationSidebar = ({
    startDate,
    setStartDate,
    count,
    setCount,
    kitchenData,
}) => {
    const [isDateSelected, setIsDateSelected] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [startBlock, setStartBlock] = useState(null);
    const [endBlock, setEndBlock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeBlocks, setTimeBlocks] = useState([]);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const parseHour = (str) => parseInt(str.split(":")[0], 10);
    const openHour = parseHour(kitchenData.openTime);
    const closeHour = parseHour(kitchenData.closeTime);
    const numBlocks = closeHour - openHour;

    useEffect(() => {
        const blocks = [];
        for (let i = 0; i < numBlocks; i++) {
            blocks.push({
                label: `${openHour + i}:00 ~ ${openHour + i + 1}:00`,
                hour: openHour + i,
                availableId: null,
                unavailable: false,
            });
        }
        setTimeBlocks(blocks);
    }, [kitchenData.openTime, kitchenData.closeTime, numBlocks, openHour]);

    useEffect(() => {
        if (!startDate || !kitchenData.id) return;
        setIsDateSelected(false);
        setSelectedIds([]);
        setStartBlock(null);
        setEndBlock(null);
        setErrorMessage("");
        const fetchAvailables = async () => {
            try {
                const dateStr = format(startDate, "yyyy-MM-dd");
                const res = await axios.get(
                    `/api/common/kitchen/${kitchenData.id}/availables?date=${dateStr}`
                );
                console.log("API Response:", {
                    date: dateStr,
                    kitchenId: kitchenData.id,
                    response: res.data,
                    firstItem: res.data[0],
                    availableId: res.data[0]?.availableId
                });
                
                const blocks = [];
                for (let i = 0; i < numBlocks; i++) {
                    const item = res.data[i];
                    console.log(`Block ${i}:`, {
                        hour: openHour + i,
                        item: item,
                        availableId: item?.availableId,
                        status: item?.status
                    });
                    
                    blocks.push({
                        label: `${openHour + i}:00 ~ ${openHour + i + 1}:00`,
                        hour: openHour + i,
                        availableId: item?.availableId,
                        unavailable: item?.status === true,
                    });
                }
                setTimeBlocks(blocks);
                setIsDateSelected(true);
            } catch (e) {
                console.error("예약 가능 시간 조회 실패:", e);
                setErrorMessage("예약 가능 시간 조회 실패");
                setTimeBlocks([]);
                setIsDateSelected(false);
            }
        };
        fetchAvailables();
    }, [
        startDate,
        kitchenData.id,
        kitchenData.openTime,
        kitchenData.closeTime,
        numBlocks,
        openHour,
    ]);

    const handleTimeBlockClick = (idx) => {
        if (!isDateSelected || timeBlocks[idx]?.unavailable) return;
        if (startBlock === null) {
            setStartBlock(idx);
            setEndBlock(idx);
            setSelectedIds([Number(timeBlocks[idx].availableId)]);
            setErrorMessage("");
            return;
        }
        if (idx === startBlock && startBlock === endBlock) {
            setStartBlock(null);
            setEndBlock(null);
            setSelectedIds([]);
            setErrorMessage("");
            return;
        }
        if (idx < startBlock) {
            setStartBlock(null);
            setEndBlock(null);
            setSelectedIds([]);
            setErrorMessage("");
            return;
        }
        for (let i = startBlock; i <= idx; i++) {
            if (timeBlocks[i].unavailable) {
                setErrorMessage("예약 불가능한 시간대가 포함되어 있습니다.");
                return;
            }
        }
        setEndBlock(idx);
        setSelectedIds(
            timeBlocks
                .slice(startBlock, idx + 1)
                .map((b) => Number(b.availableId))
        );
        setErrorMessage("");
    };

    const getDayPrice = (date) => {
        const days = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];
        const dayName = days[date.getDay()];
        console.log("Price calculation:", {
            selectedDate: date,
            dayName,
            defaultPrice: kitchenData.defaultPrice,
            foundPrice: kitchenData.defaultPrice.find(
                (p) => p.week === dayName
            ),
        });
        const priceInfo = kitchenData.defaultPrice.find(
            (p) => p.week === dayName
        );
        return priceInfo ? priceInfo.price : 0;
    };

    const renderReservationTime = () => {
        if (
            startBlock !== null &&
            endBlock !== null &&
            selectedIds.length > 0
        ) {
            return `예약 일시\n${format(startDate, "yyyy년 MM월 dd일")} ${
                timeBlocks[startBlock].hour
            }:00 ~ ${timeBlocks[endBlock].hour + 1}:00`;
        }
        return "";
    };

    const calculateTotalPrice = () => {
        if (startBlock === null || endBlock === null || !startDate) return 0;
        const hours = endBlock - startBlock + 1;
        const pricePerHour = getDayPrice(startDate);
        console.log("Price calculation:", {
            hours,
            pricePerHour,
            count,
            total: hours * pricePerHour * count,
        });
        return hours * pricePerHour * count;
    };

    const handleReserveClick = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", {
                state: {
                    from: window.location.pathname,
                    message: "예약을 하시려면 로그인이 필요합니다.",
                },
            });
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== "USER") {
                alert("일반 회원으로 로그인해주세요.");
                navigate("/login", {
                    state: {
                        from: window.location.pathname,
                        message: "일반 회원으로 로그인해주세요.",
                    },
                });
                return;
            }

            // 사용자 정보 가져오기
            try {
                const response = await axios.get(
                    "/api/auth/user/my-information"
                );
                setUserName(response.data.name);
                console.log(response.data);
                setIsModalOpen(true);
            } catch (error) {
                console.error("사용자 정보 조회 실패:", error);
                alert("사용자 정보를 불러오는데 실패했습니다.");
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login", {
                state: {
                    from: window.location.pathname,
                    message: "로그인이 필요합니다.",
                },
            });
        }
    };

    const filterDates = (date) => {
        const days = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];
        const dayName = days[date.getDay()];
        const priceInfo = kitchenData.defaultPrice.find(
            (p) => p.week === dayName
        );
        return priceInfo ? priceInfo.enabled : false;
    };

    return (
        <RightSection>
            <ScrollableContent>
                <SectionTitle>예약 날짜 선택</SectionTitle>
                <DatePickerWrapper>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            setStartBlock(null);
                            setEndBlock(null);
                            setSelectedIds([]);
                            setErrorMessage("");
                        }}
                        minDate={new Date()}
                        maxDate={addYears(new Date(), 1)}
                        inline
                        locale={ko}
                        dateFormat="yyyy년 MM월"
                        placeholderText="날짜를 선택해주세요"
                        filterDate={filterDates}
                    />
                </DatePickerWrapper>
                <TimeContainer>
                    <SectionTitle>예약 시간 선택</SectionTitle>
                    <TimeScrollContainer>
                        <div style={{ display: "flex", paddingTop: "20px" }}>
                            <div
                                style={{ width: "15px", position: "relative" }}
                            >
                                <FirstTimeLabel>{openHour}</FirstTimeLabel>
                            </div>
                            {timeBlocks.map((block, i) => {
                                const isSelected =
                                    startBlock !== null &&
                                    endBlock !== null &&
                                    i >= startBlock &&
                                    i <= endBlock;
                                const isUnavailable = block.unavailable;
                                const isDisabled = !isDateSelected;
                                return (
                                    <TimeBlockContainer
                                        key={block.availableId || i}
                                    >
                                        {i < timeBlocks.length && (
                                            <>
                                                <TimeLabel>
                                                    {block.hour + 1}
                                                </TimeLabel>
                                                <TimeBlock
                                                    selected={isSelected}
                                                    $unavailable={isUnavailable}
                                                    disabled={isDisabled}
                                                    onClick={() =>
                                                        handleTimeBlockClick(i)
                                                    }
                                                />
                                            </>
                                        )}
                                    </TimeBlockContainer>
                                );
                            })}
                            <div style={{ width: "20px" }} />
                        </div>
                    </TimeScrollContainer>
                    {errorMessage && (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}
                </TimeContainer>
                <PriceInfo>
                    <PriceItem>
                        <ColorIndicator color="#f6f6f6" />
                        <span>가능</span>
                    </PriceItem>
                    <PriceItem>
                        <ColorIndicator color="#b8b8b8" />
                        <span>예약불가</span>
                    </PriceItem>
                    <PriceItem>
                        <ColorIndicator color="#ffbc39" />
                        <span>선택</span>
                    </PriceItem>
                </PriceInfo>
                <TimeRange>{renderReservationTime()}</TimeRange>
                <div style={{ marginTop: 32 }}>
                    <SectionTitle>예약 인원</SectionTitle>
                    <CounterWrapper>
                        <CounterButton
                            onClick={() =>
                                setCount((c) =>
                                    Math.max(
                                        kitchenData.baseClientNumber,
                                        c - 1
                                    )
                                )
                            }
                            disabled={count <= kitchenData.baseClientNumber}
                        >
                            -
                        </CounterButton>
                        <div style={{ fontSize: "12px" }}>{count}</div>
                        <CounterButton
                            onClick={() =>
                                setCount((c) =>
                                    Math.min(kitchenData.maxClientNumber, c + 1)
                                )
                            }
                            disabled={count >= kitchenData.maxClientNumber}
                        >
                            +
                        </CounterButton>
                    </CounterWrapper>
                </div>
                <div style={{ marginTop: 32 }}>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        공간 대여료
                    </div>
                    <h2
                        style={{
                            color: "#ffbc39",
                            margin: "4px 0",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                    >
                        ₩ {calculateTotalPrice().toLocaleString()}
                    </h2>
                    {startDate && startBlock !== null && endBlock !== null && (
                        <div style={{ fontSize: 10, color: "#666" }}>
                            {`(${getDayPrice(
                                startDate
                            ).toLocaleString()}원/시간 × ${
                                endBlock - startBlock + 1
                            }시간 × ${count}명)`}
                        </div>
                    )}
                </div>
                <ReserveButton
                    disabled={
                        startBlock === null ||
                        endBlock === null ||
                        selectedIds.length === 0
                    }
                    onClick={handleReserveClick}
                >
                    예약하기
                </ReserveButton>
            </ScrollableContent>
            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                kitchenId={kitchenData.id}
                kitchenName={kitchenData.kitchenName}
                reservationDate={startDate}
                startTime={
                    startBlock !== null ? timeBlocks[startBlock].hour : null
                }
                endTime={
                    endBlock !== null ? timeBlocks[endBlock].hour + 1 : null
                }
                guestCount={count}
                totalPrice={calculateTotalPrice()}
                selectedIds={selectedIds}
                userName={userName}
                accountNumber={kitchenData.accountNumber}
                bankName={kitchenData.bankName}
                accountHolderName={kitchenData.accountHolderName}
                onReservationSuccess={() => navigate("/mypage/reservations")}
            />
        </RightSection>
    );
};

export default ReservationSidebar; 