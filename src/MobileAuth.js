import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {firebaseConfig} from './config';


export default function MobileAuth({navigation}) {

    //Variables
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerifitionCode] = useState(null);
    const [codeSent, setCodeSent] = useState(false);
    const [buttonText, setButtonText] = useState("Send code");
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [numberInputStyle, setNumberInputStyle] = useState('auto');
    const [codeInputStyle, setcodeInputStyle] = useState('none');

    //Helper function
    const signInWithPhoneNumber = async (phoneNumber) => {
        if(!codeSent){
            try {
                setCodeSent(true);
                setButtonText("Submit");
                setNumberInputStyle("none");
                setcodeInputStyle("auto");
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                const verificationId = await phoneProvider.verifyPhoneNumber(`+1${phoneNumber}`, recaptchaVerifier.current);
                setVerificationId(verificationId);
              } catch (error) {
                console.log(error);
              }
            return;
        }
        //Confirm the code received
        confirmCode();
    }

    const confirmCode = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            
            //Store the phone number to local storage
            try{
                await AsyncStorage.setItem("emailId",phoneNumber)
                navigation.navigate("Main");
            } catch(error){
                console.log(error.toString());
            }
            
          } catch (error) {
            console.log(error);
            alert("Incorrect code!");
          }
    }

    return (
    <SafeAreaView style={styles.container}>
        <Text style={{
            fontSize: 25,
            color: '#3C3744',
            fontWeight: '600'
        }}>Live Fit Food</Text>

        {/* phone number textinput */}
        <View style={{
            width: '90%',
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            marginTop: 40,
            flexDirection: 'row'
        }} pointerEvents = {numberInputStyle}>
            <Ionicons name="md-phone-portrait" size={24} color="grey" style={{marginLeft: 5}}/>
            <Text style={{
                fontSize: 18,
                marginLeft: 15,
                alignSelf: 'center'
            }}>+1</Text>
            <TextInput style={{
                marginLeft: 5,
                width: '90%',
                fontSize: 18,
            }} 
            autoFocus
            keyboardType = 'phone-pad' returnKeyType='done' placeholder="Enter phone number"
            onChangeText={value => setPhoneNumber(value)} value={phoneNumber}/>
        </View>

        {/* pin textinput*/}
        <View style={{
            width: '90%',
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            flexDirection: 'row',
            marginTop: 15,
        }} pointerEvents = {codeInputStyle}>
            <Entypo name="typing" size={24} color="grey" />
            <TextInput style={{
                marginLeft: 10,
                width: '90%',
                fontSize: 18
            }} 
            keyboardType = 'numeric' returnKeyType='done' placeholder="Enter pin"
            onChangeText={value => setVerifitionCode(value)} value={verificationCode}/>
        </View>

        {/* Login/Signup button */}
        <TouchableOpacity style={{
            marginTop: 15,
            backgroundColor: '#3D52D5',
            borderRadius: 10,
            width: '90%',
            padding: 10,
        }} onPress={ () => signInWithPhoneNumber(phoneNumber)}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center',
                color: 'white',
                fontWeight: '400'
            }}>{buttonText}</Text>
        </TouchableOpacity>

        <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E2',
    alignItems: 'center',
    paddingTop: 30
  },
});
