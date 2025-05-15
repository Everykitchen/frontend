import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmailVerification from "../components/EmailVerification";

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

const SuccessMessage = styled.div`
    color: #28a745;
    background-color: #e8f5e9;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
    text-align: center;
    font-weight: bold;
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // 이메일 인증 완료 콜백
    const handleEmailVerified = (verifiedEmail) => {
        setEmail(verifiedEmail);
        setIsEmailVerified(true);
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // 에러 메시지 제거
        if (errors.password) {
            setErrors((prev) => {
                const { password, ...rest } = prev;
                return rest;
            });
        }
    };

    // 비밀번호 확인 입력 핸들러
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        // 에러 메시지 제거
        if (errors.confirmPassword) {
            setErrors((prev) => {
                const { confirmPassword, ...rest } = prev;
                return rest;
            });
        }
    };

    // 비밀번호 강도 검증
    const isStrongPassword = (password) => {
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`|\\-]).{8,20}$/;
        return passwordRegex.test(password);
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const newErrors = {};
        
        if (!isEmailVerified) {
            newErrors.email = "이메일 인증이 필요합니다.";
        }
        
        if (!password) {
            newErrors.password = "비밀번호를 입력해주세요.";
        } else if (!isStrongPassword(password)) {
            newErrors.password = "영문, 숫자, 특수문자 포함 8~20자";
        }
        
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 비밀번호 재설정 요청
    const handleResetPassword = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            await axios.put("/api/auth/reset-password", {
                email: email,
                newPassword: password
            });
            
            setSuccess(true);
            
            // 3초 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            const msg = error?.response?.data?.result?.resultMessage;
            if (msg) {
                if (msg.includes("비밀번호")) {
                    setErrors((prev) => ({ ...prev, password: msg }));
                } else if (msg.includes("이메일")) {
                    setErrors((prev) => ({ ...prev, email: msg }));
                } else {
                    alert(msg);
                }
            } else {
                alert("비밀번호 재설정 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <Container>
            <Title>비밀번호 찾기</Title>
            <FormContainer>
                {/* 이메일 인증 컴포넌트 */}
                <EmailVerification
                    onVerified={handleEmailVerified}
                    emailLabel="이메일"
                    codeLabel="인증번호"
                />
                
                {/* 새로운 비밀번호 입력 */}
                <FieldGroup>
                    <LabelRow>
                        <Label htmlFor="password">새 비밀번호</Label>
                        {errors.password && <ErrorText>{errors.password}</ErrorText>}
                    </LabelRow>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="영문, 숫자, 특수문자 포함 8~20자"
                        disabled={!isEmailVerified}
                        invalid={errors.password}
                    />
                </FieldGroup>
                
                {/* 새로운 비밀번호 확인 */}
                <FieldGroup>
                    <LabelRow>
                        <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                        {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                    </LabelRow>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="비밀번호 재입력"
                        disabled={!isEmailVerified}
                        invalid={errors.confirmPassword}
                    />
                </FieldGroup>
                
                {/* 비밀번호 재설정 버튼 */}
                <SubmitButton 
                    onClick={handleResetPassword}
                    disabled={!isEmailVerified || !password || !confirmPassword}
                >
                    비밀번호 재설정
                </SubmitButton>
                
                {/* 성공 메시지 */}
                {success && (
                    <SuccessMessage>
                        비밀번호가 성공적으로 재설정되었습니다.<br />
                        잠시 후 로그인 페이지로 이동합니다.
                    </SuccessMessage>
                )}
            </FormContainer>
        </Container>
    );
};

export default ForgotPassword; 