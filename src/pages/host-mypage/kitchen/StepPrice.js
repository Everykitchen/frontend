import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
`;

const FieldGroup = styled.div`
    margin-bottom: 60px;
`;

const Label = styled.label`
    font-size: 14px;
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
    margin-bottom: 16px;
`;

const FileInput = styled.input`
    display: block;
    margin-bottom: 16px;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    resize: vertical;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
`;

const ToggleButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
`;

const ToggleButton = styled.button`
    padding: 8px 20px;
    border: 1px solid #ccc;
    background-color: ${({ active }) => (active ? "#ffbc39" : "white")};
    color: ${({ active }) => (active ? "white" : "#333")};
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        border-color: #999;
    }
`;

const Section = styled.div`
    margin-bottom: 50px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    border-bottom: 2px solid #f0ad4e;
    padding-bottom: 6px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    th,
    td {
        text-align: center;
        padding: 6px 12px;
    }
    th {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
`;

const BankRow = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    input,
    select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        height: 40px;
    }
    select {
        min-width: 100px;
        max-width: 200px;
    }
`;

const Select = styled.select`
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const NextButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    float: right;
`;

const ImagePreviewWrapper = styled.div`
    display: flex;
    gap: 16px;
    margin: 16px 0px;
    flex-wrap: wrap;
`;

const ImageBox = styled.div`
    position: relative;
    border: ${(props) =>
        props.selected ? "3px solid #ffbc39" : "1px solid #ccc"};
    border-radius: 8px;
    padding: 4px;
`;

const PreviewImage = styled.img`
    width: 120px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
`;

const PreviewText = styled.div`
    text-align: center;
    font-size: 12px;
    margin-top: 4px;
`;

const StepPrice = ({ formData, setFormData, nextStep }) => {
    const [category, setCategory] = useState(formData.category || "");
    const [imageUrls, setImageUrls] = useState(formData.imageList || []);
    const [representativeImage, setRepresentativeImage] = useState(
        imageUrls[0] || ""
    );

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            category,
            imageList: imageUrls,
        }));
    }, [category, imageUrls]);

    const handlePriceChange = (day, value) => {
        setFormData((prev) => ({
            ...prev,
            prices: {
                ...prev.prices,
                [day]: value,
            },
        }));
    };

    const handleImageUpload = (files) => {
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const localUrl = URL.createObjectURL(file);
            uploadedUrls.push(localUrl);
        }
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        if (uploadedUrls.length > 0) {
            setRepresentativeImage(uploadedUrls[0]);
        }
    };

    return (
        <Container>
            <FieldGroup>
                <Label>주방명</Label>
                <Input
                    placeholder="예: 파이브잇 쿠킹스튜디오"
                    value={formData.kitchenName || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            kitchenName: e.target.value,
                        })
                    }
                />
                <Label>전화번호</Label>
                <Input
                    placeholder="010-0000-0000"
                    value={formData.phoneNumber || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                        })
                    }
                />
                <Label>분류</Label>
                <ToggleButtons>
                    {["쿠킹", "베이킹"].map((type) => (
                        <ToggleButton
                            key={type}
                            active={category === type}
                            onClick={() => setCategory(type)}
                        >
                            {type}
                        </ToggleButton>
                    ))}
                </ToggleButtons>
                <Label>이미지 등록</Label>
                <FileInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                />
                {imageUrls.length > 0 && (
                    <ImagePreviewWrapper>
                        {imageUrls.map((url, index) => (
                            <ImageBox
                                key={index}
                                selected={representativeImage === url}
                                onClick={() => setRepresentativeImage(url)}
                            >
                                <PreviewImage
                                    src={url}
                                    alt={`uploaded-${index}`}
                                />
                                <PreviewText>
                                    {representativeImage === url
                                        ? "대표 이미지"
                                        : "클릭하여 대표 설정"}
                                </PreviewText>
                            </ImageBox>
                        ))}
                    </ImagePreviewWrapper>
                )}
                <Label>공간 소개글</Label>
                <TextArea
                    placeholder="공간에 대한 소개를 작성해주세요."
                    value={formData.description || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />
            </FieldGroup>

            <Section>
                <SectionTitle>공간 정보</SectionTitle>
                <Label>위치</Label>
                <Input
                    value={formData.location || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                    }
                />
                <Label>위도</Label>
                <Input
                    value={formData.latitude || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                    }
                />
                <Label>경도</Label>
                <Input
                    value={formData.longitude || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                    }
                />
                <Label>면적</Label>
                <Input
                    value={formData.size || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                    }
                />
                <Label>기준 인원</Label>
                <Input
                    value={formData.baseClientNumber || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            baseClientNumber: e.target.value,
                        })
                    }
                />
                <Label>최대 인원</Label>
                <Input
                    value={formData.maxClientNumber || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            maxClientNumber: e.target.value,
                        })
                    }
                />
                <Label>오픈 시간</Label>
                <Input
                    type="time"
                    value={formData.openTime || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            openTime: e.target.value,
                        })
                    }
                />
                <Label>마감 시간</Label>
                <Input
                    type="time"
                    value={formData.closeTime || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            closeTime: e.target.value,
                        })
                    }
                />
                <Label>최소 예약시간(분)</Label>
                <Input
                    value={formData.minReservationTime || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            minReservationTime: e.target.value,
                        })
                    }
                />
            </Section>

            <Section>
                <SectionTitle>금액 설정</SectionTitle>
                <Label>1시간 기준 금액</Label>
                <Table>
                    <thead>
                        <tr>
                            {["월", "화", "수", "목", "금", "토", "일"].map(
                                (day) => (
                                    <th key={day}>{day}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {["월", "화", "수", "목", "금", "토", "일"].map(
                                (day) => (
                                    <td key={day}>
                                        <Input
                                            value={formData.prices?.[day] || ""}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    day,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                )
                            )}
                        </tr>
                    </tbody>
                </Table>
                <Label>공휴일</Label>
                <Input
                    placeholder="공휴일 금액"
                    value={formData.prices?.["공휴일"] || ""}
                    onChange={(e) =>
                        handlePriceChange("공휴일", e.target.value)
                    }
                />
            </Section>

            <Section>
                <SectionTitle>계좌정보</SectionTitle>
                <BankRow>
                    <Input
                        placeholder="계좌번호"
                        value={formData.account?.accountNumber || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    accountNumber: e.target.value,
                                },
                            })
                        }
                    />
                    <Input
                        placeholder="예금주명"
                        value={formData.account?.accountHolder || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    accountHolder: e.target.value,
                                },
                            })
                        }
                    />
                    <Select
                        value={formData.account?.bankName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    bankName: e.target.value,
                                },
                            })
                        }
                    >
                        <option value="">은행 선택</option>
                        <option value="신한은행">신한은행</option>
                        <option value="국민은행">국민은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="농협">농협</option>
                        <option value="IBK기업은행">IBK기업은행</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="케이뱅크">케이뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="SC제일은행">SC제일은행</option>
                        <option value="한국씨티은행">한국씨티은행</option>
                        <option value="대구은행">대구은행</option>
                        <option value="부산은행">부산은행</option>
                        <option value="경남은행">경남은행</option>
                        <option value="전북은행">전북은행</option>
                        <option value="광주은행">광주은행</option>
                        <option value="수협은행">수협은행</option>
                    </Select>
                </BankRow>
            </Section>

            <NextButton onClick={nextStep}>다음</NextButton>
        </Container>
    );
};

export default StepPrice;
