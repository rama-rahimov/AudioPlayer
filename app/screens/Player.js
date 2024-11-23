import React,{useContext, useEffect} from "react";
import {View, StyleSheet, Text, Dimensions, Switch} from 'react-native';
import Screen from "../components/Screen";
import color from "../../misc/color";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import {AudioContext} from "../context/AudioProvider";

const {width} = Dimensions.get('window')
const Player = () => {
    const context = useContext(AudioContext);
    const {playbackPosition, playbackDuration} = context;
    const calculateSeeBar = () => {
     if(playbackPosition !== null && playbackDuration !== null) {
     return playbackPosition
     }
     return 0;
    }

    const toggleSwitch = async () => {
       await context.playbackObj.setIsMutedAsync(!context.isEnabled);
      context.updateState(context, {isEnabled: !context.isEnabled});
    }

    useEffect(() => {
        console.log({isEnabled: context.isEnabled});
    context.loadPreviousAudio();
    }, []);

    if(!context.currentAudio) return null;
    return <Screen>
     <View style={styles.container}>
      <Text style={styles.audioCount}>{context.currentAudioIndex + 1} / {context.totalAudioCount}</Text>
     <View style={styles.midBannerContainer}>
         <MaterialCommunityIcons name="music-circle" size={300} color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
     </View>
     <View style={styles.audioPlayerContainer}>
        <Text numberOfLines={1} style={[styles.audioTitle, {paddingTop: 10, paddingBottom: 10}]}>
            Звук
        </Text>
         <Slider
         style={{width: width, height: 20}}
         minimumValue={0}
         maximumValue={1}
         value={context.sound}
         onValueChange={async(value) => {
             context.updateState(context, {sound: value})
             await context.playbackObj.setVolumeAsync(value);
         }}
         minimumTrackTintColor={color.FONT_MEDIUM}
         maximumTrackTintColor={color.ACTIVE_BG}
         />
         <Text numberOfLines={1} style={styles.audioTitle}>
             {context.currentAudio.filename}
         </Text>
         <Slider
             style={{width: width, height: 40}}
             minimumValue={0}
             maximumValue={playbackDuration}
             value={calculateSeeBar()}
             onSlidingComplete={async (value) => await context.playbackObj.setPositionAsync(value)}
             minimumTrackTintColor={color.FONT_MEDIUM}
             maximumTrackTintColor={color.ACTIVE_BG}
         />
         <Switch
             trackColor={{false: '#767577', true: '#81b0ff'}}
             thumbColor={context.isEnabled ? '#f5dd4b' : '#f4f3f4'}
             ios_backgroundColor="#3e3e3e"
             android_backgroundColor="#3e3e3e"
             onValueChange={toggleSwitch}
             value={context.isEnabled}
         />
         <View style={styles.audioControllers}>
           <PlayerButton iconType='PREV'/>
           <PlayerButton
               style={{marginHorizontal:25}}
               iconType={context.isPlaying ? 'PLAY': 'PAUSE'}
               onPress={() => console.log('playing')}/>
           <PlayerButton iconType='NEXT'/>
         </View>
     </View>
     </View>
    </Screen>
};

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    audioCount:{
       textAlign:'right',
        padding:15,
        color:color.FONT_LIGHT,
        fontSize:14
    },
    midBannerContainer:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    audioControllers:{
      width,
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center',
      paddingBottom:20
    },
    audioTitle:{
    fontSize:16,
    color:color.FONT,
    padding:15
    }
})
export default Player;