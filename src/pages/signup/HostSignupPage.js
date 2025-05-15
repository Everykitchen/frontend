import React, { useState } from "react";
import styled from "styled-components";
import CommonButton from "../../components/Button";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import EmailVerification from "../../components/EmailVerification";

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
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const navigate = useNavigate();

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

    const handleEmailVerified = (verifiedEmail) => {
        setForm(prev => ({ ...prev, email: verifiedEmail }));
        setIsEmailVerified(true);
    };

    const isStrongPassword = (pw) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`|\\-]).{8,20}$/.test(pw);

    const validate = () => {
        const newErrors = {};
        if (!isEmailVerified) 
            newErrors.email = "이메일 인증이 필요합니다.";
        if (!isStrongPassword(form.password))
            newErrors.password = "영문, 숫자, 특수문자 포함 8~20자";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
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
            requestBody.append("name", form.name);
            requestBody.append(
                "birthday",
                `${form.birthYear}-${form.birthMonth.padStart(2, '0')}-${form.birthDay.padStart(2, '0')}`
            );
            requestBody.append("phoneNumber", form.phone);
            requestBody.append("businessRegistrationNumber", form.businessNumber);
            if (form.businessFile) {
                requestBody.append("businessFile", form.businessFile);
            }
            const response = await axios.post('/api/auth/host-signup', requestBody, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate("/signup/host/success");
            }
        } catch (error) {
            const msg = error?.response?.data?.result?.resultMessage;
            if (msg) {
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
            console.error(error);
        }
    };

    return (
        <FormContainer>
            <Title>회원가입</Title>

            {/* 이메일 인증 컴포넌트 */}
            <EmailVerification onVerified={handleEmailVerified} />

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
