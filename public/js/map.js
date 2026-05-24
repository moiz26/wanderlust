mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listingCoordinates.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});
console.log(listingCoordinates.geometry.coordinates )
// create a marker at a coordinate
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listingCoordinates.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${listingCoordinates.location }</h4>
            <p>Exact location wil be provided after booking</p>`)
    )
    
    .addTo(map);

  
