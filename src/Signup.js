import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';

export default function Signup({navigation}) {

    //Variables
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [indicatorStyle, setindicatorStyle] = useState({display: 'none'});

    //Helper functions

    const signupUser = (emailId, password) => {
        setindicatorStyle({display: 'flex'});
        try{
            if(emailId.length < 1){
                alert("Email id field is mandatory!");
                setindicatorStyle({display: 'none'});
                return;
            } else if(password.length < 6){
                alert("Password field must have 6 characters!");
                setindicatorStyle({display: 'none'});
                return;
            }

            //Authenticate user
            firebase.auth().createUserWithEmailAndPassword(emailId,password).then(() => {
                setindicatorStyle({display: 'none'});
                navigation.pop();
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert("Email address already in use");
                    setindicatorStyle({display: 'none'});
                  }
              
                  if (error.code === 'auth/invalid-email') {
                    alert("Invalid email address");
                    setindicatorStyle({display: 'none'});
                  }
            });
        }
        catch(error){
            console.log(error.toString());
        }
    }

    const storeEmail = async (emailId) => {
        try{
            await AsyncStorage.setItem(
                    'emailId',
                    emailId
            );
        } catch(error){
            console.log(error.toString());
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={{
            fontSize: 25,
            color: '#3C3744',
            fontWeight: '600'
        }}>Live Fit Food</Text>

        {/* Email id textinput */}
        <View style={{
            marginTop: 40,
            width: '90%',
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 18,
            flexDirection: 'row'
        }}>
            <MaterialCommunityIcons name="email-outline" size={24} color="grey" />
            <TextInput placeholder="Enter email id" style={{
                marginLeft: 10,
                width: '90%'
            }} 
            keyboardType = 'email-address' 
            onChangeText={email => setEmailId(email)}
            value={emailId}
            />
        </View>

        {/* Password textinput */}
        <View style={{
            marginTop: 15,
            width: '90%',
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 18,
            flexDirection: 'row'
        }}>
            <MaterialCommunityIcons name="textbox-password" size={24} color="grey" />
            <TextInput placeholder="Enter password" style={{
                marginLeft: 10,
                width: '90%',
            }} 
            secureTextEntry = {true}
            onChangeText={password => setPassword(password)}
            value={password}
            />
        </View>

        {/* Signup button */}
        <TouchableOpacity style={{
            marginTop: 15,
            backgroundColor: '#3D52D5',
            borderRadius: 10,
            width: '90%',
            padding: 10,
        }}
        onPress={() => signupUser(emailId,password)}>
            <Text style={{
                fontSize: 18,
                textAlign: 'center',
                color: 'white',
                fontWeight: '400'
            }}>Signup</Text>
        </TouchableOpacity>

        <View style={[styles.preloader, indicatorStyle]}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E2',
    alignItems: 'center',
    paddingTop: 70,
  },
  preloader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59595F',
    padding: 10,
    borderRadius: 15
  },
});
