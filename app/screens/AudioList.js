import React, {Component} from "react";
import {Dimensions, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AudioContext} from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListenItem from "../components/AudioListenItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import {Audio} from 'expo-av';
import {pause, play, playNext, resume} from '../../misc/AudioController';
import {storeAudioForNextOpening} from "../../misc/helper";

export class AudioList extends  Component {
    static contextType = AudioContext;
    constructor(props) {
        super(props);
        this.state = {
          optionModalVisible: false
        }
        this.currentItem = {};
        this.interval = null;
    }

    layoutProvider = new LayoutProvider((i) => 'audio',
    (type, dim) => {
        switch (type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
        }
    });


    handleAudioPress = async (audio) => {
        const {soundObj, playbackObj, currentAudio, updateState,
        audioFiles} = this.context;
        // playing audio for the first time.
        if(soundObj === null) {
         console.log("ttttttttttt");
        const playbackObj = new Audio.Sound();
        const statusS = await play(playbackObj, audio.uri);
        const index = audioFiles.indexOf(audio)
            updateState(this.context, {playbackObj:playbackObj,
                soundObj:statusS,currentAudio:audio, isPlaying: true,
                currentAudioIndex: index});
           this.interval = setInterval(async () => {
               console.log({hm:this.context.playbackDuration, td:this.context.playbackPosition});
                const status = await playbackObj.getStatusAsync();
               if(status.isLoaded) {
                   this.context.updateState(this.context, {
                       playbackObj:playbackObj,
                       soundObj:status, currentAudio:audio,
                       isPlaying: true,
                       currentAudioIndex: index,
                       playbackPosition: status.positionMillis,
                       playbackDuration: status.durationMillis
                   })
               }
                console.log({statusOnly:status})
               if(this.context.playbackPosition >= this.context.playbackDuration){
                   const nextAudioIndex = this.context.currentAudioIndex + 1;
                   const audio = this.context.audioFiles[nextAudioIndex];
                   // there is no next audio to play or the current audio is the last
                   if(nextAudioIndex >= this.context.totalAudioCount){
                   this.context.playbackObj.unloadAsync();
                      this.context.updateState(this.context, {
                       soundObj: null,
                       currentAudio: this.context.audioFiles[0],
                       isPlaying: false,
                       currentAudioIndex: 0,
                       playbackPosition: null,
                       playbackDuration: null
                       });
                   }
                   // otherwise we want to select the next audio
                   else {
                       this.context.updateState(this.context, {
                           soundObj: null, currentAudio: audio,
                           isPlaying: true, currentAudioIndex: nextAudioIndex,
                       });
                       this.handleAudioPress(audio);
                       clearInterval(this.interval);
                   }
               }
            }, 1000);
           storeAudioForNextOpening(audio, index)
           return ;
        }
        // pause audio
        if(soundObj.isLoaded && soundObj.isPlaying) {
        const status = await pause(playbackObj);
        if(this.interval !== null){
           clearInterval(this.interval);
        }
        return updateState(this.context, {soundObj:status, isPlaying:false});
        }
        // resume audio
        if(soundObj.isLoaded
        && !soundObj.isPlaying
        && currentAudio.id === audio.id) {
        const status = await resume(playbackObj)
        if(this.interval !== null){
           clearInterval(this.interval);
        }
        return updateState(this.context, {soundObj:status, isPlaying: true});
        }
        // select another audio
        if(soundObj.isLoaded && currentAudio.id !== audio.id){
        const status= await playNext(playbackObj, audio.uri);
        const index = audioFiles.indexOf(audio);
        return  updateState(this.context, {
        soundObj:status,
        currentAudio:audio,
        isPlaying: true,
        currentAudioIndex: index
        });
        }
    }
    componentDidMount() {
        this.context.loadPreviousAudio()
    }

    rowRenderer = (type, item, index, extendedState) => {
     return <AudioListenItem
         title={item.filename}
         isPlaying={extendedState.isPlaying}
         activeListItem={this.context.currentAudioIndex === index}
         duration={item.duration}
         onAudioPress={() =>  this.handleAudioPress(item)}
         onOptionPress={() => {
         this.currentItem = item;
         this.setState({...this.state, optionModalVisible:true
         })
         }}
     />
    }
    render() {
    //     return (
    //     <ScrollView>
    //     {this.context.audioFiles.map(item => <Text style={{padding: 10,
    //     borderBottomColor:'red', borderBottomWidth:2}} key={item.id}>{item.filename}</Text>)}
    //     </ScrollView>
    // );
        return <AudioContext.Consumer>
            {({dataProvider, isPlaying}) => {
            return (
                <Screen>
                <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{isPlaying}}
                />
                    <OptionModal
                    onPlayPress={() => console.log('Playing audio')}
                    onPlayListPress={() => console.log('addd')}
                    onClose={() => this.setState({...this.state,
                    optionModalVisible: false })}
                    visible={this.state.optionModalVisible}
                    currentItem={this.currentItem} />
                </Screen>
                )
            }}
        </AudioContext.Consumer>
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default AudioList;