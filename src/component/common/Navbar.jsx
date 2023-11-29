import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState ,nickNameState,memberIdState, searchResultsState } from "./AuthState";
import { Link,useNavigate,} from "react-router-dom";
import axios from "axios";
import '../../styles/component/Navbar.css';
import travelog_logo from '../../assets/images/travelog_logo.png'
import travelog_logo_02 from '../../assets/images/travelog_logo_02.png'
import travelog_logo_03 from '../../assets/images/travelog_logo_03.png'
import profile_icon from '../../assets/images/profile_icon.png'
import navigation_icon from '../../assets/images/navigation_icon.png'
import { IoSearchOutline } from "react-icons/io5";
import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "./useAuth";


const Navbar = () => {
    const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState); //로그인 상태
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [searchResults, setSearchResults] = useRecoilState(searchResultsState);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false); //검색버튼 토글
    const [memberId,setMemberId] = useRecoilState(memberIdState);
    const [nickName,setNickName] = useRecoilState(nickNameState);

    const profileIconClick = () => {
        if(isLoggedIn==false) {
            navigate('/login');
        }
    }
    // 검색 버튼 클릭했을 때 토글
    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    }
    // 검색창 입력 value 
    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };
    // 검색어 검색시 이벤트
    const handleSearchSubmit = async () => {
        if (searchTerm.trim() !== "") {
            // 검색어가 비어있지 않은 경우에만 URL로 이동
            try {
                const response = await axios.get(`${process.env.REACT_APP_BOARD_API_KEY}/search/${searchTerm}`);
                setSearchResults(response.data.body.reverse() || []);
                navigate(`/board/search/${searchTerm}`);
                console.log(response.data.body);
                setSearchTerm("");
            } catch (error) {
                console.error("Failed to fetch search results:", error);
            }
        } else {
            // 검색어가 비어있으면 예외 처리 또는 경고 메시지를 표시할 수 있습니다.
            alert("검색어를 입력하세요.");
        }
    };

    // 검색창에서 enter 키 눌렀을 때 이벤트 처리
    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearchSubmit(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    const handleLogout = () => { // 로그아웃 시 세션스토리지 지우기
        // removeCookie('token');
        setIsLoggedIn(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('nickName');
        sessionStorage.clear();
        // navigate(0,{replace : true});
    };
    return (
        <div className="navbar">
            <div className="navbar-logo">
                <Link to="/"><img className="navbar-logo" src={travelog_logo_02} alt="Travelog Logo" /></Link>
            </div>
            <div className="navbar-search-bar">
                {isSearchOpen &&
                    <input className="search-input" type="text" placeholder="검색" value={searchTerm} onChange={handleSearchInputChange} onKeyPress={handleOnKeyPress} />
                }
            </div>
            <div className="navbar-search-icon">
                <div className="profile-icon" onClick={handleSearchClick}>
                    {/* <img src={navigation_icon} alt="검색버튼" /> */}
                    <IoSearchOutline size={30} />
                </div>
            </div>
            <div class="navbar-profile">
                <div className="profile-icon">
                    {/* <img src={profile_icon} alt="Profile Icon" onClick={profileIconClick}/> */}
                    <BiUserCircle size={30} onClick={profileIconClick}/>
                </div>
                {/* IsLoggedIn 이 True이면 div를 보이고 아니면 div 안보이기 */}
                {isLoggedIn && (
                    <div className="optionList">
                        <div className="optionListItem" ><Link to={`/user/${nickName}`}>내블로그</Link></div>
                        <div className="optionListItem"><Link to="/personaledit?tab=change">계정관리</Link></div>
                        <div className="optionListItem"><Link to="/personaledit">블로그관리</Link></div>
                        <div className="optionListItem"><button className="logoutButton" onClick={handleLogout}>로그아웃</button></div>
                    </div>
                    )
                }
            </div>
        </div>
    );
}

export default Navbar;