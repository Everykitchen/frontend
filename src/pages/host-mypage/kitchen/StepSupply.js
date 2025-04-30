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
`;

const Input = styled.input`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
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

const StepSupply = ({ formData, setFormData, nextStep, prevStep }) => {
    const [items, setItems] = useState([
        "위생장갑",
        "앞치마",
        "키친타올",
        "종이용품",
        "컵",
        "지퍼백",
        "물티슈",
        "주방세제 / 수세미 / 행주",
        "쓰레기봉투",
    ]);

    const handleAddItem = () => {
        setItems([...items, ""]);
    };

    const handleItemChange = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    return (
        <Container>
            <SectionTitle>
                보유하신 구비 품목들에 체크해주세요.
                <AddButton onClick={handleAddItem}>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={{ width: "30px" }}>
                                <input type="checkbox" id={`supply-${index}`} />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    value={item}
                                    onChange={(e) =>
                                        handleItemChange(index, e.target.value)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ButtonContainer>
                <NavButton onClick={prevStep}>이전</NavButton>
                <NavButton onClick={nextStep}>완료</NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepSupply;
