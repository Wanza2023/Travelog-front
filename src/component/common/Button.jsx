import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, } from "recoil";
import styled from "styled-components";
import { isLoggedInState } from "./AuthState";

const StyledButton = styled.button`
    height: 3rem;
    width: 3rem;
    position: fixed;
    bottom: 7vh;
    right: 7vh;
    border-radius: 50%;
    border: 0px;
    background-color: black;
    cursor: pointer;
`

export default function Button() {
    const navigate = useNavigate();
    
    const [isLoggedIn,setIsLoggedIn] = useRecoilState(isLoggedInState); //Recoil로 전역상태로 login 상태관리

    const handleButtonOnClick = () => {
        if (isLoggedIn==true) { //로그인된 상태라면 write로 이동
            navigate("/write");
        } else { //로그인 안된 상태라면 write로 이동
            navigate("/login");
        }
    }

    return (
        <StyledButton onClick={handleButtonOnClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 14">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
        </StyledButton>
    )
}