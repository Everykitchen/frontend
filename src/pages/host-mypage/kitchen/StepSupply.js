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

const StepSupply = ({ formData, setFormData, nextStep, prevStep }) => {
    const [supplies, setSupplies] = useState(
        formData.providedItem.length > 0
            ? formData.providedItem.map((item) => ({
                  itemName: item.itemName || item.name || "",
                  check: item.check ?? true,
              }))
            : [{ itemName: "", check: true }]
    );

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            providedItem: supplies.filter((s) => s.itemName?.trim()),
        }));
    }, [supplies]);

    const handleAddSupply = () => {
        setSupplies((prev) => [...prev, { itemName: "", check: true }]);
    };

    const handleDeleteSupply = (index) => {
        const updated = [...supplies];
        updated.splice(index, 1);
        setSupplies(updated);
    };

    const handleSupplyChange = (index, field, value) => {
        const updated = [...supplies];
        if (field === "check") {
            updated[index][field] = value.target.checked;
        } else {
            updated[index][field] = value;
        }
        setSupplies(updated);
    };

    const syncFormData = () => {
        const filtered = supplies.filter((s) => s.itemName?.trim());
        setFormData((prev) => ({
            ...prev,
            providedItem: filtered,
        }));
    };

    return (
        <Container>
            <SectionTitle>
                보유하신 구비 품목들에 체크해주세요.
                <AddButton onClick={handleAddSupply}>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <thead>
                    <tr>
                        <th>보유</th>
                        <th>품목명</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {supplies.map((supply, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={supply.check}
                                    onChange={(e) =>
                                        handleSupplyChange(index, "check", e)
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    placeholder="예: 위생장갑"
                                    value={supply.itemName}
                                    onChange={(e) =>
                                        handleSupplyChange(
                                            index,
                                            "itemName",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() => handleDeleteSupply(index)}
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
                        nextStep();
                    }}
                >
                    다음
                </NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepSupply;
