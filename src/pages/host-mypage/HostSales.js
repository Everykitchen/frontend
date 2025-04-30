import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HostSideBar from '../../components/HostSideBar';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    padding: 40px;
    padding-left: 100px;
    margin-top: 60px;
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
    font-size: 20px;
    margin-bottom: 24px;
    color: #000;
    font-weight: 600;
    letter-spacing: -1.2px;
    margin-left: 10px;
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
    color: var(--grey-1, #9B9B9B);
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.44px;
    
    .kitchen-name {
        color: ${props => props.selected ? '#FF7926' : '#9B9B9B'};
    }

    svg path {
        fill: ${props => props.selected ? '#FF7926' : '#9B9B9B'};
    }
`;

const CheckIconWrapper = styled.div`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

const SalesList = styled.div`
    background: #FCFCFC;
    border: 1px solid #E0E0E0;
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
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #FF7926;
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
    background: ${props => props.active ? '#FFBC39' : 'white'};
    color: ${props => props.active ? 'white' : '#666'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    border-radius: 4px;
    font-weight: ${props => props.active ? 'bold' : 'normal'};

    &:hover {
        background: ${props => props.active ? '#FFBC39' : '#f5f5f5'};
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const BottomSection = styled.div`
    background: #FCFCFC;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 40px;
`;

const ChartSection = styled.div`
    width: 40%;
`;

const TableSection = styled.div`
    width: 50%;
    position: relative;
    padding-top: 24px;

    &::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 50%;
        height: 80%;
        width: 1px;
        background-color: #E0E0E0;
    }
`;

const YearSelectWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`;

const YearSelect = styled.select`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
`;

const KitchenHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    color: #767676;
    font-size: 14px;

    svg path {
        fill: ${props => props.selected ? '#FF7926' : '#9B9B9B'};
    }
`;

const SalesTable = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 60px;
    padding: 24px;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 16px;
    color: ${props => props.isHeader ? '#000' : '#767676'};
    font-weight: ${props => props.isHeader ? '600' : '400'};
`;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ 
                background: 'white', 
                padding: '8px 12px', 
                border: '1px solid #E0E0E0',
                fontSize: '14px',
                borderRadius: '4px',
            }}>
                <p style={{ margin: 0 }}>{label}</p>
                <p style={{ margin: '4px 0 0 0', color: '#FF7926', fontWeight: '500' }}>
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
    const [kitchens, setKitchens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [reservations, setReservations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [monthlyData, setMonthlyData] = useState([]);
    const itemsPerPage = 5;

    // 임시 데이터
    const tempKitchens = [
        { kitchenId: 123, kitchenName: "파이브잇 쿠킹스튜디오 홍대점" },
        { kitchenId: 124, kitchenName: "마이 키친" },
        { kitchenId: 125, kitchenName: "쿠킹 아카데미 강남센터" },
        { kitchenId: 126, kitchenName: "달달한 주방" },
        { kitchenId: 127, kitchenName: "쿠킹 스튜디오 더 테이블" },
    ];

    const tempReservations = [
        { reservationId: "20240301", userName: "문민선", date: "2024-03-26" },
        { reservationId: "20240302", userName: "김태희", date: "2024-03-25" },
        { reservationId: "20240303", userName: "전지현", date: "2024-03-24" },
        { reservationId: "20240304", userName: "송혜교", date: "2024-03-23" },
        { reservationId: "20240305", userName: "한가인", date: "2024-03-22" },
        { reservationId: "20240306", userName: "이영애", date: "2024-03-21" },
        { reservationId: "20240307", userName: "수지", date: "2024-03-20" },
        { reservationId: "20240308", userName: "아이유", date: "2024-03-19" },
        { reservationId: "20240309", userName: "윤아", date: "2024-03-18" },
        { reservationId: "20240310", userName: "태연", date: "2024-03-17" },
        { reservationId: "20240311", userName: "서현", date: "2024-03-16" },
        { reservationId: "20240312", userName: "티파니", date: "2024-03-15" },
        { reservationId: "20240313", userName: "제시카", date: "2024-03-14" },
        { reservationId: "20240314", userName: "써니", date: "2024-03-13" },
        { reservationId: "20240315", userName: "효연", date: "2024-03-12" },
        { reservationId: "20240316", userName: "유리", date: "2024-03-11" },
        { reservationId: "20240317", userName: "수영", date: "2024-03-10" },
        { reservationId: "20240318", userName: "윤아", date: "2024-03-09" },
    ];

    const tempMonthlyData = [
        { month: "1월", revenue: 150 },
        { month: "2월", revenue: 120 },
        { month: "3월", revenue: 180 },
        { month: "4월", revenue: 160 },
        { month: "5월", revenue: 200 },
        { month: "6월", revenue: 140 },
        { month: "7월", revenue: 220 },
        { month: "8월", revenue: 190 },
        { month: "9월", revenue: 170 },
        { month: "10월", revenue: 210 },
        { month: "11월", revenue: 230 },
        { month: "12월", revenue: 250 },
    ];

    // API 호출 함수들 (현재는 주석처리)
    const fetchKitchens = async () => {
        try {
            // const response = await axios.get('/api/host/sales');
            // setKitchens(response.data.kitchen);
            // if (response.data.kitchen.length > 0) {
            //     setSelectedKitchens([response.data.kitchen[0].kitchenId]);
            // }
            
            // 임시 데이터 사용
            setKitchens(tempKitchens);
            setSelectedKitchens([tempKitchens[0].kitchenId]);
        } catch (error) {
            console.error('주방 정보 조회 실패:', error);
        }
    };

    const fetchReservations = async (kitchenId, page) => {
        try {
            // const response = await axios.get(`/api/host/awaiting-payment?kitchenId=${kitchenId}&page=${page}`);
            // setReservations(response.data.reservations);
            // setTotalPages(response.data.totalPages);
            
            // 임시 데이터 사용 - 페이지당 5개씩 표시
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const filteredReservations = tempReservations.slice(startIndex, endIndex);
            setReservations(filteredReservations);
            setTotalPages(Math.ceil(tempReservations.length / itemsPerPage));
        } catch (error) {
            console.error('미정산 내역 조회 실패:', error);
        }
    };

    const fetchMonthlyData = async (kitchenId, year) => {
        try {
            // const response = await axios.get(`/api/host/graph?kitchenId=${kitchenId}&year=${year}`);
            // const formattedData = response.data.monthlyRevenue.map(item => ({
            //     month: item.month.replace('Jan', '1월').replace('Feb', '2월')... // 월 변환
            //     revenue: item.revenue / 10000 // 만원 단위로 변환
            // }));
            // setMonthlyData(formattedData);
            
            // 임시 데이터 사용
            setMonthlyData(tempMonthlyData);
        } catch (error) {
            console.error('매출 그래프 데이터 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchKitchens();
    }, []);

    useEffect(() => {
        if (selectedKitchens.length > 0) {
            // 실제 API에서는 선택된 모든 주방의 데이터를 조합해야 함
            fetchReservations(selectedKitchens[0], currentPage);
            fetchMonthlyData(selectedKitchens[0], selectedYear);
        }
    }, [selectedKitchens, currentPage, selectedYear]);

    const handleKitchenSelect = (kitchenId) => {
        if (kitchenId === 'all') {
            setSelectedKitchens(selectedKitchens.length === kitchens.length ? [] : kitchens.map(k => k.kitchenId));
        } else {
            setSelectedKitchens(prev => 
                prev.includes(kitchenId) 
                    ? prev.filter(id => id !== kitchenId)
                    : [...prev, kitchenId] // 다중 선택 가능하도록 수정
            );
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
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <Container>
            <HostSideBar />
            <ContentWrapper>
                <TopSection>
                    <KitchenSection>
                        <SectionTitle>운영 중인 주방</SectionTitle>
                        <KitchenList>
                            <SelectAllLabel>전체선택</SelectAllLabel>
                            <KitchenHeader selected={selectedKitchens.length === kitchens.length}>
                                <KitchenName>주방명</KitchenName>
                                <CheckIconWrapper>
                                    <CheckIcon 
                                        onClick={() => handleKitchenSelect('all')} 
                                        style={{ cursor: 'pointer' }}
                                    />
                                </CheckIconWrapper>
                            </KitchenHeader>
                            {kitchens.map(kitchen => (
                                <KitchenItem
                                    key={kitchen.kitchenId}
                                    onClick={() => handleKitchenSelect(kitchen.kitchenId)}
                                    selected={selectedKitchens.includes(kitchen.kitchenId)}
                                >
                                    <span className="kitchen-name">{kitchen.kitchenName}</span>
                                    <CheckIconWrapper>
                                        <CheckIcon />
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
                                {reservations.map(item => (
                                    <SalesItem 
                                        key={item.reservationId}
                                        onClick={() => handleSalesItemClick(item.reservationId)}
                                    >
                                        <div>{formatDate(item.date)}</div>
                                        <div>{item.reservationId}</div>
                                        <div>{item.userName}</div>
                                    </SalesItem>
                                ))}
                            </SalesContent>
                            <Pagination>
                                <PageButton
                                    onClick={() => handlePageChange(currentPage - 1)}
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
                                    onClick={() => handlePageChange(currentPage + 1)}
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
                            <YearSelect
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                <option value={2024}>2024년</option>
                                <option value={2023}>2023년</option>
                            </YearSelect>
                        </YearSelectWrapper>
                        <BarChart
                            width={400}
                            height={300}
                            data={monthlyData}
                            margin={{
                                top: 5,
                                right: 20,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={12}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                                cursor={false}
                                content={<CustomTooltip />}
                            />
                            <Bar dataKey="revenue" fill="#FFBC39" />
                        </BarChart>
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
                                        <span>{data.month}</span>
                                        <span>{data.revenue.toLocaleString()}만원</span>
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
                                        <span>{data.month}</span>
                                        <span>{data.revenue.toLocaleString()}만원</span>
                                    </TableRow>
                                ))}
                            </div>
                        </SalesTable>
                    </TableSection>
                </BottomSection>
            </ContentWrapper>
        </Container>
    );
};

export default HostSales; 