import react, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { elevatorLocation } from "../data/elevatorLocation";
const { kakao } = window;

const MapDiv = styled.div`
    width: '100%',
    height: '100vh'
`

export default function KakaoMapScript({ searchText }) {
    const [map, setMap] = useState(null);

    const markers = useMemo(() => {
        const markers = [];
        for (var i = 0; i < elevatorLocation.DATA.length; i++) {
            var point = elevatorLocation.DATA[i].node_wkt
                .split("(")[1]
                .split(")")[0]
                .split(" ");

            var latlng = new kakao.maps.LatLng(
                parseFloat(point[1]),
                parseFloat(point[0])
            );

            var marker = new kakao.maps.Marker({
                position: latlng,
                clickable: false,
            });
            markers.push(marker);
        }
        return markers;
    }, []);

    useEffect(() => {
        kakao.maps.load(() => {
            const container = document.getElementById('kakao-map');
            const options = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567),
                level: 3
            };
            const newMap = new kakao.maps.Map(container, options);
            setMap(newMap);

            for (var j = 0; j < markers.length; j++) {
                markers[j].setMap(newMap);
            }

            const getCurrentPos = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            var lat = position.coords.latitude;
                            var lon = position.coords.longitude;
                            var currentPos = new kakao.maps.LatLng(lat, lon);
                            var marker = new kakao.maps.Marker({
                                map: newMap,
                                position: currentPos,
                                image: new kakao.maps.MarkerImage(
                                    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                    new kakao.maps.Size(24, 35),
                                    { offset: new kakao.maps.Point(13, 35) }
                                )
                            });
                            newMap.setCenter(currentPos);
                        },
                        function (err) {
                            options.center = new kakao.maps.LatLng(37.566826, 126.9786567);
                            const newMap = new kakao.maps.Map(container, options);
                            setMap(newMap);
                        })
                }
            }
            getCurrentPos();

            if (searchText) {
                const filteredLocations = elevatorLocation.DATA.filter(location => {
                    const regex = new RegExp(searchText.replace('역', '') + '역?');
                    if (location.sw_nm === null) {
                        return regex.test(location.emd_nm);
                    } else {
                        return regex.test(location.sw_nm);
                    }
                });


                if (filteredLocations.length > 0) {
                    const regex = /\d+\.\d+/g;
                    const filteredPoint = filteredLocations[0].node_wkt.match(regex);
                    const moveLotation = new kakao.maps.LatLng(parseFloat(filteredPoint[1]), parseFloat(filteredPoint[0]));
                    kakao.maps.event.addListener(newMap, 'tilesloaded', function () {
                        newMap.panTo(moveLotation);
                    }
                    )
                } else {
                    alert('결과를 찾을 수 없습니다!')
                }
            }
        })
    }, [searchText, markers]);

    return (
        <MapDiv id="kakao-map" style={{ width: "100%", height: "100vh" }} />
    )
}