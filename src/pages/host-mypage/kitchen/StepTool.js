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

const StepTool = ({ formData, setFormData, nextStep, prevStep }) => {
    const [tools, setTools] = useState(
        formData.cookingTool.length > 0
            ? formData.cookingTool.map((t) => ({
                  toolName: t.toolName || t.name || "",
                  check: t.check ?? true,
              }))
            : [{ toolName: "", check: true }]
    );

    useEffect(() => {
        const filtered = tools.filter((t) => t.toolName);
        setFormData((prev) => ({
            ...prev,
            cookingTool: filtered,
        }));
    }, [tools]);

    const handleAddTool = () => {
        setTools((prev) => [...prev, { toolName: "", check: true }]);
    };

    const handleDeleteTool = (index) => {
        const updated = [...tools];
        updated.splice(index, 1);
        setTools(updated);
    };

    const handleToolChange = (index, field, value) => {
        const updated = [...tools];
        if (field === "check") {
            updated[index][field] = value.target.checked;
        } else {
            updated[index][field] = value;
        }
        setTools(updated);
    };

    const syncFormData = () => {
        const filtered = tools.filter((t) => t.toolName?.trim());
        setFormData((prev) => ({
            ...prev,
            cookingTool: filtered,
        }));
    };

    return (
        <Container>
            <SectionTitle>
                보유하신 조리 도구들에 체크해주세요.
                <AddButton onClick={handleAddTool}>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <thead>
                    <tr>
                        <th>보유</th>
                        <th>도구명</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {tools.map((tool, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={tool.check}
                                    onChange={(e) =>
                                        handleToolChange(index, "check", e)
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    placeholder="예: 도마"
                                    value={tool.toolName}
                                    onChange={(e) =>
                                        handleToolChange(
                                            index,
                                            "toolName",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() => handleDeleteTool(index)}
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

export default StepTool;
