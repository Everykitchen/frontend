import React from "react";
import styled from "styled-components";
import CommonButton from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const Title = styled.div`
  font-size: 34px;
  font-weight: 900;
  margin-bottom: 32px;
  text-align: center;
  font-style: italic;
`;

const AnyoneCan = styled.span`
  color: #ffbc39;
  font-style: italic;
  font-weight: 900;
`;

const Cook = styled.span`
  color: #ff7926;
  font-style: italic;
  font-weight: 900;
`;

const Message = styled.div`
  font-size: 28px;
  color: #222;
  text-align: center;
  margin-top: 14px;
  margin-bottom: 30px;
  font-weight: 700;
`;

const SubMessage = styled.div`
  font-size: 26px;
  color: #222;
  text-align: center;
  margin-bottom: 48px;
  font-weight: 700;
`;

const UserSignupSuccess = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>
        <AnyoneCan>Anyone can </AnyoneCan>
        <Cook>cook!</Cook>
      </Title>
      <Message>회원가입이 완료되었습니다.</Message>
      <SubMessage>에브리키친에서 다양한 주방을 활용하여 요리해보세요!</SubMessage>
      <CommonButton onClick={() => navigate("/")} fullwidth={false}>
        홈으로
      </CommonButton>
    </Container>
  );
};

export default UserSignupSuccess; 