// Load the module
import React from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';
import Video from 'react-native-af-video-player'
import constantClass from '../Constants/ConstantClass'

// Within your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if you like.

export default class videoPlayer extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            show : false
        }
    }
    componentWillMount(){
        this.state.show = true
    }
    
    onFullScreen(status) {
        // Set the params to pass in fullscreen status to navigationOptions
        this.props.navigation.setParams({
          fullscreen: !status
        })
      }

    render() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId');
        console.log(itemId)
        const header = navigation.params && (navigation.params.fullscreen ? undefined : null)
        const url = "https://www.googleapis.com/drive/v3/files/" + itemId + "?alt=media&access_token=" + constantClass.GoogleKeys.GoogleAuthToken
        console.log(url)

        return (
            <SafeAreaView>
            {
                this.state.show == true ?
                    <Video
                    url={url} 
                    onFullScreen={status => this.onFullScreen(status)}/>
                    : null
                    
            }
            </SafeAreaView>
        );
    }
}

// Later on in your styles..
const styles = StyleSheet.create({
        backgroundVideo: {
            resizeMode:"cover",
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height:'100%',
            width:'100%'
        },
    });