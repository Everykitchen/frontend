import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepPrice from "./StepPrice";
import StepFacility from "./StepFacility";
import StepTool from "./StepTool";
import StepSupply from "./StepSupply";
import StepIngredient from "./StepIngredient";
import HostSideBar from "../../../components/HostSideBar";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px 80px;
`;

const Title = styled.h2`
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 6px;
    background-color: #f3e9db;
    border-radius: 4px;
    margin-bottom: 40px;
    overflow: hidden;
`;

const Progress = styled.div`
    height: 100%;
    background-color: #ffbc39;
    transition: width 0.3s ease-in-out;
    width: ${(props) => `${props.percent}%`};
`;

const KitchenForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isEdit = location.state?.isEdit || false;
    const editData = location.state?.editData || {};

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        prices: {},
        accountNumber: "",
        bank: "",
        facilities: [],
        tools: [],
        supplies: [],
        ingredients: [],
    });

    useEffect(() => {
        if (isEdit && editData) {
            setFormData({ ...editData });
        }
    }, [isEdit, editData]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = () => {
        navigate("/host-mypage/kitchen-management");
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <StepPrice
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <StepFacility
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <StepTool
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 4:
                return (
                    <StepSupply
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 5:
                return (
                    <StepIngredient
                        formData={formData}
                        setFormData={setFormData}
                        prevStep={prevStep}
                        handleSubmit={handleSubmit}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Wrapper>
            <HostSideBar />
            <Content>
                <Title>{isEdit ? "주방 수정" : "주방 등록"}</Title>
                <ProgressBar>
                    <Progress percent={(step / 5) * 100} />
                </ProgressBar>
                {renderStep()}
            </Content>
        </Wrapper>
    );
};

export default KitchenForm;
