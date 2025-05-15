import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepPrice from "./StepPrice";
import StepFacility from "./StepFacility";
import StepTool from "./StepTool";
import StepSupply from "./StepSupply";
import StepIngredient from "./StepIngredient";
import HostSideBar from "../../../components/HostSideBar";
import styled from "styled-components";
import api from "../../../api/axiosInstance";

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
        kitchenName: "",
        description: "",
        phoneNumber: "",
        location: "",
        detailLocation: "",
        latitude: null,
        longitude: null,
        size: "",
        baseClientNumber: "",
        maxClientNumber: "",
        minReservationTime: "",
        openTime: "09:00",
        closeTime: "21:00",
        category: "",
        imageList: [],
        account: {
            accountNumber: "",
            bankName: "",
        },
        ingredients: [],
        extraIngredients: [],
        kitchenFacility: [],
        cookingTool: [],
        providedItem: [],
        prices: {},
    });

    useEffect(() => {
        if (isEdit && editData) {
            setFormData({
                ...editData,
                imageList: editData.images || [],
            });
        }
    }, [isEdit, editData]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const mapFormDataToRequestBody = (data) => ({
        kitchenName: data.kitchenName,
        images: data.imageList,
        description: data.description,
        phoneNumber: data.phoneNumber,
        location: data.location,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        size: parseFloat(data.size),
        baseClientNumber: parseInt(data.baseClientNumber, 10),
        maxClientNumber: parseInt(data.maxClientNumber, 10),
        minReservationTime: parseInt(data.minReservationTime, 10),
        openTime: data.openTime,
        closeTime: data.closeTime,
        category: data.category,
        accountNumber: data.account.accountNumber,
        bankName: data.account.bankName,
        ingredients: data.ingredients,
        extraIngredients: data.extraIngredients,
        kitchenFacility: data.kitchenFacility,
        cookingTool: data.cookingTool,
        providedItem: data.providedItem,
        defaultPrice: Object.entries(data.prices || {}).map(([day, price]) => ({
            week: day.toUpperCase(),
            price: Number(price),
        })),
    });

    const handleSubmitKitchen = async () => {
        const form = new FormData();

        const payload = mapFormDataToRequestBody(formData);
        for (const key in payload) {
            if (key === "images") {
                formData.imageList.forEach((file) => {
                    form.append("images", file); // 실제 File 객체여야 함
                });
            } else {
                form.append(key, JSON.stringify(payload[key]));
            }
        }

        try {
            const response = isEdit
                ? await api.put(`/api/host/kitchen/${formData.id}`, form, {
                      headers: { "Content-Type": "multipart/form-data" },
                  })
                : await api.post("/api/host/kitchen", form, {
                      headers: { "Content-Type": "multipart/form-data" },
                  });

            if (response.status === 200 || response.status === 201) {
                alert(
                    `주방이 성공적으로 ${isEdit ? "수정" : "등록"}되었습니다.`
                );
                navigate("/host-mypage/kitchen-management");
            }
        } catch (err) {
            console.error("제출 실패", err);
            alert("제출 중 오류가 발생했습니다.");
        }
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
                        handleSubmitKitchen={handleSubmitKitchen}
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
