import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import HostSideBar from "../../components/HostSideBar";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 60px;
    margin-top: 30px;
    flex: 1;
`;

const TopSection = styled.div`
    display: flex;
    gap: 40px;
    margin-bottom: 60px;
`;

const KitchenSection = styled.div`
    width: 50%;
`;

const SalesSection = styled.div`
    width: 50%;
`;

const SectionTitle = styled.h3`
    font-size: 24px;
    color: #000;
    font-weight: bold;
    margin-bottom: 16px;
`;

const KitchenList = styled.div`
    background: white;
    border-radius: 12px;
    padding: 20px;
`;

const KitchenName = styled.span`
    color: #000;
    font-weight: 500;
    letter-spacing: -1px;
    font-size: 20px;
    padding-left: 4px;
`;

const SelectAllLabel = styled.div`
    margin-bottom: 0px;
    font-size: 14px;
    color: #000;
    font-weight: 500;
    text-align: right;
    padding-right: 5px;
`;

const KitchenItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    color: var(--grey-1, #9b9b9b);
    font-size: 19px;
    font-weight: 400;
    letter-spacing: -0.44px;

    .kitchen-name {
        color: ${(props) => (props.selected ? "#FF7926" : "#9B9B9B")};
    }

    svg path {
        fill: ${(props) => (props.selected ? "#FF7926" : "#9B9B9B")};
    }
`;

const CheckIconWrapper = styled.div`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

const SalesList = styled.div`
    background: #fcfcfc;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    width: 90%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 400px;
`;

const SalesContent = styled.div`
    flex-grow: 1;
    overflow-y: hidden;
`;

const SalesItem = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 12px 0px;
    cursor: pointer;
    color: #000;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 30px;

    &:hover {
        background: #f5f5f5;
        border-radius: 8px;
    }
`;

const SalesHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 12px 0px;
    font-weight: 500;
    color: #000;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 0;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #ff7926;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    gap: 8px;
`;

const PageButton = styled.button`
    padding: 8px 12px;
    border: none;
    background: ${(props) => (props.active ? "#FFBC39" : "white")};
    color: ${(props) => (props.active ? "white" : "#666")};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    border-radius: 4px;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};

    &:hover {
        background: ${(props) => (props.active ? "#FFBC39" : "#f5f5f5")};
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const BottomSection = styled.div`
    background: #fcfcfc;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 40px;

    @media (min-width: 1200px) {
        flex-direction: row;
    }
`;

const ChartSection = styled.div`
    width: 100%;
    min-width: 0;

    @media (min-width: 1200px) {
        width: 45%;
    }
`;

const TableSection = styled.div`
    width: 100%;
    position: relative;
    padding-top: 24px;

    @media (min-width: 1200px) {
        width: 55%;
        padding-left: 40px;
        &::before {
            content: "";
            position: absolute;
            top: 30px;
            left: 0;
            height: 80%;
            width: 1px;
            background-color: #e0e0e0;
        }
    }
`;

const ChartContainer = styled.div`
    position: relative;
    width: 100%;
    height: 320px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 1200px) {
        width: 450px;
    }
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 300px;
    position: relative;
`;

const AxisLabel = styled.div`
    position: absolute;
    font-size: 13px;
    color: #888;
    &.y-axis {
        left: 10px;
        top: 0;
    }
    &.x-axis {
        right: 0;
        bottom: 0;
        transform: translateX(-50%);
    }
`;

const YearSelectWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`;

const DropdownWrapper = styled.div`
    position: relative;
    width: 120px;
    font-size: 14px;
`;

const DropdownButton = styled.button`
    width: 100%;
    height: 32px;
    background: #fff;
    border: 1px solid
        ${({ value }) => (value === "recent" ? "#999" : "#ffa500")};
    border-radius: 6px;
    padding: 0 12px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${({ value }) => (value === "recent" ? "#888" : "#222")};
    font-size: 14px;
`;

const DropdownList = styled.ul`
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ffa500;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 20;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const DropdownItem = styled.li`
    padding: 10px 14px;
    cursor: pointer;
    color: ${({ selected }) => (selected ? "#ffa500" : "#222")};
    background: ${({ selected }) => (selected ? "#fff8e1" : "#fff")};
    font-weight: ${({ selected }) => (selected ? 700 : 400)};
    &:hover {
        background: #fff3d1;
        color: #ffa500;
    }
`;

const KitchenHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    color: #767676;
    font-size: 14px;
    svg path {
        fill: ${({ selected }) => (selected ? "#FF7926" : "#9B9B9B")};
    }
`;

const SalesTable = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 0;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 60px;
        padding: 24px;
    }
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 16px;
    color: ${(props) => (props.isHeader ? "#000" : "#767676")};
    font-weight: ${(props) => (props.isHeader ? "600" : "400")};
`;

const oddMonthLabels = ["01", "03", "05", "07", "09", "11"];
const xTickFormatter = (tick) => {
    if (tick.includes(".")) return tick; // 25.01
    if (oddMonthLabels.includes(tick.padStart(2, "0"))) return `${tick}`;
    return "";
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // label이 '25.01' 형식이면 '2025년 1월'로, 아니면 '1월' 형식으로 표시
        const displayLabel = label.includes(".")
            ? `${label.split(".")[0]}년 ${parseInt(label.split(".")[1])}월`
            : `${label}월`;

        return (
            <div
                style={{
                    background: "white",
                    padding: "8px 12px",
                    border: "1px solid #E0E0E0",
                    fontSize: "14px",
                    borderRadius: "4px",
                }}
            >
                <p style={{ margin: 0 }}>{displayLabel}</p>
                <p
                    style={{
                        margin: "4px 0 0 0",
                        color: "#FF7926",
                        fontWeight: "500",
                    }}
                >
                    {`${payload[0].value.toLocaleString()}만원`}
                </p>
            </div>
        );
    }
    return null;
};

const HostSales = () => {
    const navigate = useNavigate();
    const [selectedKitchens, setSelectedKitchens] = useState([]);
    const [kitchenId, setKitchenId] = useState(null);
    const [kitchens, setKitchens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState("recent");
    const [reservations, setReservations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [monthlyData, setMonthlyData] = useState([]);
    const itemsPerPage = 5;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const currentYear = new Date().getFullYear();
    const yearOptions = [
        { value: "recent", label: "최근" },
        { value: currentYear, label: `${currentYear}년` },
        { value: currentYear - 1, label: `${currentYear - 1}년` },
        { value: currentYear - 2, label: `${currentYear - 2}년` },
    ];

    // 주방 목록 조회
    const fetchKitchens = async () => {
        try {
            const response = await api.get("/api/host/my-kitchens");
            setKitchens(response.data);
            // 초기에는 첫 번째 주방만 선택
            if (response.data.length > 0) {
                setSelectedKitchens([response.data[0].kitchenId]);
                setKitchenId(response.data[0].kitchenId);
            }
        } catch (error) {
            console.error("주방 정보 조회 실패:", error);
        }
    };

    // 미정산 내역 조회
    const fetchReservations = async (page) => {
        try {
            const params = {
                page: page - 1,
                size: itemsPerPage,
            };
            if (kitchenId) {
                params.kitchenId = kitchenId;
            }
            const response = await api.get("/host/awaiting-payment", {
                params,
            });
            // contents가 배열 안의 배열 형태로 오므로 첫 번째 배열을 사용
            setReservations(response.data.contents[0] || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("미정산 내역 조회 실패:", error);
        }
    };

    // 통계 데이터 조회
    const fetchStatistics = async () => {
        try {
            // 현재 날짜의 월의 마지막 날짜 계산
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1; // 0-based month
            const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜
            const lastDayStr = `${year}-${String(month).padStart(
                2,
                "0"
            )}-${String(lastDay).padStart(2, "0")}`;

            const params = {
                end:
                    selectedYear === "recent"
                        ? lastDayStr
                        : `${selectedYear}-12-31`,
                interval: "MONTH",
            };

            // kitchenId가 null이 아닐 때만 파라미터에 추가
            if (kitchenId) {
                params.kitchenId = kitchenId;
            }

            console.log("통계 API 호출:", params);

            const response = await api.get("/api/host/statistics", { params });
            console.log("통계 API 응답:", response.data);

            const formattedData = response.data.map((item) => {
                const [year, month] = item.term.split("-");
                return {
                    month:
                        month === "01"
                            ? `${year.slice(2)}.01`
                            : `${parseInt(month, 10)}`,
                    monthLabel:
                        month === "01"
                            ? `${year.slice(2)}.01`
                            : `${parseInt(month, 10)}`,
                    tableLabel:
                        month === "01"
                            ? `${year.slice(2)}년 1월`
                            : `${parseInt(month, 10)}월`,
                    revenue: Math.round(item.revenue / 10000),
                };
            });

            setMonthlyData(formattedData);
        } catch (error) {
            console.error("통계 데이터 조회 실패:", error);
            setMonthlyData([]); // 에러 시 빈 배열로 초기화
        }
    };

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClick = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdownOpen]);

    useEffect(() => {
        fetchKitchens();
    }, []);

    useEffect(() => {
        if (kitchens.length > 0) {
            fetchReservations(currentPage);
            // kitchenId나 selectedYear가 변경될 때마다 통계 데이터 새로 조회
            fetchStatistics();
        }
    }, [kitchenId, selectedYear, currentPage]); // selectedKitchens 제거하고 kitchenId로 변경

    const handleKitchenSelect = (kitchenIdClicked) => {
        if (kitchenIdClicked === "all") {
            // 전체선택 토글
            if (selectedKitchens.length === kitchens.length) {
                // 전체선택 해제 → 첫 주방만 선택
                if (kitchens.length > 0) {
                    setSelectedKitchens([kitchens[0].kitchenId]);
                    setKitchenId(kitchens[0].kitchenId);
                }
            } else {
                // 전체선택 → 모두 선택, kitchenId는 null
                setSelectedKitchens(kitchens.map((k) => k.kitchenId));
                setKitchenId(null);
            }
        } else {
            // 단일 주방 선택
            setSelectedKitchens([kitchenIdClicked]);
            setKitchenId(kitchenIdClicked);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSalesItemClick = (reservationId) => {
        navigate(`/host-mypage/reservations/${reservationId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    // 드롭다운 화살표 색상 조건부 스타일
    const getDropdownArrowColor = (selectedYear, dropdownOpen) => {
        return selectedYear === "recent" && !dropdownOpen ? "#888" : "#ffa500";
    };

    // 전체선택/주방 아이콘 색상 조건
    const isAllSelected =
        selectedKitchens.length === kitchens.length && kitchens.length > 0;

    // 전체선택 텍스트 버튼 스타일 추가
    const SelectAllButton = styled.button`
        background: none;
        border: none;
        color: ${({ active }) => (active ? "#FF7926" : "#9B9B9B")};
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        padding: 0 0 0 0;
        margin-bottom: 8px;
    `;

    return (
        <Container>
            <HostSideBar />
            <ContentWrapper>
                <TopSection>
                    <KitchenSection>
                        <SectionTitle>운영 중인 주방</SectionTitle>
                        <KitchenList>
                            <KitchenHeader>
                                <KitchenName>주방명</KitchenName>
                                <SelectAllButton
                                    active={isAllSelected}
                                    onClick={() => handleKitchenSelect("all")}
                                >
                                    전체선택
                                </SelectAllButton>
                            </KitchenHeader>
                            {[...kitchens].map((kitchen) => (
                                <KitchenItem
                                    key={kitchen.kitchenId}
                                    onClick={() =>
                                        handleKitchenSelect(kitchen.kitchenId)
                                    }
                                    selected={selectedKitchens.includes(
                                        kitchen.kitchenId
                                    )}
                                >
                                    <span className="kitchen-name">
                                        {kitchen.kitchenName}
                                    </span>
                                    <CheckIconWrapper>
                                        <CheckIcon
                                            style={{
                                                fill: selectedKitchens.includes(
                                                    kitchen.kitchenId
                                                )
                                                    ? "#FF7926"
                                                    : "#9B9B9B",
                                            }}
                                        />
                                    </CheckIconWrapper>
                                </KitchenItem>
                            ))}
                        </KitchenList>
                    </KitchenSection>

                    <SalesSection>
                        <SectionTitle>미정산 내역</SectionTitle>
                        <SalesList>
                            <SalesContent>
                                <SalesHeader>
                                    <div>이용날짜</div>
                                    <div>예약번호</div>
                                    <div>예약자</div>
                                </SalesHeader>
                                {reservations.map((item) => (
                                    <SalesItem
                                        key={item.reservationId}
                                        onClick={() =>
                                            handleSalesItemClick(
                                                item.reservationId
                                            )
                                        }
                                    >
                                        <div>{formatDate(item.date)}</div>
                                        <div>{item.reservationId}</div>
                                        <div>{item.userName}</div>
                                    </SalesItem>
                                ))}
                            </SalesContent>
                            <Pagination>
                                <PageButton
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                >
                                    이전
                                </PageButton>
                                {[...Array(totalPages)].map((_, i) => (
                                    <PageButton
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        active={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PageButton>
                                ))}
                                <PageButton
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    다음
                                </PageButton>
                            </Pagination>
                        </SalesList>
                    </SalesSection>
                </TopSection>

                <BottomSection>
                    <ChartSection>
                        <YearSelectWrapper>
                            <DropdownWrapper ref={dropdownRef}>
                                <DropdownButton
                                    onClick={() => setDropdownOpen((v) => !v)}
                                    value={selectedYear}
                                >
                                    {yearOptions.find(
                                        (opt) => opt.value === selectedYear
                                    )?.label || "연도 선택"}
                                    <span
                                        style={{
                                            fontSize: 14,
                                            marginLeft: 8,
                                            color: getDropdownArrowColor(
                                                selectedYear,
                                                dropdownOpen
                                            ),
                                        }}
                                    >
                                        {dropdownOpen ? "▲" : "▼"}
                                    </span>
                                </DropdownButton>
                                {dropdownOpen && (
                                    <DropdownList>
                                        {yearOptions.map((opt) => (
                                            <DropdownItem
                                                key={opt.value}
                                                selected={
                                                    selectedYear === opt.value
                                                }
                                                onClick={() => {
                                                    setSelectedYear(opt.value);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {opt.label}
                                            </DropdownItem>
                                        ))}
                                    </DropdownList>
                                )}
                            </DropdownWrapper>
                        </YearSelectWrapper>
                        <ChartContainer>
                            <ChartWrapper>
                                <BarChart
                                    width={
                                        window.innerWidth >= 1200 ? 450 : "100%"
                                    }
                                    height={300}
                                    data={monthlyData}
                                    margin={{
                                        top: 5,
                                        right: 20,
                                        left: 20,
                                        bottom: 30,
                                    }}
                                    barSize={12}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="monthLabel"
                                        tickFormatter={xTickFormatter}
                                        tick={{ fontSize: 12 }}
                                        interval={
                                            window.innerWidth >= 1200 ? 0 : 1
                                        }
                                    />
                                    <YAxis />
                                    <Tooltip
                                        cursor={false}
                                        content={<CustomTooltip />}
                                    />
                                    <Bar dataKey="revenue" fill="#FFBC39" />
                                </BarChart>
                                <AxisLabel className="y-axis">매출액</AxisLabel>
                                <AxisLabel className="x-axis">월</AxisLabel>
                            </ChartWrapper>
                        </ChartContainer>
                    </ChartSection>

                    <TableSection>
                        <SalesTable>
                            <div>
                                <TableRow isHeader>
                                    <span>월</span>
                                    <span>매출액</span>
                                </TableRow>
                                {monthlyData.slice(0, 6).map((data, index) => (
                                    <TableRow key={index}>
                                        <span>{data.tableLabel}</span>
                                        <span>
                                            {data.revenue.toLocaleString()}만원
                                        </span>
                                    </TableRow>
                                ))}
                            </div>
                            <div>
                                <TableRow isHeader>
                                    <span>월</span>
                                    <span>매출액</span>
                                </TableRow>
                                {monthlyData.slice(6).map((data, index) => (
                                    <TableRow key={index + 6}>
                                        <span>{data.tableLabel}</span>
                                        <span>
                                            {data.revenue.toLocaleString()}만원
                                        </span>
                                    </TableRow>
                                ))}
                            </div>
                        </SalesTable>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 16,
                                width: "100%",
                                padding: "0 24px",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    textAlign: "right",
                                    width: "100%",
                                }}
                            >
                                총 매출액:{" "}
                                {monthlyData
                                    .reduce((sum, d) => sum + d.revenue, 0)
                                    .toLocaleString()}
                                만원
                            </span>
                        </div>
                    </TableSection>
                </BottomSection>
            </ContentWrapper>
        </Container>
    );
};

export default HostSales;
