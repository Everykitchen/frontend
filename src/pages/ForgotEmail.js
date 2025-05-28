import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
    max-width: 500px;
    margin: 80px auto;
`;
const Title = styled.h1`
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
    font-weight: bold;
`;
const FormContainer = styled.div`
    border: 1px solid #ddd;
    border-radius: 15px;
    padding: 30px;
    background-color: #fff;
`;
const FieldGroup = styled.div`
    margin-bottom: 20px;
`;
const Label = styled.label`
    font-weight: 600;
    margin-bottom: 10px;
`;
const ErrorText = styled.span`
    color: red;
    font-size: 13px;
`;
const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: ${(props) => (props.invalid ? "1px solid red" : "1px solid #ccc")};
    border-radius: 5px;
    &:focus {
        outline: none;
        background-color: #F0FDFF;
    }
`;
const SubmitButton = styled.button`
    width: 100%;
    background-color: #ffbc39;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    margin-top: 20px;
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;
const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;
const ModalBox = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 32px 24px 24px 24px;
    min-width: 320px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
`;
const ModalTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
`;
const ModalEmail = styled.div`
    font-size: 18px;
    color: #ffbc39;
    font-weight: 600;
    margin-bottom: 24px;
`;
const ModalButton = styled.button`
    background-color: #ffbc39;
    color: white;
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
`;
const Row = styled.div`
    display: flex;
    gap: 8px;
`;
const Flex = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const ForgotEmail = () => {
    const [name, setName] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [phone3, setPhone3] = useState("");
    const [error, setError] = useState("");
    const [foundEmail, setFoundEmail] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const birthday = birthYear && birthMonth && birthDay ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}` : "";
    const phoneNumber = phone1 && phone2 && phone3 ? `${phone1}-${phone2}-${phone3}` : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFoundEmail("");
        if (!name || !birthYear || !birthMonth || !birthDay || !phone1 || !phone2 || !phone3) {
            setError("모든 정보를 입력해주세요.");
            return;
        }
        try {
            const res = await axios.post("/api/auth/find-email", {
                name,
                birthday,
                phoneNumber
            });
            setFoundEmail(res.data.email);
            setModalOpen(true);
        } catch (err) {
            setError("입력하신 정보로 가입된 이메일을 찾을 수 없습니다.");
        }
    };

    return (
        <Container>
            <Title>이메일 찾기</Title>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Label htmlFor="name">이름</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="이름 입력"
                            invalid={!!error && !name}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <Label>생년월일</Label>
                        <Flex>
                            <Input
                                type="text"
                                maxLength={4}
                                value={birthYear}
                                onChange={e => setBirthYear(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="년도"
                                invalid={!!error && !birthYear}
                            />
                            <Input
                                type="text"
                                maxLength={2}
                                value={birthMonth}
                                onBlur={e => setBirthMonth(e.target.value.padStart(2, '0'))}
                                onChange={e => setBirthMonth(e.target.value.replace(/[^0-9]/g, '').slice(0,2))}
                                placeholder="월"
                                invalid={!!error && !birthMonth}
                            />
                            <Input
                                type="text"
                                maxLength={2}
                                value={birthDay}
                                onBlur={e => setBirthDay(e.target.value.padStart(2, '0'))}
                                onChange={e => setBirthDay(e.target.value.replace(/[^0-9]/g, '').slice(0,2))}
                                placeholder="일"
                                invalid={!!error && !birthDay}
                            />
                        </Flex>
                    </FieldGroup>
                    <FieldGroup>
                        <Label>휴대폰 번호</Label>
                        <Flex>
                            <Input
                                type="text"
                                maxLength={3}
                                value={phone1}
                                onChange={e => setPhone1(e.target.value.replace(/[^0-9]/g, '').slice(0,3))}
                                placeholder="010"
                                invalid={!!error && !phone1}
                            />
                            <Input
                                type="text"
                                maxLength={4}
                                value={phone2}
                                onChange={e => setPhone2(e.target.value.replace(/[^0-9]/g, '').slice(0,4))}
                                placeholder="1234"
                                invalid={!!error && !phone2}
                            />
                            <Input
                                type="text"
                                maxLength={4}
                                value={phone3}
                                onChange={e => setPhone3(e.target.value.replace(/[^0-9]/g, '').slice(0,4))}
                                placeholder="5678"
                                invalid={!!error && !phone3}
                            />
                        </Flex>
                    </FieldGroup>
                    {error && <ErrorText>{error}</ErrorText>}
                    <SubmitButton type="submit">이메일 찾기</SubmitButton>
                </form>
            </FormContainer>
            {modalOpen && (
                <ModalOverlay>
                    <ModalBox>
                        <ModalTitle>이메일 찾기 결과</ModalTitle>
                        <ModalEmail>{foundEmail}</ModalEmail>
                        <ModalButton onClick={() => navigate('/login')}>로그인하기</ModalButton>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default ForgotEmail; 