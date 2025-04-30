import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Container = styled.div`
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    padding-bottom: 6px;
    border-bottom: 2px solid #f0ad4e;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th,
    td {
        border: 1px solid #eee;
        padding: 12px 8px;
        text-align: left;
    }

    th {
        background-color: #fdfaf5;
        font-size: 14px;
        font-weight: 600;
    }
`;

const AddButton = styled.button`
    background: #ffbc39;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    float: right;
`;

const Input = styled.input`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    gap: 10px;
`;

const NavButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
`;

const Checkbox = styled.input`
    transform: scale(1.2);
    margin-right: 10px;
`;

const StepIngredient = ({ formData, setFormData, prevStep }) => {
    const [basicIngredients, setBasicIngredients] = useState([
        { name: "백설탕", unit: "1kg", price: "4000원" },
        ...Array(9).fill({ name: "", unit: "", price: "" }),
    ]);
    const [extraIngredients, setExtraIngredients] = useState([
        { name: "코코넛분말", unit: "10g", price: "4000원" },
        ...Array(9).fill({ name: "", unit: "", price: "" }),
    ]);

    const location = useLocation();
    const isEdit = location.state?.isEdit || false;
    const editData = location.state?.editData || {};

    const navigate = useNavigate();

    useEffect(() => {
        setFormData({
            ...formData,
            ingredients: {
                basic: basicIngredients,
                extra: extraIngredients,
            },
        });
    }, [basicIngredients, extraIngredients]);

    const handleIngredientChange = (list, setList, index, key, value) => {
        const newList = [...list];
        newList[index][key] = value;
        setList(newList);
    };

    const renderTable = (title, data, setData) => (
        <div style={{ marginBottom: "40px" }}>
            <SectionTitle>
                {title}
                <AddButton
                    onClick={() =>
                        setData([...data, { name: "", unit: "", price: "" }])
                    }
                >
                    + 항목추가
                </AddButton>
            </SectionTitle>
            <Table>
                <thead>
                    <tr>
                        <th>재료명</th>
                        <th>기준 단위</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    value={item.name}
                                    onChange={(e) =>
                                        handleIngredientChange(
                                            data,
                                            setData,
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    value={item.unit}
                                    onChange={(e) =>
                                        handleIngredientChange(
                                            data,
                                            setData,
                                            index,
                                            "unit",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    value={item.price}
                                    onChange={(e) =>
                                        handleIngredientChange(
                                            data,
                                            setData,
                                            index,
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

    const handleFinalSubmit = async () => {
        const payload = {
            kitchenName: formData.name,
            image: formData.imageUrl || "", // 혹시 있다면
            description: formData.description || "",
            phoneNumber: formData.phoneNumber || "",
            location: formData.address,
            latitude: formData.latitude || 0, // 임시
            longitude: formData.longitude || 0, // 임시
            size: formData.size,
            baseClientNumber: formData.baseClientNumber,
            maxClientNumber: formData.maxClientNumber,
            businessHours: formData.businessHours,
            defaultPrice: Object.entries(formData.prices).map(
                ([day, price]) => ({
                    week: day,
                    price: Number(price),
                })
            ),
            kitchenFacility: formData.facilities.map((f) => ({
                facilityName: f.name,
                amount: Number(f.amount),
                detail: f.detail,
            })),
            cookingTool: formData.tools.map((tool) => ({
                toolName: tool.name,
                check: tool.checked,
            })),
            providedItem: formData.supplies.map((item) => ({
                itemName: item.name,
                check: item.checked,
            })),
            ingredients: {
                basic: basicIngredients,
                extra: extraIngredients,
            },
        };

        try {
            if (isEdit) {
                // 수정모드 put 요청
                await axios.put(`/api/host/kitchen/${editData.id}`, payload);
                alert("주방 정보가 수정되었습니다.");
            } else {
                // 등록 모드 post 요청
                await axios.post("/api/host/kitchen", payload);
                alert("주방이 등록되었습니다.");
            }

            navigate("/host-mypage/kitchen-management");
        } catch (error) {
            console.error("등록/수정 실패:", error);
            alert("요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Container>
            {renderTable("기본 재료", basicIngredients, setBasicIngredients)}
            {renderTable("추가 재료", extraIngredients, setExtraIngredients)}

            <ButtonContainer>
                <NavButton onClick={prevStep}>이전</NavButton>
                <NavButton onClick={handleFinalSubmit}>완료</NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepIngredient;
