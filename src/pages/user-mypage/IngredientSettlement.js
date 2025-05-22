import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import UserSideBar from "../../components/UserSideBar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fff;
`;
const MainContent = styled.div`
  flex: 1;
  padding: 80px 120px 80px 150px;
  max-width: 1100px;
`;
const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
`;
const GuideText = styled.div`
  font-size: 17px;
  color: #222;
  white-space: nowrap;
  font-weight: 500;
  margin-right: 10px;
`;
const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const TableBox = styled.div`
  background: #fcfcfc;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 32px 32px 32px 40px;
  margin-bottom: 32px;
  max-width: 900px;
  width: 100%;
`;
const TableTitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
`;
const TableTitle = styled.div`
  flex: 1.2;
  font-size: 18px;
  font-weight: 700;
  color: #FFBC39;
  margin-bottom: 0;
`;
const TableHeader = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #222;
  text-align: center;
`;
const TableHeader2 = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #222;
  text-align: right;
`;
const ShortDivider = styled.div`
  height: 1.5px;
  background: #eee;
  border-radius: 1px;
  margin: 0 0 18px 0;
  width: 100%;
`;
const TableRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const NameCell = styled.div`
  flex: 1.2;
  font-size: 17px;
  color: ${({ active }) => (active ? '#222' : '#999')};
  font-weight: ${({ active }) => (active ? 700 : 500)};
  transition: color 0.2s;
  text-align: left;
`;
const InputCell = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: #bbb;
`;
const UsedPriceCell = styled.div`
  flex: 1;
  font-size: 17px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#222' : '#bbb')};
  text-align: right;
  transition: color 0.2s;
`;
const StyledInput = styled.input`
  width: 120px;
  padding: 8px 10px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 17px;
  text-align: center;
  color: ${({ active }) => (active ? '#000' : '#bbb')};
  font-weight: ${({ active }) => (active ? 700 : 500)};
  background: #fff;
  outline: none;
  transition: border 0.1s, color 0.1s;
  ${({ active }) =>
    active &&
    css`
      border: 1.5px solid #FFBC39;
      color: #FFBC39;
    `}
  &:focus {
    border: 1.5px solid #FFBC39;
    color: #222;
  }
`;
const TotalBoxRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
  width: 100%;
`;
const TotalBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #222;
`;
const SubmitButton = styled.button`
  background: #FFBC39;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 12px 36px;
  margin-left: 24px;
  cursor: pointer;
`;

function parseUnit(unit) {
  // Extract number and unit (e.g., '1kg', '100g')
  const match = unit.match(/(\d+)(kg|g)/i);
  if (!match) return { base: 1, type: 'g' };
  let base = parseInt(match[1], 10);
  let type = match[2].toLowerCase();
  return { base, type };
}

function toGram(amount, defaultUnit) {
  // amount: 사용자 입력값, 예: "100", "100g", "0.5kg"
  // defaultUnit: 기본 단위, 예: "1kg", "100g"
  if (!amount) return 0;

  // 입력값에서 숫자 부분과 단위 부분 분리
  const match = amount.match(/^([\d.]+)([a-zA-Z]*)$/);
  if (!match) return 0;

  const numValue = parseFloat(match[1]);
  if (isNaN(numValue)) return 0;

  const unit = match[2].toLowerCase();

  // 단위에 따라 그램으로 변환
  if (unit === 'kg') {
    return numValue * 1000; // kg -> g
  } else if (unit === 'g' || unit === '') {
    return numValue; // 이미 g 단위이거나 단위가 없는 경우
  }

  return numValue; // 기본값 - 단위가 없거나 인식할 수 없는 단위는 그냥 숫자 그대로 사용
}

function getUnitGram(unit) {
  // e.g., '1kg' => 1000, '100g' => 100, '10g' => 10
  const { base, type } = parseUnit(unit);
  if (type === 'kg') return base * 1000;
  if (type === 'g') return base;
  return 1;
}

const IngredientSettlement = () => {
  const { id: reservationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const kitchenId = location.state?.kitchenId;

  const [basic, setBasic] = useState([]);
  const [additional, setAdditional] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!kitchenId || !reservationId) return;
    setLoading(true);
    api.get(`/user/kitchen/${kitchenId}/reservation/${reservationId}/settlement-list`)
      .then(res => {
        setBasic((res.data.ingredients || []).map(i => ({ ...i, amount: "" })));
        setAdditional((res.data.extraIngredients || []).map(i => ({ ...i, amount: "" })));
        setError(null);
      })
      .catch(err => {
        setError("정산 재료 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [kitchenId, reservationId]);

  // 사용금액 계산
  const getUsedPrice = (item) => {
    const usedGram = toGram(item.amount, item.unit); // always in grams
    const unitGram = getUnitGram(item.unit);
    if (unitGram === 0) return 0;
    return Math.round((usedGram / unitGram) * item.unitPrice);
  };

  const total =
    basic.reduce((sum, i) => sum + getUsedPrice(i), 0) +
    additional.reduce((sum, i) => sum + getUsedPrice(i), 0);

  const handleAmountChange = (type, idx, value) => {
    const limitedValue = value.slice(0, 10);
    if (type === "basic") {
      setBasic(basic.map((item, i) => (i === idx ? { ...item, amount: limitedValue } : item)));
    } else {
      setAdditional(additional.map((item, i) => (i === idx ? { ...item, amount: limitedValue } : item)));
    }
  };

  const handleBlur = (type, idx, value) => {
    if (!value) return;
    const hasUnit = /[a-zA-Z]$/i.test(value);
    let finalValue = value;
    if (!hasUnit && !isNaN(parseFloat(value))) {
      finalValue = value + "g";
    }
    if (type === "basic") {
      setBasic(basic.map((item, i) => (i === idx ? { ...item, amount: finalValue } : item)));
    } else {
      setAdditional(additional.map((item, i) => (i === idx ? { ...item, amount: finalValue } : item)));
    }
  };

  const handleSubmit = async () => {
    if (!kitchenId || !reservationId) return;
    const usedIngredients = [
      ...basic,
      ...additional
    ].filter(i => i.amount && toGram(i.amount, i.unit) > 0)
      .map(i => ({
        name: i.name,
        quantityUsed: i.amount,
        price: getUsedPrice(i)
      }));
    try {
      await api.post(`/user/kitchen/${kitchenId}/reservation/${reservationId}/settlement`, {
        usedIngredients,
        totalUsedPrice: total
      });
      alert("정산이 완료되었습니다.");
      navigate(`/mypage/reservations/${reservationId}`);
    } catch (err) {
      alert("정산 요청에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Container>
      <UserSideBar activeMenu="예약 내역" />
      <MainContent>
        <TopRow>
          <Title>재료 사용 내역</Title>
          <GuideText>사용량의 <span style={{ color: '#ff6f1f', fontWeight: 700 }}>단위</span>까지 입력해주세요</GuideText>
        </TopRow>
        <TableSection>
          <TableBox>
            <TableTitleRow>
              <TableTitle>기본 재료</TableTitle>
              <TableHeader>사용량</TableHeader>
              <TableHeader2>사용금액</TableHeader2>
            </TableTitleRow>
            <TableRow>
              <div style={{ flex: 1.2 }}><ShortDivider /></div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><ShortDivider /></div>
              <div style={{ flex: 1 }}><ShortDivider /></div>
            </TableRow>
            {basic.map((item, idx) => {
              const isActive = !!item.amount && toGram(item.amount, item.unit) > 0;
              return (
                <TableRow key={item.name}>
                  <NameCell active={isActive}>{item.name}</NameCell>
                  <InputCell>
                    <StyledInput
                      type="text"
                      value={item.amount}
                      placeholder={item.unit}
                      active={isActive}
                      onChange={e => handleAmountChange("basic", idx, e.target.value)}
                      onBlur={e => handleBlur("basic", idx, e.target.value)}
                    />
                  </InputCell>
                  <UsedPriceCell active={isActive}>
                    {getUsedPrice(item) > 0 ? `${getUsedPrice(item).toLocaleString()}원` : "0원"}
                  </UsedPriceCell>
                </TableRow>
              );
            })}
          </TableBox>
          <TableBox>
            <TableTitleRow>
              <TableTitle>추가 재료</TableTitle>
              <TableHeader>사용량</TableHeader>
              <TableHeader2>사용금액</TableHeader2>
            </TableTitleRow>
            <TableRow>
              <div style={{ flex: 1.2 }}><ShortDivider /></div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><ShortDivider /></div>
              <div style={{ flex: 1 }}><ShortDivider /></div>
            </TableRow>
            {additional.map((item, idx) => {
              const isActive = !!item.amount && toGram(item.amount, item.unit) > 0;
              return (
                <TableRow key={item.name}>
                  <NameCell active={isActive}>{item.name}</NameCell>
                  <InputCell>
                    <StyledInput
                      type="text"
                      value={item.amount}
                      placeholder={item.unit}
                      active={isActive}
                      onChange={e => handleAmountChange("additional", idx, e.target.value)}
                      onBlur={e => handleBlur("additional", idx, e.target.value)}
                    />
                  </InputCell>
                  <UsedPriceCell active={isActive}>
                    {getUsedPrice(item) > 0 ? `${getUsedPrice(item).toLocaleString()}원` : "0원"}
                  </UsedPriceCell>
                </TableRow>
              );
            })}
          </TableBox>
          <TotalBoxRow>
            <TotalBox>
              총 사용 금액: &nbsp; <span style={{ fontWeight: 700, color: '#FFBC39', fontSize: '24px' }}>{total.toLocaleString()}원</span>
              <SubmitButton onClick={handleSubmit}>송금하기</SubmitButton>
            </TotalBox>
          </TotalBoxRow>
        </TableSection>
      </MainContent>
    </Container>
  );
};

export default IngredientSettlement;
