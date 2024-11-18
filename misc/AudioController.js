//play audio
export const play = async (playbackObj, uri) => {
    try{
     return  await playbackObj.loadAsync(
            {uri},
            {shouldPlay:true}
        );
    } catch (e){
        console.log('error inside play helper method', e.message)
    }
}

// pause audio
export const pause = async (playbackObj) => {
    try{
    return await playbackObj.setStatusAsync({shouldPlay: false});
    } catch (e){
        console.log('error inside pause helper method', e.message)
    }
}

// resume audio
export const resume = async (playbackObj) => {
    try{
       return  await playbackObj.playAsync();
    } catch (e){
        console.log('error inside resume helper method', e.message)
    }
}

// select another audio
export const playNext = async (playbackObj, uri) => {
     try {
      await  playbackObj.stopAsync();
      await playbackObj.unloadAsync();
     return  await play(playbackObj, uri)
     }catch (e){
         console.log('error inside playNext helper method', e.message)
     }
}