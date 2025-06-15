import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../api/axiosInstance";

// 스타일 컴포넌트
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

const Button = styled.button`
    background-color: #ffbc39;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    white-space: nowrap;
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

// 로딩 오버레이
const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

// 로딩 스피너 컨테이너
const SpinnerContainer = styled.div`
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;

// 로딩 스피너
const Spinner = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 188, 57, 0.3);
    border-radius: 50%;
    border-top-color: #ffbc39;
    animation: spin 1s ease-in-out infinite;
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.p`
    margin: 0;
    font-weight: bold;
    color: #333;
`;

/**
 * 이메일 인증 컴포넌트
 * @param {Function} onVerified - 이메일 인증 성공 시 호출될 콜백 함수, 이메일 값을 인자로 전달
 * @param {String} emailLabel - 이메일 필드의 레이블
 * @param {String} codeLabel - 인증번호 필드의 레이블
 * @param {Boolean} initialDisabled - 초기 비활성화 여부
 * @param {String} initialEmail - 초기 이메일 값 (선택 사항)
 */
const EmailVerification = ({ 
    onVerified, 
    emailLabel = "이메일", 
    codeLabel = "인증번호",
    initialDisabled = false,
    initialEmail = ""
}) => {
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({});
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [disabled, setDisabled] = useState(initialDisabled);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // 인증번호 타이머 관리
    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else {
            setIsSendingCode(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

    // 초기 이메일 값이 변경될 경우 상태 업데이트
    useEffect(() => {
        if (initialEmail !== email) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    // 이메일 형식 검증
    const isValidEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    // 이메일 인증번호 전송 요청
    const handleSendCode = async () => {
        if (!isValidEmail(email)) {
            setErrors((prev) => ({
                ...prev,
                email: "올바른 형식이 아닙니다.",
            }));
            return;
        }
        
        setLoading(true);
        setLoadingMessage("인증번호 전송 중...");
        try {
            // 이메일 인증번호 전송 API 호출
            await axios.post("/api/auth/register/send-email-code", {
                email: email,
            });
            setIsSendingCode(true);
            setTimeLeft(60);
            alert("인증번호가 이메일로 전송되었습니다.");
        } catch (error) {
            // 서버에서 내려주는 에러 메시지 처리
            const msg = error?.response?.data?.result?.resultMessage;
            if (msg) {
                setErrors((prev) => ({ ...prev, email: msg }));
            } else {
                alert("인증번호 전송 실패");
            }
        } finally {
            setLoading(false);
        }
    };

    // 이메일 인증번호 확인 요청
    const handleVerifyCode = async () => {
        if (!code) {
            setErrors((prev) => ({
                ...prev,
                code: "인증번호를 입력해주세요.",
            }));
            return;
        }
        
        setLoading(true);
        setLoadingMessage("인증번호 확인 중...");
        try {
            // 인증번호 확인 API 호출
            await axios.post("/api/auth/register/verify-email-code", {
                email: email,
                verificationCode: code,
            });
            setIsEmailVerified(true);
            setIsSendingCode(false);
            setTimeLeft(0);
            alert("이메일 인증 성공");
            
            // 인증 성공 시 콜백 함수 호출
            if (onVerified) {
                onVerified(email);
            }
        } catch (error) {
            // 서버에서 내려주는 에러 메시지 처리
            const msg = error?.response?.data?.result?.resultMessage;
            if (msg) {
                setErrors((prev) => ({ ...prev, code: msg }));
            } else {
                setErrors((prev) => ({ ...prev, code: "인증 실패" }));
            }
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 타이머 포맷 (mm:ss)
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // 이메일 입력 핸들러
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prev) => {
                const { email, ...rest } = prev;
                return rest;
            });
        }
    };

    // 인증번호 입력 핸들러
    const handleCodeChange = (e) => {
        setCode(e.target.value);
        if (errors.code) {
            setErrors((prev) => {
                const { code, ...rest } = prev;
                return rest;
            });
        }
    };

    return (
        <>
            {loading && (
                <LoadingOverlay>
                    <SpinnerContainer>
                        <Spinner />
                        <LoadingText>{loadingMessage}</LoadingText>
                    </SpinnerContainer>
                </LoadingOverlay>
            )}
            
            {/* 이메일 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="email">{emailLabel}</Label>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="example@example.com"
                        invalid={errors.email}
                        disabled={
                            disabled || isEmailVerified || isSendingCode || timeLeft > 0
                        }
                        autoComplete="off"
                    />
                    <Button
                        type="button"
                        onClick={handleSendCode}
                        disabled={
                            disabled || loading || timeLeft > 0 || isEmailVerified || isSendingCode
                        }
                    >
                        {timeLeft > 0 ? `재전송 ${formatTime(timeLeft)}` : "인증번호 전송"}
                    </Button>
                </InlineFlex>
            </FieldGroup>

            {/* 인증번호 */}
            <FieldGroup>
                <LabelRow>
                    <Label htmlFor="code">{codeLabel}</Label>
                    {errors.code && <ErrorText>{errors.code}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
                        id="code"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="인증번호 입력"
                        disabled={disabled || isEmailVerified}
                        autoComplete="off"
                    />
                    <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={disabled || loading || isEmailVerified}
                    >
                        인증번호 확인
                    </Button>
                </InlineFlex>
            </FieldGroup>
        </>
    );
};

export default EmailVerification; 