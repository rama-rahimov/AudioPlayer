import React from "react";
import  {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import PlayList from "../screens/PlayList";
const Tab = createBottomTabNavigator()
const AppNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon:({color, size , focused}) =>  (
                <MaterialIcons name="headset" size={size} color={color} />
            )
        }}/>
        <Tab.Screen name='Player' component={Player} options={{
            tabBarIcon:({color, size , focused}) =>  (
                <FontAwesome5 name="compact-disc" size={size} color={color} />
            )
        }}/>
        <Tab.Screen name='PlayList' component={PlayList} options={{
            tabBarIcon:({color, size , focused}) =>  (
                <MaterialIcons name="library-music" size={size} color={color} />
            )
        }}/>
    </Tab.Navigator>
};
export default AppNavigator;