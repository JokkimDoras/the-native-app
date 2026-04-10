import { View,Text, TextInput, Pressable,StyleSheet } from "react-native";
import { useState } from "react";

export default function LoginScreen() {
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');


  return (
    <View style={styles.constainer}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      
    </View>
  )



}

const styles = StyleSheet.create({
  constainer:{
    flex:1,
    justifyContent:'center',
    padding:20,
  },
  title:{
    fontSize: 28,
    marginBottom:20,
    fontWeight:'bold',
    textAlign:'center'

  },
  input:{
    padding:12,
    borderWidth:1,
    marginBottom:15,
    borderRadius:8,

  },
  button:{
    backgroundColor:'black',
    padding:15,
    borderRadius:8,


  },
  buttonText:{
    color:'white',
    textAlign:'center',
    fontWeight:'bold'

  }
})