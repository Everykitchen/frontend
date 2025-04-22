import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CommonButton from "../../components/Button";
// import axios from "axios"; // 나중에 연동 시 주석 해제

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

const HostSignupPage = () => {
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
        businessNumber: "",
        businessFile: null,
    });

    const [errors, setErrors] = useState({});
    const [serverCodeSent, setServerCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        let timer;
        if (timer) {
            timer = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [timer]);

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

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, businessFile: e.target.files[0] }));
    };

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isStrongPassword = (pw) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`|\\-]).{8,20}$/.test(pw);

    const handleSendCode = async () => {
        if (!isValidEmail(form.email)) {
            setErrors((prev) => ({ ...prev, email: "올바른 형식이 아닙니다." }));
            return;
        }

        try {
            // const res = await axios.post("/api/auth/register/send-email-code", { email: form.email });
            // 인증 성공 시 backend에서 전송된 인증번호는 res.data.code일 수도 있음
            setServerCodeSent(true);
            setIsEmailVerified(true);
            setTimer(60);
            alert("인증번호가 전송되었습니다.");
        } catch (error) {
            alert("인증번호 전송 실패");
        }
    };

    const handleVerifyCode = async () => {
        if (!serverCodeSent) {
            alert("먼저 인증번호를 요청해주세요.");
            return;
        }

        try {
            // const res = await axios.post("/api/auth/register/verify-email-code", {
            //     email: form.email,
            //     verificationCode: form.code,
            // });

            // if (res.status === 200) {
            setIsEmailVerified(true);
            setTimer(0);
            alert("이메일 인증 성공");
            // }
        } catch (error) {
            alert("인증번호가 일치하지 않습니다.");
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

        if (!isEmailVerified)
            newErrors.code = "이메일 인증이 필요합니다.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            submitForm();
        }
    };

    const submitForm = async () => {
        try {
            const requestBody = new FormData();
            requestBody.append("email", form.email);
            requestBody.append("password", form.password);
            requestBody.append(
                "birthDate",
                `${form.birthYear}-${form.birthMonth}-${form.birthDay}`
            );
            requestBody.append("name", form.name);
            requestBody.append("phoneNumber", form.phone);
            requestBody.append("businessRegistrationNumber", form.businessNumber);
            if (form.businessFile) {
                requestBody.append("businessFile", form.businessFile);
            }

            // const response = await axios.post('/api/auth/host-signup', requestBody);
            // if (response.status === 200) alert("회원가입 완료!");

            console.log("보낼 데이터(FormData):", requestBody);
            alert("회원가입 요청 완료");
        } catch (error) {
            alert("회원가입 중 오류 발생");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <FormContainer>
            <Title>회원가입</Title>

            {/* 이메일 */}
            <FieldGroup>
                <LabelRow>
                    <Label>이메일</Label>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@example.com"
                        disabled={isEmailVerified || timer > 0}
                        invalid={errors.email}
                    />
                    <CommonButton
                        type="button"
                        onClick={handleSendCode}
                        disabled={timer > 0 || isEmailVerified}
                    >
                        {timer > 0
                            ? `재전송 ${formatTime(timer)}`
                            : "인증번호 전송"}
                    </CommonButton>
                </InlineFlex>
            </FieldGroup>

            {/* 인증번호 */}
            <FieldGroup>
                <LabelRow>
                    <Label>인증번호</Label>
                    {errors.code && <ErrorText>{errors.code}</ErrorText>}
                </LabelRow>
                <InlineFlex>
                    <Input
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

            {/* 나머지 입력필드 */}
            {[
                { name: "password", label: "비밀번호", type: "password", placeholder: "문자, 숫자, 특수문자 포함 8~20자", errorKey: "password" },
                { name: "confirmPassword", label: "비밀번호 확인", type: "password", placeholder: "비밀번호 재입력", errorKey: "confirmPassword" },
                { name: "name", label: "이름", placeholder: "이름을 입력해주세요" },
                { name: "phone", label: "전화번호", placeholder: "휴대폰 번호 입력" },
                { name: "businessNumber", label: "사업자등록번호", placeholder: "사업자등록번호를 입력해주세요" },
            ].map(({ name, label, type = "text", placeholder, errorKey }) => (
                <FieldGroup key={name}>
                    <LabelRow>
                        <Label>{label}</Label>
                        {errorKey && errors[errorKey] && <ErrorText>{errors[errorKey]}</ErrorText>}
                    </LabelRow>
                    <Input
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        invalid={errors[errorKey]}
                    />
                </FieldGroup>
            ))}

            {/* 생년월일 */}
            <FieldGroup>
                <LabelRow><Label>생년월일</Label></LabelRow>
                <Flex>
                    <Input name="birthYear" placeholder="년도" onChange={handleChange} />
                    <Input name="birthMonth" placeholder="월" onChange={handleChange} />
                    <Input name="birthDay" placeholder="일" onChange={handleChange} />
                </Flex>
            </FieldGroup>

            {/* 등록증 파일 */}
            <FieldGroup>
                <LabelRow><Label>등록증 첨부</Label></LabelRow>
                <Input type="file" onChange={handleFileChange} />
            </FieldGroup>

            <BottomButtonWrapper>
                <CommonButton onClick={validate} fullwidth="true">
                    회원가입
                </CommonButton>
            </BottomButtonWrapper>
        </FormContainer>
    );
};

export default HostSignupPage;
