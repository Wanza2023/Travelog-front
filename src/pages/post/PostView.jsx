import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { AiOutlineMore, AiOutlineEdit, AiOutlineDelete,AiOutlineFlag } from 'react-icons/ai';
import ScheduleList from '../../component/ui/contents/schedule/ScheduleList';
import HashtagList from '../../component/ui/contents/hashtag/HashtagList';
import CommentList from '../../component/ui/comment/CommentList';
import styled from 'styled-components';
import '../../styles/pages/PostView.css';
import Button from '../../component/common/Button';
import axios from 'axios';
import { nickNameState, bookmarkResultState } from '../../component/common/AuthState';
import { useRecoilState } from 'recoil';
import { IoLocationOutline } from "react-icons/io5";

const Container = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

function PostView() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);  // 수정 삭제 toggle
  const { nickname, boardId } = useParams();  // nickname 게시글 작성자 닉네임
  const [posts, setPosts] = useState([]);
  const [userNickname,setUserNickname] = useRecoilState(nickNameState) 
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const token = sessionStorage.getItem('token');
  const [bookmarkState, setBookmarkState] = useRecoilState(bookmarkResultState);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  }
  // 게시글 수정 onClick
  const handleEditClick = () => {
    axios
      .put(`${process.env.REACT_APP_BOARD_API_KEY}/write/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(function(res){
        // navigate(`/board/write/${boardId}`);
        console.log(res.data);
      })
      .catch(function(err){
        console.log("error: ", err);
      })
  };
  // 게시글 삭제 onClick 
  const handleDeleteClick = () => {
    if(userNickname !== nickname){
      alert('게시글 작성자만 삭제할 수 있습니다.');
    }
    else{
      if(window.confirm('게시글을 정말 삭제하시겠습니까?')){
        axios
        .delete(`${process.env.REACT_APP_BOARD_API_KEY}/${nickname}/${boardId}`)
        .then(function(res){
          alert('게시글이 삭제되었습니다.');
          navigate(-1);
        })
        .catch(function(err){
          console.log("error: ", err);
        })
      }
      else{
        alert('게시글 삭제를 취소하였습니다.');
      }
    }
  };
  const handleReportClick = () => {
    alert('신고 버튼 클릭');
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BOARD_API_KEY}/${nickname}/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`
        }
        });
        if (response.data && response.data.body) {
          console.log('Data received from the server:', response.data.body);
          setPosts(response.data.body);
          console.log(response.data.body);
          setBookmarkState(response.data.body.bookmark);
          console.log(response.data.body.bookmark);

          const commentResponse = await axios.get(`${process.env.REACT_APP_COMMENT_API_KEY}/${boardId}`);
          if (commentResponse.data) {
            setComments(commentResponse.data);
          }
        } else {
          console.error('Invalid response data format');
        }
      } catch (e) {
        console.error(e);
        alert('Error: 데이터를 불러올 수 없습니다');
      }
    };
    fetchData();
  }, [boardId, nickname,token,setBookmarkState]);

  // toISOString() 1일전 날짜 안뜨게 시간 변경
  function convertTime(date) {
    date = new Date(date);
    let offset = date.getTimezoneOffset() * 60000; //ms단위라 60000곱해줌
    let dateOffset = new Date(date.getTime() - 2*offset); // UTC 타임존 해결을 위해 offset 적용
    return dateOffset.toISOString();
  }

    if (posts) {
        const { title, createdAt, local, contents, summary, schedules, hashtags, nickname } = posts;
        let createdDate;
        try {
            createdDate = new Date(createdAt);
            if (isNaN(createdDate)) {
            throw new Error('Invalid date');
            }
        } catch (error) {
            console.error('Error parsing date:', error);
            createdDate = new Date();
        }
        const formattedDate = convertTime(createdDate).split("T")[0];

        const localToKorean = {
            Busan: "부산",
            Daegu: "대구",
            Daejeon: "대전",
            Gangwon: "강원도",
            Gwangju: "광주",
            Gyeonggi: "경기도",
            Incheon: "인천",
            Jeju: "제주도",
            Chungbuk: "충청북도",
            Gyeongbuk: "경상북도",
            Jeonbuk: "전라북도",
            Sejong: "세종",
            Seoul: "서울",
            Chungnam: "충청남도",
            Gyeongnam: "경상남도",
            Jeonnam: "전라남도",
            Ulsan: "울산"     
        };

        const localKorean = localToKorean[local] || local;

        return (
            <Container>
              <div className='view-container'>
                <div className='title'>
                  {title}
                  <div className='button-container'>
                  </div>
                </div>
                <div className='topcontainer'>
                  <button onClick={() => navigate(`/user/${nickname}`)} className='nickname'>
                    {nickname}
                  </button>
                  <div className='date'>{formattedDate}</div>
                  <div className='location'>
                    {/* <GrLocationPin /> */}
                    <IoLocationOutline />
                    <button onClick={() => navigate("/regionList/" + local)} className='location-name'>
                      {localKorean}
                    </button>
                  </div>
                  <button className='edit' aria-expanded={isExpanded} onClick={toggleExpanded}>
                    <AiOutlineMore className='edit'/>
                    {isExpanded && (
                      <div className='overflow_menu'>
                        {userNickname === nickname ? (
                          <>
                            <div className='overflow_menu_div'>
                              <button className='overflow_menu_btn' onClick={handleEditClick}>
                                <div className='edit-set'>
                                  <div className='overflow_menu_btn_div'>수정</div>
                                  <div><AiOutlineEdit /></div>
                                </div>
                              </button>
                            </div>
                            <button className='overflow_menu_btn' onClick={handleDeleteClick}>
                              <div className='edit-set'>
                                <div className='overflow_menu_btn_div'>삭제</div>
                                <div><AiOutlineDelete /></div>
                              </div>
                            </button>
                          </>
                        ) : (
                          <div className='overflow_menu_div'>
                            <button className='overflow_menu_btn' onClick={handleReportClick}>
                              <div className='edit-set'>
                                <div className='overflow_menu_btn_div'>신고</div>
                                <div><AiOutlineFlag /></div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
                <div className='border1' />
                  {schedules && schedules.length > 0 ? (
                    <div className='schedule'>
                      <ScheduleList scheduleData={schedules} />
                    </div>
                  ) : null}
                <ReactQuill
                  value={contents}
                  readOnly={true}
                  theme={'bubble'}
                />
                {summary && summary.length > 0 ? (
                  <div className="summary-box">
                      <p className="summary">요약</p>
                      <p className="summary-contents">{summary}</p>
                  </div>
                ) : null}
                <div className='hashtags'>
                    {Array.isArray(hashtags) ? (
                        <HashtagList hashtags={hashtags} />
                    ) : (
                        <p>null</p>
                    )}
                </div>
                {Array.isArray(comments) ? (
                        <CommentList 
                          comments={comments}
                          setComments={setComments}
                        />
                    ) : (
                        <p>null</p>
                    )}
              </div>
              <Button />
            </Container>
        );
    } else {
        return <div>Loading...</div>;
    }
}

export default PostView;