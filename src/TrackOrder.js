import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const {height} = Dimensions.get('window');

export default function TrackOrder({navigation}) {

  //State variables
  const [userLocation, setUserLocation] = useState({latitude: -1, longitude: -1});
  const [storeLocation, setStoreLocation] = useState({latitude: 43.75083362262676, longitude: -79.31301345302096});
  const [distance, setDistance] = useState(-1);
  const [orderPlacedStyle, setOrderPlacedStyle] = useState(styles.urrentStatus);
  const [orderPreparingStyle, setOrderPreparingStyle] = useState(styles.nonCurrentStatus);
  const [orderReadyStyle, setOrderReadyStyle] = useState(styles.nonCurrentStatus);
  const [region, setRegion] = useState({latitude: -1, longitude: -1, latitudeDelta: 0.009, longitudeDelta: 0.009});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [readyForPickupButton, setReadyForPickupButton] = useState({backgroundColor: '#A8ABB3'});
  const [mapHeight, setMapHeight] = useState({height: height});

  useEffect(() => {
    //Set map height depending on the screem height
    let h = height / 2;
    setMapHeight({height: h});

    //Get the initial user location
    initialView();

    //Subscribe to get location updates from user
    subscribeToLocationChanges();
  },[]);

  //Set the distance between user and store once user's location is fetched
  useEffect(() => {
    let dist = getDistance(userLocation,storeLocation)
    setDistance(dist);
    console.log("Distance: "+dist);
  },[userLocation]);

  //Change the order status to being prepared once user is
  //within 100 meter radius of the store
  useEffect(() => {
    if(distance == -1){
      return;
    }
    if(distance <= 100){
      setOrderPreparingStyle(styles.currentStatus);
      setOrderPlacedStyle(styles.nonCurrentStatus);

      setTimeout(() => {
        setOrderPreparingStyle(styles.nonCurrentStatus);
        setOrderReadyStyle(styles.currentStatus);
        setButtonDisabled(false);
        setReadyForPickupButton({backgroundColor: '#3D52D5'});
      },4000);
    }
  },[distance]);

  //Helper function
  const initialView = async () => {
    //Request location permissions
    let {status} = await Location.requestPermissionsAsync(); 

    //Handle the status of the permission
    if(status === 'granted'){
      //Get current location and set to state variable
      let location = await Location.getCurrentPositionAsync();
      setUserLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});

      setRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.009, longitudeDelta: 0.009});

      console.log(userLocation);
    } else{
      console.log("Location permission denied!");
    }
  }

  const onRegionChange = (region) => {
    setRegion(region);
  }

  const subscribeToLocationChanges = async () => {
    //Ask for permissions
    let { status } = await Location.requestPermissionsAsync();

    //Check if permission was granted or not
    if(status === 'granted'){
      //watch for position changes
      await Location.watchPositionAsync({timeInterval: 2000},locationChangedCallback);
    } else{
      console.log("Permission to get location denied!");
    }
  }

  const locationChangedCallback = (location) => {
    //set to a state variable
    setUserLocation({latitude:location.coords.latitude, longitude: location.coords.longitude});
    //Set region to current user's location
    setRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.009, longitudeDelta: 0.009});
  }

  const pickupConfirmed = () => {
    alert("Thank you for ordering at LiveFitFood. Enjoy your meal.");
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        scrollEnabled={true}>
      <MapView style={[{
        width: "100%"}, mapHeight]
      }
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={true}
      initialRegion={region} 
      region={region}
      zoomEnabled={true}
      followsUserLocation={true}
      >
        <MapView.Marker 
        coordinate={storeLocation}
        title="LiveFitFood"
        description="Healthy food"/>
      </MapView>

      <Text style={[{
        fontSize: 22,
        marginTop: 20,
        fontWeight: '500',
        color: '#0D7DD3'}, orderPlacedStyle]
      }>Your order has been placed.</Text>

      <Text style={[{
        fontSize: 22,
        marginTop: 10,
        fontWeight: '500',
        color: '#A8ABB3'}, orderPreparingStyle]
      }>Your order is being prepared.</Text>

      <Text style={[{
        fontSize: 22,
        marginTop: 10,
        fontWeight: '500',
        color: '#A8ABB3'}, orderReadyStyle]
      }>Your order is ready for pickup.</Text>

      <TouchableOpacity style={[{
        marginTop: 30,
        borderRadius: 10,
        width: '90%',
        padding: 10,
        marginBottom: 20,
        alignSelf: 'center'}, readyForPickupButton]
      } disabled={buttonDisabled} onPress={pickupConfirmed}>
          <Text style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'white',
            fontWeight: '400'
          }}>Confirm pickup</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  currentStatus: {
    color: '#0D7DD3'
  },
  nonCurrentStatus: {
    color: '#A8ABB3'
  }
})