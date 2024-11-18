import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {View} from "react-native";
import AudioListenItem from "./app/components/AudioListenItem";

export default function App() {
  return (
      <GestureHandlerRootView>
        <AudioProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AudioProvider>
      </GestureHandlerRootView>
      )
  //   return(
  //       <View style={{marginTop:50}}>
  //           <AudioListenItem/>
  //       </View>
  //   )
}
