import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import {firebase, firestore} from 'firebase';

export default function Home({navigation}) {

    const [mealkits, setMealKits] = useState(null);

    useEffect(() => {
        //Get all the mealkits from firestore
        getData();
    },[]);

    const getData = () => {
        firestore().collection("mealkit").onSnapshot(query => {
            const list = [];
            query.forEach(doc => {
                list.push(doc.data());
            });
            //Store mealkits to state variable
            setMealKits(list);
        });

        console.log(mealkits);
    }

    const goToDetailScreen = (item) => {
        navigation.push("MealKit",{mealkit: item});
    }

    const generateRows = ({item}) => {
        return(
            <TouchableOpacity style={{
                marginTop: 10
            }} onPress={() => goToDetailScreen(item)}>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                }}>
                    <Image source={{uri: item.image}} style={{
                        width: 130,
                        height: 130
                    }}/>
                    <View>
                        <Text style={{
                            marginLeft: 10,
                            fontSize: 18,
                            fontWeight: "500",
                            color: '#3D52D5'
                        }}>{item.name}</Text>

                        <Text style={{
                            marginLeft: 10,
                            fontSize: 14,
                            marginTop: 5,
                        }}>{item.description.substring(0,150)}</Text>

                        <Text style={{
                            fontSize: 18,
                            marginLeft: 10,
                            marginTop: 7,
                            color: '#DB2955',
                            fontWeight: '500'
                        }}>${item.price}</Text>

                        <Text style={{
                            marginLeft: 10,
                            marginTop: 7,
                            fontSize: 18,
                            color: '#7E8287'
                        }}>{item.calorieCount} calories</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

  return (
   <View style={styles.container}>
       <FlatList 
        data={mealkits}
        renderItem={generateRows}
        keyExtractor={mealkit => mealkit.image}
       />
   </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFF',
      paddingLeft: 10,
      paddingRight: 10
    },
  });
