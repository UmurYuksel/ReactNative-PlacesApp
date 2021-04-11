import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Colors from '../constans/Colors';


const ImgPicker = props => {
    const [pickedImage, setPickedImage] = useState();

    
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Bu Özelliği Kullanabilmek için izin vermeniz gerekiyor.', [{ text: 'Ok' }]);
            return false;
        }
        return true;
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });

        setPickedImage(image.uri);
        //Forward image back to the main component
        props.onImageTaken(image.uri);
    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {!pickedImage ? (<Text>
                    No image picked yet.
                </Text>)
                    : (<Image style={styles.image} source={{ uri: pickedImage }} />)}
            </View>
            <Button title="Take Image" color={Colors.primary} onPress={takeImageHandler} />
        </View>
    );
};


const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth:1
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ImgPicker;