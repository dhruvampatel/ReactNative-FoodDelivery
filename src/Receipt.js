import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { firestore } from 'firebase';

export default function Receipt({route, navigation}) {

    const [mealkit, setMealKit] = useState({name: "",description: "",price: 0,calorieCount: 0, image: "null"});
    const [tax, setTax] = useState(0.0);
    const [tip, setTip] = useState(0.0);
    const [total, setTotal] = useState(0.0);
    const [SKU, setSKU] = useState("");
    const [emailId, setEmailId] = useState("");
    const [today, setToday] = useState("");
    const [tenStyle, set10Style] = useState(styles.selectedBox);
    const [fifteenStyle, set15Style] = useState(styles.unselectedBox);
    const [twentyStyle, set20Style] = useState(styles.unselectedBox);
    const [otherStyle, setOtherStyle] = useState(styles.unselectedBox);
    const [tenTextStyle, set10TextStyle] = useState(styles.selectedText);
    const [fifteenTextStyle, set15TextStyle] = useState(styles.unselectedText);
    const [twentyTextStyle, set20TextStyle] = useState(styles.unselectedText);
    const [otherTextStyle, setOtherTextStyle] = useState(styles.unselectedText);

    useEffect(() => {
        //Get the data for mealkit
        setMealKit(route.params.mealkit);
    },[]);

    useEffect(() => {
        if(mealkit.price == 0){
            return;
        }
        //Calculate tax
        let value = parseFloat(mealkit.price) * 0.13
        setTax(value.toFixed(2));

        //Calculate 10% tip
        value = parseFloat(mealkit.price) * 0.10;
        setTip(value.toFixed(2));

        //Generate SKU
        generateSKU();

        //Get today's date
        getTodaysDate();
    },[mealkit]);

    useEffect(() => {
        if(mealkit.price == 0 || tax == 0.0 || tip == 0){
            return;
        }
        
        //Calculate total
        const value = parseFloat(mealkit.price) + parseFloat(tax) + parseFloat(tip)
        setTotal(value.toFixed(2));
        console.log(total);
    },[mealkit,tax,tip]);

    useEffect(() => {
        if(emailId === ""){
            return;
        }
        //Store the data to firestore
        storeToFirestore();
    },[emailId]);

    //Helper function
    const generateSKU = () => {
        let sku = "";

        sku = mealkit.name.substring(0,1);
        const today = new Date();
        const year = today.getFullYear();
        sku = sku + year;
        sku = sku + mealkit.name.substring(1,2);
        sku = sku + today.getHours() + today.getMinutes() + today.getSeconds();

        setSKU(sku);
    }

    const getTodaysDate = () => {
        const today = new Date();
        let dt = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        setToday(dt);
    }

    const tenPressed = () => {
        set10Style(styles.selectedBox);
        set15Style(styles.unselectedBox);
        set20Style(styles.unselectedBox);
        setOtherStyle(styles.unselectedBox);
        set10TextStyle(styles.selectedText);
        set15TextStyle(styles.unselectedText);
        set20TextStyle(styles.unselectedText);
        setOtherTextStyle(styles.unselectedText);

        //Calculate tip
        const value = mealkit.price * 0.10;
        setTip(value.toFixed(2));
    }

    const fifteenPressed = () => {
        set10Style(styles.unselectedBox);
        set15Style(styles.selectedBox);
        set20Style(styles.unselectedBox);
        setOtherStyle(styles.unselectedBox);
        set10TextStyle(styles.unselectedText);
        set15TextStyle(styles.selectedText);
        set20TextStyle(styles.unselectedText);
        setOtherTextStyle(styles.unselectedText);

        //Calculate tip
        const value = mealkit.price * 0.15;
        setTip(value.toFixed(2));
    }

    const twentyPressed = () => {
        set10Style(styles.unselectedBox);
        set15Style(styles.unselectedBox);
        set20Style(styles.selectedBox);
        setOtherStyle(styles.unselectedBox);
        set10TextStyle(styles.unselectedText);
        set15TextStyle(styles.unselectedText);
        set20TextStyle(styles.selectedText);
        setOtherTextStyle(styles.unselectedText);

        //Calculate tip
        const value = mealkit.price * 0.20;
        setTip(value.toFixed(2));
    }

    const otherPressed = () => {
        set10Style(styles.unselectedBox);
        set15Style(styles.unselectedBox);
        set20Style(styles.unselectedBox);
        setOtherStyle(styles.selectedBox);
        set10TextStyle(styles.unselectedText);
        set15TextStyle(styles.unselectedText);
        set20TextStyle(styles.unselectedText);
        setOtherTextStyle(styles.selectedText);

        //Prompt to allow user to enter tip percentage
        Alert.prompt(
            "Tip",
            "Enter tip amount",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "OK",
                onPress: value => setManualTip(value)
              }
            ],
          );
    }

    const setManualTip = (value) => {
        let amount = parseFloat(value);
        setTip(amount.toFixed(2));
        console.log("Tip: "+tip);
    }
    
    const confirmOrder = async () => {
        //Get emailId from local storage
        try{
            let mail = await AsyncStorage.getItem("emailId");
            setEmailId(mail);
        } catch(errro){
            console.log(error.toString());
        }
    }

    const storeToFirestore = async () => {
        await firestore().collection("orders").add({
            name: mealkit.name,
            price: parseFloat(total),
            sku: SKU,
            emailId: emailId,
            date: today
        });

        //Go to tracking screen
        navigation.push("Track Order");
    }

  return (
    <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                {/* mealkit name */}
                <Text style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: '#484349'
                }}>{mealkit.name}</Text>

                {/* mealkit price */}
                <Text style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: '#DB2955'
                }}>${mealkit.price}</Text>
            </View>

            {/* mealkit SKU */}
            <Text style={{
                fontSize: 13,
                fontWeight: '300',
                color: '#7E8287'
            }}>SKU: {SKU}</Text>

            {/* TAX */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
                <Text style={{
                    fontSize: 16
                }}>Tax(13%)</Text>

                <Text style={{
                    fontSize: 16
                }}>${tax}</Text>
            </View>

            {/* TIP */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 16
                    }}>Tip</Text>

                    <TouchableOpacity style={tenStyle} onPress={tenPressed}>
                        <Text style={tenTextStyle}>10%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={fifteenStyle} onPress={fifteenPressed}>
                        <Text style={fifteenTextStyle}>15%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={twentyStyle} onPress={twentyPressed}>
                        <Text style={twentyTextStyle}>20%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={otherStyle} onPress={otherPressed}>
                        <Text style={otherTextStyle}>Other</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{
                    fontSize: 16
                }}>${tip}</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '500'
                }}>Total</Text>

                <Text style={{
                    fontSize: 16,
                    fontWeight: '500'
                }}>${total}</Text>
            </View>

            {/* Place order button */ }
            <TouchableOpacity style={{
                marginTop: 50,
                backgroundColor: '#3D52D5',
                borderRadius: 10,
                width: '100%',
                padding: 10,
                alignSelf: 'flex-end'
            }} onPress={confirmOrder}>
                <Text style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: 'white'
                }}>Confirm order</Text>
            </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F5F5',
      paddingTop: 20,
      paddingLeft: 10,
      paddingRight: 10,
    },

    selectedBox: {
        backgroundColor: 'black',
        marginLeft: 10,
        padding: 5,
    },

    selectedText: {
        color: 'white',
        fontSize: 12
    },

    unselectedBox: {
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
        marginLeft: 10,
        padding: 5
    },

    unselectedText: {
        color: 'black',
        fontSize: 12
    }
  });
