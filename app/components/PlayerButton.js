import React from "react";
import { AntDesign } from '@expo/vector-icons';
import color from "../../misc/color";

const PlayerButton = (props) => {
    const {iconType, size= 40, iconColor = color.FONT, onPress} = props;
    const getIconName = (type) => {
      switch (type) {
          case 'PAUSE':
              return 'playcircleo'
          case 'PLAY':
              return 'pausecircle'
          case 'NEXT':
              return 'forward'
          case 'PREV':
              return 'banckward'
      }
    }
    return (
      <AntDesign
          {...props}
          onPress={onPress}
          name={getIconName(iconType)}
          size={size}
          color={iconColor}
      />
    )
}

export default PlayerButton;