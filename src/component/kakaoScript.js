import react, { useEffect, useMemo } from "react";
import { elevatorLocation } from "../data/elevatorLocation";
const { kakao } = window;

export default function KakaoMapScript({ searchText }) {
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
        // kakao map
        const container = document.getElementById('kakao-map');
        const options = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3
        };
        const map = new kakao.maps.Map(container, options);

        for (var j = 0; j < markers.length; j++) {
            markers[j].setMap(map);
        }

        const getCurrentPos = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var lat = position.coords.latitude;
                        var lon = position.coords.longitude;
                        var currentPos = new kakao.maps.LatLng(lat, lon);
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: currentPos,
                            image: new kakao.maps.MarkerImage(
                                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                new kakao.maps.Size(24, 35),
                                { offset: new kakao.maps.Point(13, 35) }
                            )
                        });
                        map.setCenter(currentPos);
                    },
                    function (err) {
                        options.center = new kakao.maps.LatLng(37.566826, 126.9786567);
                        const map = new kakao.maps.Map(container, options);
                    })
            }
        }
        getCurrentPos();

        const filteredLocations = elevatorLocation.DATA.filter(
            (location) => location.sw_nm === searchText
        );

        if (filteredLocations.length > 0) {
            const regex = /\d+\.\d+/g;
            const filteredPoint = filteredLocations[0].node_wkt.match(regex);
            console.log(filteredPoint);
            const moveLotation = new kakao.maps.LatLng(parseFloat(filteredPoint[1]), parseFloat(filteredPoint[0]));
            console.log(moveLotation);
            kakao.maps.event.addListener(map, "tilesloaded", function () {
                map.panTo(moveLotation);
            }
            )
        }
    }, [searchText, markers]);

    return (
        <div id="kakao-map" style={{ width: "100%", height: "100vh" }} />
    )
}