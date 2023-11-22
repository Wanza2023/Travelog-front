import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import Modal from "react-modal";
import { nickNameState } from "../../component/common/AuthState";
import PostWriteComponent from "../../component/ui/write/PostWriteComponent";
import SelectLocation from "../../component/ui/contents/schedule/SelectLocation";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
import styled from "styled-components";
import "../../styles/pages/PostWrite.css";

const Container = styled.div`
  padding: 2rem 3rem;
  display: grid;
  justify-content: center;
`;

const MyBlock = styled.div`
  margin: 0 auto;
  margin-bottom: 0.2rem;
`;
const WholeBox = styled.div`
  container-type: inline-size;
  display: flex;
`;

const Title = styled.div`
  padding: 10px;
`;

const TagBox = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 50px;
  margin: 10px;
  padding: 0 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  width: 100%;
  &:focus-within {
    border-color: #5076ff;
  }
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: #5076ff;
  color: white;
  border-radius: 5px;
  font-size: 13px;
`;

const Text = styled.span``;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  border: none;
  background-color: #5076ff;
  color: white;
`;

const TagInput = styled.input`
  display: inline-flex;
  width: auto
  background: transparent;
  border: none; 
  outline: none;
  cursor: text;
`;

function PostWrite() {
  const navigate = useNavigate();
  const [nickName, setNickName] = useRecoilState(nickNameState); // 닉네임 전역관리
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("지역 선택");
  const [scheduleItems, setScheduleItems] = useState([
    { date: "", transport: "", locationName: "" },
  ]);
  const [locationItems, setLocationItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달창 Open 여부
  const [totConfirm, setTotConfirm] = useState([0, 0, 0]); // 필수입력정보 입력되면 1로바꾸기
  const isFormValid = totConfirm.every((item) => item === 1); // 필수입력정보가 모두 입력되면 발행버튼이 눌리게하기
  const [isPublic, setIsPublic] = useState(true); // 글 공개 비공개 설정
  const [tagItem, setTagItem] = useState("");
  const [tagList, setTagList] = useState([]);
  const [summaryN, setSummaryN] = useState("");

  // axios post Write
  const boardWrite = async () => {
    const board = {
      nickname: nickName,
      local: selectedRegion,
      title: title,
      contents: desc,
      summary: summaryN,
      status: isPublic,
      schedules: schedules,
      hashtags: tagList,
    };

    await axios
      .post(`${process.env.REACT_APP_BOARD_API_KEY}/write`, board)
      .then((resp) => {
        const boardId = resp.data.body;
        navigate(`/${nickName}/${boardId}`, { replace: true }); // 글 작성후 작성된 글로 이동 후 뒤로가기 불가
        alert("새로운 게시글을 성공적으로 등록했습니다 :D");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // modal 창에서 위치 정보 선택
  const handleSelectLocation = (selectedLocationData) => {
    setLocationItems([...locationItems, selectedLocationData]); //모달에서 지도 받아온정보 경도,위도,위치이름 저장

    const newScheduleItems = [...scheduleItems];
    newScheduleItems[newScheduleItems.length - 1].locationName =
      selectedLocationData.location;  // scheduleItems에 위치 이름 저장
    setScheduleItems(newScheduleItems);
  };
  // 글쓰기 내용 content onChange
  function onEditorChange(value) {
    const content = value;
    setDesc(content);
    if (content === null) {
      totConfirm[2] = 0;
      setTotConfirm(() => [...totConfirm]);
    } else {
      totConfirm[2] = 1;
      setTotConfirm(() => [...totConfirm]);
    }
  }
  // 지역 Region onChange
  function handleRegionChange(event) {
    const region = event.target.value;
    setSelectedRegion(region);
    if (region === "지역선택") {
      totConfirm[0] = 0;
      setTotConfirm(() => [...totConfirm]);
    } else {
      totConfirm[0] = 1;
      setTotConfirm(() => [...totConfirm]);
    }
  }
  // 제목 title onChange
  const onChangeTitle = (e) => {
    const changeTitle = e.target.value;
    setTitle(changeTitle);
    if (changeTitle === null) {
      totConfirm[1] = 0;
      setTotConfirm(() => [...totConfirm]);
    } else {
      totConfirm[1] = 1;
      setTotConfirm(() => [...totConfirm]);
    }
  };
  // SelectLocation 컴포넌트에서 받아온 locationItems와 scheduleItems 합치기
  const combinedSchedule = locationItems.map((locationItem, index) => {
    return Object.assign({}, locationItem, scheduleItems[index]);
  });
  // 합쳐진 데이터 schedules에 저장
  const schedules = [...combinedSchedule];
  // + 버튼 클릭시 배열 추가
  const addScheduleItem = () => {
    const newScheduleItems = [...scheduleItems, { date: "", transport: "" }];
    setScheduleItems(newScheduleItems);
  };
  // 스케쥴 Schedule onChange
  const handleScheduleChange = (index, field, date) => {
    if (field === "date") {
      const formattedDate = date.toISOString().split('T')[0];
      const newScheduleItems = [...scheduleItems];
      newScheduleItems[index][field] = date;
      setScheduleItems(newScheduleItems);
    } else {
      const newScheduleItems = [...scheduleItems];
      newScheduleItems[index][field] = date;
      setScheduleItems(newScheduleItems);
    }
  };

  // 일정 - 버튼 클릭시 
  const removeScheduleItem = (index) => {
    const newScheduleItems = [...scheduleItems];
    newScheduleItems.splice(index, 1);
    setScheduleItems(newScheduleItems);
  };
  // 엔터키 입력시 해시태그 작성
  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };
  // 해시태그 입력
  const submitTagItem = () => {
    let updatedTagList = [...tagList];
    const newTagItem = tagItem.replace(/(\s*)/g, "");
    updatedTagList.push(newTagItem);
    setTagList(updatedTagList);
    setTagItem("");
  };
  // 해시태그 삭제
  const deleteTagItem = (e) => {
    const deletedTag = e.target.parentElement.firstChild.innerText.substr(2);
    const filteredTagList = tagList.filter((tagItem) => tagItem !== deletedTag);
    setTagList(filteredTagList);
  };
  // 요약 내용 입력 및 변경
  const handleSetSummaryValue = (e) => {
    setSummaryN(e.target.value);
  };
  //글 작성시 지역 선택,제목,내용 입력 안하면 alert창 띄우기
  const handleError = () => {
    alert("지역 선택,제목,내용을 모두 입력해주세요");
  };

  // const [summary, setSummary] = useState("");

  // const fetchSummary = async () => {
  //   // 본문 전송 후 요약글 받기
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_SUMMARY_API_KEY}`,
  //       { content: desc }
  //     );
  //     if (response.data && response.data.content) {
  //       setSummary(response.data.content);
  //       console.log(summary);
  //     } else {
  //       console.error("Invalid response format");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch summary:", error);
  //     if (error.response) {
  //       console.error("Server Response:", error.response.data);
  //     }
  //   }
  // };

  // 클로바 요약
  const fetchSummaryN = async () => {
    try {
      const requestBody = {
        title: title ? title : null,
        content: desc ? desc : null,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SUMMARY_API_KEY}`,
        requestBody
      );

      if (response.data && "summary" in response.data) {
        setSummaryN(response.data.summary);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch summary:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  return (
    <Container>
      <div className="body1">
        <select value={selectedRegion} onChange={handleRegionChange}>
          <option value="지역 선택" disabled>
            지역 선택
          </option>
          <option value="Seoul">서울</option>
          <option value="Gyeonggi">경기도</option>
          <option value="Incheon">인천</option>
          <option value="Gangwon">강원도</option>
          <option value="Chungbuk">충청북도</option>
          <option value="Chungnam">충청남도</option>
          <option value="Sejong">세종</option>
          <option value="Daejeon">대전</option>
          <option value="Gyeongbuk">경상북도</option>
          <option value="Gyeongnam">경상남도</option>
          <option value="Daegu">대구</option>
          <option value="Ulsan">울산</option>
          <option value="Busan">부산</option>
          <option value="Jeonbuk">전라북도</option>
          <option value="Jeonnam">전라남도</option>
          <option value="Gwangju">광주</option>
          <option value="Jeju">제주도</option>
        </select>
        <input
          id="title"
          type="text"
          value={title}
          placeholder="제목을 입력해주세요."
          onChange={onChangeTitle}
        />
        <label className="toggleBtn">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <span></span>
          <div className="toggleInput">{isPublic ? "공개" : "비공개"}</div>
        </label>
        <button onClick={!isFormValid ? handleError : boardWrite}>발행</button>
      </div>
      <div className="body2">
        <div className="schedulecss">
          {scheduleItems.map((item, index) => (
            <div key={index} className="scheduleList">
              <text className="index">{index + 1}번째 여행지</text>
              <DatePicker
                className="dateSelect"
                locale={ko}
                selected={item.date}
                onChange={(date) => handleScheduleChange(index, "date", date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜"
                showTimeSelect={false}
                showTimeInput={false} 
              />
              <button
                className="selectLocation"
                onClick={() => setModalIsOpen(true)}
              >
                장소
              </button>
              <Modal
                className="modal"
                isOpen={modalIsOpen}
                ariaHideApp={false}
                onRequestClose={() => setModalIsOpen(false)}
              >
                <SelectLocation
                  setModalIsOpen={setModalIsOpen}
                  setLocationItems={handleSelectLocation}
                />
              </Modal>
              {item.locationName && (
                <span className="locationName">{item.locationName}</span>
              )}
              <select 
                value={item.transport} 
                onChange={(e) => handleScheduleChange(index, 'transport', e.target.value)}
                className="selectTransport">
                <option value="" disabled>이동수단 선택</option>
                <option value="고속버스">고속버스</option>
                <option value="비행기">비행기</option>
                <option value="기차">기차</option>
                <option value="대중교통">대중교통</option>
                <option value="자차">자차</option>
                <option value="도보">도보</option>
              </select>
              <button className="plus" onClick={addScheduleItem}>
                +
              </button>
              {index > 0 ? (
                <button
                  className="minus"
                  onClick={() => removeScheduleItem(index)}
                >
                  -
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="body3">
        <MyBlock>
          <PostWriteComponent value={desc} onChange={onEditorChange} />
        </MyBlock>
      </div>
      <div className="foot">
        {/* <button onClick={fetchSummary}>카카오</button>
        {summary && <div className="summary-content">{summary}</div>} */}
        <div>
          <button onClick={fetchSummaryN}>AI 요약</button>
        </div>
        {summaryN && (
          <textarea
            className="summary-content"
            value={summaryN}
            onChange={handleSetSummaryValue}
          ></textarea>
        )}
        {/* <button>해시태그 추가</button> */}
      </div>
      <WholeBox>
        <TagBox>
          {tagList.map((tagItem, index) => {
            return (
              <TagItem key={index}>
                <Text># {tagItem}</Text>
                <Button onClick={deleteTagItem}>X</Button>
              </TagItem>
            );
          })}
          <TagInput
            type="text"
            placeholder="#해시태그를 입력하세요."
            tabIndex={2}
            onChange={(e) => setTagItem(e.target.value)}
            value={tagItem}
            onKeyPress={onKeyPress}
          />
        </TagBox>
      </WholeBox>
    </Container>
  );
}
export default PostWrite;