import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CommonButton from "../../components/Button";
// import axios from "axios"; // 실제 사용 시 주석 해제

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
    const [form, setForm] = useState({
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
    });

    const [errors, setErrors] = useState({});
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else {
            setIsSendingCode(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const isStrongPassword = (password) => {
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`|\\-]).{8,20}$/;
        return passwordRegex.test(password);
    };

    // 이메일 인증번호 전송
    const handleSendCode = async () => {
        if (!isValidEmail(form.email)) {
            setErrors((prev) => ({
                ...prev,
                email: "올바른 형식이 아닙니다.",
            }));
            return;
        }

        try {
            // 실제 요청
            // await axios.post("/api/auth/send-verification-code", {
            //     email: form.email,
            // });

            setIsSendingCode(true);
            setTimeLeft(60);
            alert("인증번호가 이메일로 전송되었습니다.");
        } catch (error) {
            alert("인증번호 전송 실패");
        }
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        if (!form.code) {
            setErrors((prev) => ({
                ...prev,
                code: "인증번호를 입력해주세요.",
            }));
            return;
        }

        try {
            // 실제 요청
            // await axios.post("/api/auth/verify-code", {
            //     email: form.email,
            //     code: form.code,
            // });

            setIsEmailVerified(true);
            setIsSendingCode(false);
            setTimeLeft(0);
            alert("이메일 인증 성공");
        } catch (error) {
            // 인증 실패 시
            setErrors((prev) => ({
                ...prev,
                code: "인증번호가 일치하지 않습니다.",
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!isValidEmail(form.email))
            newErrors.email = "올바른 형식이 아닙니다.";

        if (!isStrongPassword(form.password))
            newErrors.password = "영문, 숫자, 특수문자 포함 8~20자";

        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

        if (!isEmailVerified) newErrors.code = "이메일 인증이 필요합니다.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            submitForm();
        }
    };

    const submitForm = async () => {
        try {
            const requestBody = {
                email: form.email,
                password: form.password,
                name: form.name,
                phoneNumber: form.phone,
                birthday: `${form.birthYear}-${form.birthMonth}-${form.birthDay}`,
                role: "USER",
            };

            // await axios.post("/api/auth/signup", requestBody);
            console.log("회원가입 요청:", requestBody);
            alert("회원가입 요청 완료");
        } catch (error) {
            alert("회원가입 중 오류 발생");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <FormContainer>
            <Title>회원가입</Title>

            {/* 이메일 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="email">이메일</Label>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@example.com"
                        invalid={errors.email}
                        disabled={
                            isEmailVerified || isSendingCode || timeLeft > 0
                        }
                    />
                    <CommonButton
                        type="button"
                        onClick={handleSendCode}
                        disabled={
                            timeLeft > 0 || isEmailVerified || isSendingCode
                        }
                    >
                        {timeLeft > 0
                            ? `재전송 ${formatTime(timeLeft)}`
                            : "인증번호 전송"}
                    </CommonButton>
                </InlineFlex>
            </FieldGroup>

            {/* 인증번호 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="code">인증번호</Label>
                    {errors.code && <ErrorText>{errors.code}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
                        id="code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="인증번호 입력"
                        disabled={isEmailVerified}
                    />
                    <CommonButton
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isEmailVerified}
                    >
                        인증번호 확인
                    </CommonButton>
                </InlineFlex>
            </FieldGroup>

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
                        onChange={handleChange}
                    />
                    <Input
                        name="birthMonth"
                        placeholder="월"
                        onChange={handleChange}
                    />
                    <Input
                        name="birthDay"
                        placeholder="일"
                        onChange={handleChange}
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
