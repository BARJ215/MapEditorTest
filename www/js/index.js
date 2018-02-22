Backendless.initApp("1F116359-9934-2652-FF41-EC23042C0400","B59AA48F-500F-B1E8-FF7B-EACAB3399500");
var currentPos={lat: 52.1936, lng: 2.2216};
var markers= [];
var points=[];

$(document).on("click","#saveButton",saveCourse);
$(document).on("click","#loadButton",load);
$(document).on("click","#uploadButton",upload);
//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
    
	//set up listener for button click
	
    
	//change time box to show message
	$('#time').val("Press the button to get location data");
    
    /*
    var locationOptions = {
        maximumAge: 10000,
        timeout: 6000,
        enableHighAccuracy: true
    };

    //navigator.geolocation.watchPosition(updatePosition,failPosition,locationOptions);
    //navigator.geolocation.getCurrentPosition(updatePosition, failPosition);
    */
    //Center Map
    centerMap();
});

function centerMap(){
    console.log("center map");
    //instruct location service to get position with appropriate callbacks
    navigator.geolocation.getCurrentPosition(centerPosition, failPosition);
}

function centerPosition(position){
    //Get position
    getPosition(position);
    //Load map
    initMap();
    
    //Add Start Finish Markers
    //startFinishMarkers();
    route ={
          origin: {lat: currentPos.lat,lng: currentPos.lng-0.003},  // Haight.
          destination: {lat: currentPos.lat,lng: currentPos.lng+0.003},  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode['WALKING']
    };
    calcRoute(directionsService, directionsDisplay, route);
    
    addMarker(currentPos);
}

//called when the position is successfully determined
function getPosition(position) {
	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    //Update current position
    currentPos.lat= latitude;
    currentPos.lng=longitude;
    
    
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated messageuklkh/lkhjlkhjlkh lkhlkhlkhlkhlk
	$('#m1longtext').val("Error getting data: " + error);
	
}

function initMap(){
    detectBrowser();

     map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 15
    });
    
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable:true,
        map: map
    });
    
    directionsService = new google.maps.DirectionsService;

}


function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '500px';
}

function calcRoute(directionsService, directionsDisplay, route) {
        //Attempt to calculate route
        directionsService.route(route, function(response, status) {
          if (status == 'OK') {
            //If succesful, display route and save
            directionsDisplay.setDirections(response);
            saveCourse();
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });     
}

function saveCourse(){
    
    var points=[];
    var geo = directionsDisplay.directions.geocoded_waypoints;
    //For everpoint on the map
    for(i=0; i<geo.length;i++){
        points[i]={placeId: geo[i].place_id};
        //If a waypoint...
        if(0<i&&i<geo.length-1){
           points[i]={location: {placeId: geo[i].place_id},stopover:false}; 
        }
    }
    
}

function upload(){
    var geo = directionsDisplay.directions.geocoded_waypoints;
    var newCourse={
        courseName: "Test",
        origin: geo[0].place_id,
        destination: geo[geo.length-1].place_id
    };
    if(geo.length>2){
        //Save optional waypoints as single string
        var waypoints =geo[1].place_id;
        for(i=2;i<geo.length-1;i++){
            //If does not exceed the limit
            if(waypoints.length+geo[i].place_id.length+1<=500){
               waypoints= String(waypoints+","+geo[i].place_id); 
            }
        }
        newCourse.waypoints=waypoints;
    }
    
    /*
    newCourse.courseName= "Test";
    newCourse.origin=geo[0].place_id;
    newCourse.destination=geo[geo.length-1].place_id;
    if(geo.length>2){
        console.log("optional waypoints");
        var wpoints={};
        for(i=1;i<geo.length-1;i++){   
            wpoints[i]={placeId: geo[i].place_id}
        }
        newCourse.points=wpoints;
        
    }
    */
    
    Backendless.Data.of("courses").save(newCourse).then(saved).catch(error);
}

function saved(savedCourse){
    console.log("uploaded " + savedCourse.objectId);
}

function error(err){
    alert(err);   
}

function load(){
    //Set inital point and destination
    route.origin=points[0];
    route.destination=points[points.length-1];
    //Optional waypoints...
    if(points.length>2){
        if(points.length==3){
          route.waypoints=[points[1]];  
        }else{
          route.waypoints=points.slice(1,points.length-1);
        }
    }
    //Calculate and display using new route
    calcRoute(directionsService, directionsDisplay, route);
}

function download(objectId){
    
}
function addMarker(location){
    //Create a new marker
    var marker = new google.maps.Marker({
        position: location,
        map: map,    
    });
    //Add marker to array
    markers.push(marker);
    console.log("add marker");
}

function deleteMarkers(){
    //Remove all markers from the map
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    //Clear markers array
    markers=[];
}

