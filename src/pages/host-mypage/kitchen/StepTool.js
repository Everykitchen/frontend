import { useState } from "react";
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

const CheckboxLabel = styled.label`
    margin-left: 8px;
`;

const StepFacility = ({ formData, setFormData, nextStep, prevStep }) => {
    const [tools, setTools] = useState([
        "도마",
        "전자레인지",
        "칼 세트",
        "냄비 / 후라이팬",
        "체(쌀용)",
        "임시볼(소/중/대)",
        "거품기",
        "주걱",
        "푸드프로세서",
        "핸드믹서",
        "반죽기",
        "온도계",
        "마들렌 틀",
        "휘낭시에 틀",
        "타르트 틀",
        "머핀 틀",
        "돔형판",
    ]);

    const handleAddTool = () => {
        setTools([...tools, ""]);
    };

    const handleToolChange = (index, value) => {
        const newTools = [...tools];
        newTools[index] = value;
        setTools(newTools);
    };

    return (
        <Container>
            <SectionTitle>
                보유하신 조리 도구들에 체크해주세요.
                <AddButton onClick={handleAddTool}>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <tbody>
                    {tools.map((tool, index) => (
                        <tr key={index}>
                            <td style={{ width: "30px" }}>
                                <input type="checkbox" id={`tool-${index}`} />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    value={tool}
                                    onChange={(e) =>
                                        handleToolChange(index, e.target.value)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ButtonContainer>
                <NavButton onClick={prevStep}>이전</NavButton>
                <NavButton onClick={nextStep}>다음</NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepFacility;
