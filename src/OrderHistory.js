import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, AsyncStorage } from 'react-native';
import {firestore} from 'firebase';

export default function OrderHistory() {

    const [emailId, setEmailId] = useState("");
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        getEmailIdFromLocalStorage();
    },[]);

    useEffect(() => {
        if(emailId === ""){
            return;
        }

        getData();
    },[emailId]);

    const getEmailIdFromLocalStorage = async () => {
        let mail = await AsyncStorage.getItem("emailId");
        setEmailId(mail);
    }

    const getData = () => {
        firestore().collection("orders").onSnapshot(query => {
            const list = [];
            query.forEach(doc => {
                if(doc.data().emailId == emailId){
                    console.log(doc.data());
                    list.push(doc.data());
                }
            });
            //Store orders to state variable
            setOrders(list);
        });
    }

    const generateRows = ({item}) => {
        return(
            <View style={{
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 10
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: '#3D52D5'
                    }}>{item.name}</Text>

                    <Text style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: '#DB2955'
                    }}>${item.price}</Text>
                </View>
                
                <Text style={{
                    marginTop: 2,
                    color: '#7E8287'
                }}>SKU: {item.sku}</Text>

                <Text style={{
                    marginTop: 5,
                    fontSize: 16,
                    
                }}>Date: {item.date}</Text>
            </View>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
        <FlatList 
            data={orders}
            renderItem={generateRows}
            keyExtractor={order => order.sku}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E0E0E2',
    },
  });
