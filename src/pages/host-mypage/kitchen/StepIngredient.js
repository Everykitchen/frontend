import { useEffect, useState } from "react";
import styled from "styled-components";

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
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 40px;

    th,
    td {
        border: 1px solid #eee;
        padding: 12px 8px;
        text-align: center;
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

const DeleteButton = styled.button`
    background: #e74c3c;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
`;

const Input = styled.input`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    // 스피너 제거
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
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

const Select = styled.select`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const StepIngredient = ({
    formData,
    setFormData,
    prevStep,
    handleSubmitKitchen,
}) => {
    const [basicIngredients, setBasicIngredients] = useState(
        formData.ingredients.length > 0
            ? formData.ingredients.map((i) => ({
                  ingredientName: i.ingredientName || i.name || "",
                  unit: i.unit || i.baseUnit || "",
                  price: i.price ?? 0,
              }))
            : [{ ingredientName: "", unit: "", price: 0 }]
    );

    const [extraIngredients, setExtraIngredients] = useState(
        formData.extraIngredients.length > 0
            ? formData.extraIngredients.map((i) => ({
                  ingredientName: i.ingredientName || i.name || "",
                  unit: i.unit || i.baseUnit || "",
                  price: i.price ?? 0,
              }))
            : [{ ingredientName: "", unit: "", price: 0 }]
    );

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            ingredients: basicIngredients
                .filter((i) => i.ingredientName?.trim())
                .map((i) => ({
                    ...i,
                    additional: false,
                })),
            extraIngredients: extraIngredients
                .filter((i) => i.ingredientName?.trim())
                .map((i) => ({
                    ...i,
                    additional: true,
                })),
        }));
    }, [basicIngredients, extraIngredients]);

    const handleChange = (setter, index, field, value) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index][field] =
                field === "price" ? parseInt(value, 10) || 0 : value;
            return updated;
        });
    };

    const handleAdd = (setter) => {
        setter((prev) => [...prev, { ingredientName: "", unit: "", price: 0 }]);
    };

    const handleDelete = (setter, index) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const syncFormData = () => {
        setFormData((prev) => ({
            ...prev,
            ingredients: basicIngredients
                .filter((i) => i.ingredientName?.trim())
                .map((i) => ({
                    ...i,
                    additional: false,
                })),
            extraIngredients: extraIngredients
                .filter((i) => i.ingredientName?.trim())
                .map((i) => ({
                    ...i,
                    additional: true,
                })),
        }));
    };

    return (
        <Container>
            <SectionTitle>
                기본 재료
                <AddButton onClick={() => handleAdd(setBasicIngredients)}>
                    + 항목추가
                </AddButton>
            </SectionTitle>
            <Table>
                <thead>
                    <tr>
                        <th>재료명</th>
                        <th>단위</th>
                        <th>가격</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {basicIngredients.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    placeholder="예: 박력분"
                                    value={item.ingredientName}
                                    onChange={(e) =>
                                        handleChange(
                                            setBasicIngredients,
                                            index,
                                            "ingredientName",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Select
                                    value={item.unit}
                                    onChange={(e) =>
                                        handleChange(
                                            setBasicIngredients,
                                            index,
                                            "unit",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">단위 선택</option>
                                    <option value="1g">1g</option>
                                    <option value="10g">10g</option>
                                    <option value="100g">100g</option>
                                    <option value="1kg">1kg</option>
                                    <option value="10kg">10kg</option>
                                </Select>
                            </td>
                            <td>
                                <Input
                                    type="number"
                                    placeholder="예: 4000"
                                    value={item.price === 0 ? "" : item.price}
                                    onChange={(e) =>
                                        handleChange(
                                            setBasicIngredients,
                                            index,
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() =>
                                        handleDelete(setBasicIngredients, index)
                                    }
                                >
                                    삭제
                                </DeleteButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <SectionTitle>
                추가 재료
                <AddButton onClick={() => handleAdd(setExtraIngredients)}>
                    + 항목추가
                </AddButton>
            </SectionTitle>
            <Table>
                <thead>
                    <tr>
                        <th>재료명</th>
                        <th>단위</th>
                        <th>가격</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {extraIngredients.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    placeholder="예: 코코넛 분말"
                                    value={item.ingredientName}
                                    onChange={(e) =>
                                        handleChange(
                                            setExtraIngredients,
                                            index,
                                            "ingredientName",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Select
                                    value={item.unit}
                                    onChange={(e) =>
                                        handleChange(
                                            setExtraIngredients,
                                            index,
                                            "unit",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">단위 선택</option>
                                    <option value="1g">1g</option>
                                    <option value="10g">10g</option>
                                    <option value="100g">100g</option>
                                    <option value="1kg">1kg</option>
                                    <option value="10kg">10kg</option>
                                </Select>
                            </td>
                            <td>
                                <Input
                                    type="number"
                                    placeholder="예: 5000"
                                    value={item.price === 0 ? "" : item.price}
                                    onChange={(e) =>
                                        handleChange(
                                            setExtraIngredients,
                                            index,
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() =>
                                        handleDelete(setExtraIngredients, index)
                                    }
                                >
                                    삭제
                                </DeleteButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ButtonContainer>
                <NavButton
                    onClick={() => {
                        syncFormData();
                        prevStep();
                    }}
                >
                    이전
                </NavButton>
                <NavButton
                    onClick={() => {
                        syncFormData();
                        handleSubmitKitchen();
                    }}
                >
                    등록
                </NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepIngredient;
