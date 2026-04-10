import { View,Text } from "react-native";
import { db,auth } from "@/lib/firebase";
import { collection,query,where,onSnapshot,or, orderBy } from "firebase/firestore";
import { useState,useEffect } from "react";


export default function HomeScreen () {
    const[tasks,setTasks]=useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if(!user) return;

        const q = query(
            collection(db,'tasks'),
            where('userId','==',user.uid),
            orderBy('dueDate','asc')
        );

        const unSubscribe = onSnapshot(q,(snapshot) => {
            const taskList = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }));
            setTasks(taskList);
            console.log(tasks)
        })

        return () => unSubscribe();

    },[])
    return (
        <View >
            <Text>HELLO WORLD</Text>
        </View>
    )
}