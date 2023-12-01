import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { searchResultsState, hashtagListState } from "../../component/common/AuthState";
import { useRecoilValue } from 'recoil';
import PostCard from '../../component/ui/list/PostCard';
import Button from "../../component/common/Button";
import { IoSearchSharp } from "react-icons/io5";
import axios from 'axios';
import Paging from "../../component/ui/list/Paging";
import '../../styles/pages/PostList.css';
import Pagination from "react-js-pagination";

function PostList() {
  const { searchTerm } = useParams(); // useParams로 url에서 파라미터 추출
  const [posts, setPosts] = useState([]); // 게시글 담을 배열 생성
  const [count, setCount] = useState(0); // 아이템 총 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지. default 값으로 1
  const [postPerPage, setPostPerPage] = useState(5); // 한 페이지에 보여질 아이템 수 
  const [currentPosts, setCurrentPosts] = useState(0); // 현재 페이지에서 보여지는 아이템들

  const navigate = useNavigate();
  const location = useLocation();

  const searchResults = useRecoilValue(searchResultsState); // Recoil 상태 관리에서 검색 전역 관리
  const hashtagLists = useRecoilValue(hashtagListState);

  useEffect(() => {
    // url에서 페이지 번호
    const search = new URLSearchParams(location.search); // 현재 페이지 url에서 뒤에 page 번호 부분 객체로 변환
    const page = parseInt(search.get('page')) || 1; // 객체에서 page 가져오기, 없으면 1
    setCurrentPage(page);
  }, [location]);

  const setPage = (page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`); // 해당 페이지로 이동
  };

  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const offset = (pages - 1) * limit;

  const handlePostPerPageSelectChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setPostPerPage(selectedValue);
  };

  useEffect(() => {
    if (searchResults !== undefined) { // searchResults가 존재하는지 확인
      setPosts(searchResults);
      setCount(searchResults.length)
      const indexOfLastPost = currentPage * postPerPage;
      const indexOfFirstPost = indexOfLastPost - postPerPage;
      setCurrentPosts(searchResults.slice(indexOfFirstPost, indexOfLastPost));
    } else {
      // searchResults가 정의되지 않았거나 빈 배열인 경우 처리
    }
  }, [currentPage, postPerPage, searchResults]);

  return (
    <div className="wrapper">
      {/* {searchTerm && <div className="search-word"><IoSearchSharp /><div className="search-word-term">{searchTerm}</div></div>} */}
      <div className="postlist-topwrapper">
        {searchTerm && 
          <div className="region-word">
            <IoSearchSharp /><div className="search-word-term">{searchTerm}</div>
          </div>
          }
          <div>
            <button className="postlist-popularbtn">인기순</button>
            <button className="postlist-newestbtn">최신순</button>
            <select className="postlist-postperpage-select" onChange={handlePostPerPageSelectChange}>
              <option value="5">5개</option>
              <option value="10">10개</option>
              <option value="20">20개</option>
            </select>
          </div>
      </div>
      {currentPosts && posts.length > 0 ? (currentPosts.map((item)=> // currentPosts가 있고, posts도 하나라도 있으면
        (<PostCard key={item.id} path={`/${item.nickname}/${item.boardId}`} {...item} />))):(<div className="resultNone">검색결과가 없습니다.</div>)}
      <Paging page={currentPage} count={count} setPage={setPage} postPerPage={postPerPage}/>
      <Button />
    </div>
  )
}

export default PostList;