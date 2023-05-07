import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchContainer = styled.div`
    width: 100%;
    height: 5rem;
    position: absolute;
    top: 5rem;
    z-index: 100;
`

const Form = styled.form`
    width: 100%;
    display: flex;
    justify-content: center;
    @media screen and (max-width: 500px) {
        width: 90%;
        margin: auto;
    }
`

const Input = styled.input`
    position: relative;
    display: flex;
    flex-direction: row;
    width: 300px;
    max-width: 400px;
    font-size: 1rem;
    border: none;
    border-radius: 0.25rem;
    background: #fff;
    color: rgb(33, 42, 62);
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 1rem 2rem;
    &::placeholder {
        font-size: 1rem;
    }
`

const SearchBtn = styled.button`
    width: 3.5rem;
    background: #212A3E;
    border: none;
    border-radius: 0.25rem; 
    font-size: 1.5rem;
    line-height: 2.4rem;
    transition: background-color .25s;
    color: #7881A1;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    &:hover {
    background-color: #BFD2FF;
    }
`

const Search = (props) => {
    const [inputText, setInputText] = useState('');

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputText(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.setSearchText(inputText);
    }

    const textChecker = (e) => {
        if (inputText === '') {
            alert('검색어를 입력해주세요!');
        }
    }

    return (
        <SearchContainer>
            <Form onSubmit={handleSubmit}>
                <Input type='text' value={inputText} onChange={handleInputChange} placeholder='역명을 입력하세요! ex) 혜화 / 혜화역' />
                <SearchBtn type='submit' onClick={textChecker}><FontAwesomeIcon icon={faSearch} /></SearchBtn>
            </Form>
        </SearchContainer>
    );
}

export default Search;