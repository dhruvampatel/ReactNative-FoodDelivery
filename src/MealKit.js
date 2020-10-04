import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function MealKit({route, navigation}) {

    const [mealkit, setMealKit] = useState({name: "",description: "",price: 0,calorieCount: 0, image: "null"});

    useEffect(() => {
        setMealKit(route.params.mealkit);
    },[]);

    //Helper function
    const placeOrder = () => {
        navigation.push("Receipt",{mealkit: mealkit});
    }

  return (
    <View style={styles.container}>
        <ScrollView>
            <Image source={{uri: mealkit.image}} style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
                marginTop: 20
            }} />

            <View
             style={{
                 flexDirection: 'row',
                 justifyContent: 'space-between'
             }}>
                 {/* Mealkit name */}
                <Text style={{
                    fontSize: 25,
                    fontWeight: '500',
                    marginTop: 20,
                    color: '#3D52D5'
                }}>{mealkit.name}</Text>

                {/* Mealkit price */}
                <Text style={{
                    marginTop: 20,
                    fontSize: 25,
                    fontWeight: '500',
                    color: '#DB2955'
                }}>${mealkit.price}</Text>
            </View>

            {/* Mealkit calories */}
            <Text style={{
                marginTop: 4,
                color: '#7E8287',
                fontSize: 18
            }}>{mealkit.calorieCount} calories</Text>

            {/* Place order button */ }
            <TouchableOpacity style={{
                marginTop: 15,
                backgroundColor: '#3D52D5',
                borderRadius: 10,
                width: '100%',
                padding: 10,
            }} onPress={placeOrder}>
                <Text style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: 'white'
                }}>Place order</Text>
            </TouchableOpacity>

            <Text style={{
                marginTop: 20,
                fontSize: 16,
            }}>{mealkit.description}</Text>

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F5F5',
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 20
    },
  });
