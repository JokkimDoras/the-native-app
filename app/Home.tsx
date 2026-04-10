import { View,Text } from "react-native";
import { db,auth } from "@/lib/firebase";
import { collection,query,where,onSnapshot,or } from "firebase/firestore";

export default function HomeScreen () {
    return (
        <View >
            <Text>HELLO WORLD</Text>
        </View>
    )
}