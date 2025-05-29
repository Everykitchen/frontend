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

const DAY_KOR_TO_ENG = {
    월: "MONDAY",
    화: "TUESDAY",
    수: "WEDNESDAY",
    목: "THURSDAY",
    금: "FRIDAY",
    토: "SATURDAY",
    일: "SUNDAY",
    공휴일: "HOLIDAY",
};

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
        minReservationTime: "1",
        openTime: "09:00",
        closeTime: "21:00",
        category: "",
        kitchenImages: [],
        account: {
            accountNumber: "",
            bankName: "",
        },
        ingredients: [],
        extraIngredients: [],
        kitchenFacility: [],
        cookingTool: [],
        providedItem: [],
        defaultPrice: {},
    });

    useEffect(() => {
        if (isEdit && editData) {
            const priceMap = {};
            (editData.defaultPrice || []).forEach((p) => {
                const korDay = Object.entries(DAY_KOR_TO_ENG).find(
                    ([kor, eng]) => eng === p.week
                )?.[0];
                if (korDay) priceMap[korDay] = p.price;
            });

            setFormData({
                id: editData.kitchenId || editData.id,
                kitchenName: editData.kitchenName || "",
                description: editData.description || "",
                phoneNumber: editData.phoneNumber || "",
                location: editData.location || "",
                detailLocation: editData.detailLocation || "",
                latitude: editData.latitude || "",
                longitude: editData.longitude || "",
                size: editData.size || "",
                baseClientNumber: editData.baseClientNumber || "",
                maxClientNumber: editData.maxClientNumber || "",
                minReservationTime:
                    editData.minReservationTime?.toString() || "1",
                openTime: editData.openTime?.slice(0, 5) || "09:00",
                closeTime: editData.closeTime?.slice(0, 5) || "21:00",
                category: editData.category || "",
                kitchenImages: editData.kitchenImages || [],
                account: {
                    accountNumber: editData.account?.accountNumber || "",
                    accountHolderName:
                        editData.account?.accountHolderName || "",
                    bankName: editData.account?.bankName || "",
                },
                ingredients: editData.ingredients || [],
                extraIngredients: editData.extraIngredients || [],
                kitchenFacility: editData.kitchenFacility || [],
                cookingTool: editData.cookingTool || [],
                providedItem: editData.providedItem || [],
                defaultPrice: priceMap,
            });
        }
    }, [isEdit, editData]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const mapFormDataToRequestBody = (data) => ({
        kitchenName: data.kitchenName,
        kitchenImages: data.kitchenImages,
        description: data.description,
        phoneNumber: data.phoneNumber,
        location: data.location,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        size: parseFloat(data.size),
        baseClientNumber: parseInt(data.baseClientNumber, 10),
        maxClientNumber: parseInt(data.maxClientNumber, 10),
        minReservationTime: parseInt(data.minReservationTime, 10),
        openTime: `${data.openTime}:00`,
        closeTime: `${data.closeTime}:00`,
        category: data.category,
        accountNumber: data.account.accountNumber,
        accountHolderName: data.account.accountHolderName,
        bankName: data.account.bankName,
        ingredients: data.ingredients,
        extraIngredients: data.extraIngredients,
        kitchenFacility: data.kitchenFacility,
        cookingTool: data.cookingTool,
        providedItem: data.providedItem,
        defaultPrice: Object.entries(data.defaultPrice || {}).map(
            ([day, value]) => ({
                week: DAY_KOR_TO_ENG[day] || day.toUpperCase(),
                price: value.enabled ? Number(value.price) : 0,
                enabled: String(value.enabled === true),
            })
        ),
    });

    const handleSubmitKitchen = async () => {
        if (!formData.kitchenImages || formData.kitchenImages.length === 0) {
            alert("이미지를 최소 1장 이상 등록해주세요.");
            return;
        }

        const form = new FormData();
        const payload = mapFormDataToRequestBody(formData);

        console.log(payload);

        for (const key in payload) {
            const value = payload[key];

            if (key === "kitchenImages") {
                value.forEach((file) => {
                    if (file instanceof File) {
                        form.append("kitchenImages", file);
                    }
                });
            } else if (key === "defaultPrice") {
                value.forEach((item, index) => {
                    const { week, enabled, price } = item;

                    form.append(`defaultPrice[${index}].week`, week ?? "");
                    form.append(
                        `defaultPrice[${index}].enabled`,
                        String(enabled)
                    );

                    if (
                        String(enabled) === "true" &&
                        price != null &&
                        price !== ""
                    ) {
                        form.append(
                            `defaultPrice[${index}].price`,
                            String(price)
                        );
                    }
                });
            } else if (
                Array.isArray(value) &&
                [
                    "ingredients",
                    "extraIngredients",
                    "kitchenFacility",
                    "cookingTool",
                    "providedItem",
                ].includes(key)
            ) {
                value.forEach((item, index) => {
                    for (const subKey in item) {
                        form.append(`${key}[${index}].${subKey}`, item[subKey]);
                    }
                });
            } else {
                form.append(key, value);
            }
        }

        try {
            const response = isEdit
                ? await api.post(`/api/host/kitchen/${formData.id}`, form, {
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
            <HostSideBar activeMenu="주방 관리" />
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
