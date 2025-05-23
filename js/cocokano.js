'use strict';

let map;
const pos = [ 35.65867636972139, 139.74541680454988 ];	// Tokyo tower
let watchId = null;

function initMap()
{
	map = L.map('map');
	map.setView(pos, 15);
	L.tileLayer(
		'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
		{
			attribution:
				"<a href='https://maps.gsi.go.jp/development/"
					+ "ichiran.html' target='_blank'>"
					+ "地理院タイル</a>",
			maxZoom: 21,
			maxNativeZoom: 18,
		}
	).addTo(map);
	map.addEventListener('click', e => {
		if (watchId === null) {
			const dum = {
				coords: {
					latitude: e.latlng.lat,
					longitude: e.latlng.lng,
				}
			};
			updateCurrentPosition(dum);
		}
	});
}

function checkGeolocationApi()
{
	if ('geolocation' in navigator === false) {
		err.style.display = 'grid';
		err.textContent = 'Geolocation API を利用できません';
	}
}

let marker = null;
let circle = null;
let coords;

function updateCurrentPosition(p)
{
	coords = p.coords;
	if (marker === null)
		marker = L.marker(pos), marker.addTo(map);
	if (circle === null)
		circle = L.circle(pos), circle.addTo(map);
	if (p) {
		marker.setLatLng([ p.coords.latitude, p.coords.longitude ]);
		circle.setLatLng([ p.coords.latitude, p.coords.longitude ]);
	}
	circle.setRadius(rnum.value = p.coords.accuracy);
	map.setView([ p.coords.latitude, p.coords.longitude ]);
	console.log('update');
}

initMap();
checkGeolocationApi();

rnum.addEventListener('input',
	() => { rran.value = rnum.value; updateCurrentPosition(); });

btnStart.addEventListener('click', () => {
	if (watchId === null) {
		watchId = navigator.geolocation.watchPosition(
			updateCurrentPosition,
			e => {
				err.style.display = 'grid';
				err.textContent = 'Error: ' + e.message;
			},
			{
				enableHighAccuracy: true
			}
		);
		btnStart.textContent = 'おわる';
	} else {
		watchId = null;
		navigator.geolocation.clearWatch(watchId);
		btnStart.textContent = 'はじめる';
	}
});

btnJson.addEventListener('click', () => {
	const blob = new Blob([ JSON.stringify(coords, null, 4) ],
		{ type: 'application/json' });
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'cocokano.json';
	a.click();
	a.remove();
});
