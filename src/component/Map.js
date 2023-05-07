import React, { useState } from 'react';
import KakaoMapScript from './kakaoScript';
import Search from './Search';
const { kakao } = window;

const Map = () => {
    const [searchText, setSearchText] = useState('');

    return (
        <div>
            <Search setSearchText={setSearchText} searchText={searchText} />
            <KakaoMapScript searchText={searchText} />
        </div>
    );
};

export default Map;