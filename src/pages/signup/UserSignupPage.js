import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CommonButton from "../../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmailVerification from "../../components/EmailVerification";

// ------------- styled components -------------
const FormContainer = styled.div`
    max-width: 500px;
    margin: 80px auto;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
    font-weight: bold;
`;

const FieldGroup = styled.div`
    margin-bottom: 20px;
`;

const LabelRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
`;

const Label = styled.label`
    font-weight: bold;
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
    background-color: ${(props) => (props.disabled ? "#f0f0f0" : "white")};

    &:focus {
        outline: none;
        background-color: ${(props) =>
            props.disabled ? "#f0f0f0" : "#F0FDFF"};
    }
`;

const InlineFlex = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;

    & > input {
        flex: 1;
    }
`;

const Flex = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const BottomButtonWrapper = styled.div`
    margin-top: 30px;
`;

// ------------- component -------------
const UserSignupPage = () => {
    // 회원가입 폼 state
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
    });

    // 에러 메시지 state
    const [errors, setErrors] = useState({});
    // 이메일 인증 여부
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    
    // 페이지 이동을 위한 navigate 함수
    const navigate = useNavigate();

    // input 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // 해당 필드의 에러 메시지 제거
        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    // 이메일 검증 완료 핸들러
    const handleEmailVerified = (verifiedEmail) => {
        setForm(prev => ({ ...prev, email: verifiedEmail }));
        setIsEmailVerified(true);
    };

    // 비밀번호 강도 검증
    const isStrongPassword = (password) => {
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`|\\-]).{8,20}$/;
        return passwordRegex.test(password);
    };

    // 회원가입 유효성 검사
    const validate = () => {
        const newErrors = {};
        if (!isEmailVerified) newErrors.email = "이메일 인증이 필요합니다.";
        if (!isStrongPassword(form.password))
            newErrors.password = "영문, 숫자, 특수문자 포함 8~20자";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        setErrors(newErrors);
        // 에러가 없으면 회원가입 요청
        if (Object.keys(newErrors).length === 0) {
            submitForm();
        }
    };

    // 회원가입 요청
    const submitForm = async () => {
        try {
            // 생년월일을 YYYY-MM-DD 형식으로 만듦
            const birthMonth = form.birthMonth.toString().padStart(2, '0');
            const birthDay = form.birthDay.toString().padStart(2, '0');
            const requestBody = {
                email: form.email,
                password: form.password,
                name: form.name,
                birthday: `${form.birthYear}-${birthMonth}-${birthDay}`,
                phoneNumber: form.phone,
            };
            await axios.post(
                "/api/auth/user-signup",
                JSON.stringify(requestBody),
                { headers: { "Content-Type": "application/json" } }
            );
            // 회원가입 성공 시 /signup/user/success로 이동
            navigate('/signup/user/success');
        } catch (error) {
            // 서버에서 내려주는 에러 메시지 처리
            const msg = error?.response?.data?.result?.resultMessage;
            if (msg) {
                // 비밀번호, 이메일 중복, 인증 필요, 인증 시간 초과 등
                if (msg.includes("비밀번호")) {
                    setErrors((prev) => ({ ...prev, password: msg }));
                } else if (msg.includes("이미 등록된")) {
                    setErrors((prev) => ({ ...prev, email: msg }));
                } else if (msg.includes("이메일 인증")) {
                    setErrors((prev) => ({ ...prev, email: msg }));
                } else if (msg.includes("시간 초과")) {
                    setErrors((prev) => ({ ...prev, email: msg }));
                } else {
                    alert(msg);
                }
            } else {
                alert("회원가입 중 오류 발생");
            }
        }
    };

    return (
        <FormContainer>
            <Title>회원가입</Title>

            {/* 이메일 인증 컴포넌트 */}
            <EmailVerification onVerified={handleEmailVerified} />

            {/* 비밀번호 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="password">비밀번호</Label>
                    {errors.password && (
                        <ErrorText>{errors.password}</ErrorText>
                    )}
                </LabelRow>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="문자, 숫자, 특수문자 포함 8~20자"
                    invalid={errors.password}
                    autoComplete="off"
                />
            </FieldGroup>

            {/* 비밀번호 확인 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    {errors.confirmPassword && (
                        <ErrorText>{errors.confirmPassword}</ErrorText>
                    )}
                </LabelRow>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호 재입력"
                    invalid={errors.confirmPassword}
                    autoComplete="off"
                />
            </FieldGroup>

            {/* 이름 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="name">이름</Label>
                </LabelRow>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해주세요"
                    autoComplete="off"
                />
            </FieldGroup>

            {/* 전화번호 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="phone">전화번호</Label>
                </LabelRow>
                <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="휴대폰 번호 입력"
                    autoComplete="off"
                />
            </FieldGroup>

            {/* 생년월일 */}
            <FieldGroup>
                <LabelRow>
                    <Label>생년월일</Label>
                </LabelRow>
                <Flex>
                    <Input
                        name="birthYear"
                        placeholder="년도"
                        value={form.birthYear}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <Input
                        name="birthMonth"
                        placeholder="월"
                        value={form.birthMonth}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <Input
                        name="birthDay"
                        placeholder="일"
                        value={form.birthDay}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </Flex>
            </FieldGroup>

            <BottomButtonWrapper>
                <CommonButton onClick={validate} fullwidth="true">
                    회원가입
                </CommonButton>
            </BottomButtonWrapper>
        </FormContainer>
    );
};

export default UserSignupPage;
