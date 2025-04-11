import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  margin: 100px auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight:bold;
  margin-bottom: 60px;
`;

const OptionBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  padding: 30px 40px;
  margin-bottom: 50px;
  cursor: pointer;
  align-items: center;
  background-color: ${(props) => (props.active ? '#ffbc39' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#ffbc39')};
  font-weight: bold;
  font-size: 18px;

  &:hover {
    background-color: #ffe08c;
  }

  span {
    font-size: 30px;
    flex: 1;
  }

  .divider {
    width: 1.5px;
    height: 120px;
    background-color: ${(props) => (props.active ? 'white' : '#ffbc39')};
    margin: 0 24px;
  }

  .description {
    flex: 2;
    font-weight: normal;
    font-size: 18px;
    color: ${(props) => (props.active ? 'white' : '#ffbc39')};
  }
`;

const SignupChoicePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>회원가입</Title>
      <OptionBox active onClick={() => navigate('/signup/user')}>
        <span>USER</span>
        <div className="divider" />
        <div className="description">공유주방 예약을 원하시는 사용자</div>
        <span>➔</span>
      </OptionBox>

      <OptionBox onClick={() => navigate('/signup/host')}>
        <span>HOST</span>
        <div className="divider" />
        <div className="description">본인 소유의 공유주방 등록을 원하시는 사용자</div>
        <span>➔</span>
      </OptionBox>
    </Container>
  );
};

export default SignupChoicePage;
