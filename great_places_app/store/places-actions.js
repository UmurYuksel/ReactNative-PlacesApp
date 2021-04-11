import * as FileSystem from 'expo-file-system';
import { insertPlace, fetchPlaces } from '../helpers/db';
import { vars } from '../env';

export const addPlace = (title, image, location) => {
    return async dispatch => {


        //This will return a formatted_addresses object which is the address that belongs to these coordinates.
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${vars.googleApiKey}`);


        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const resData = await response.json();

        if (!resData.results) {
            throw new Error('Something went wrong');
        }

        //This is how I retrieve the address
        const address = resData.results[0].formatted_address;

        //Permanent directory
        //cachedirectory is the directory where the image is saved for temporary
        //bundleDirectory is not a good place to save data
        //documentDirectory is the best fit. When the app is uninstalled, files will be gone too.
        const fileName = image.split('/').pop(); // split the string per "/" then pop=> take the last item of the array which is the name of the image.***
        const newPath = FileSystem.documentDirectory + fileName; //the image will be saved to this directory .
        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            });
            //INSERTING DATA TO THE DATABASE
            const dbResult = await insertPlace(
                title,
                newPath,
                address,
                location.lat,
                location.lng
            );
            //If the data is successfully inserted then it will return an object "insertId" which is the Id of the row that can be used in the future.
            console.log(dbResult);
            //Dispatch the action only if we succeeded.
            dispatch({
                type: 'ADD_PLACE',
                placeData: { id: dbResult.insertId, title: title, image: newPath, address: address, coords: { lat: location.lat, lng: location.lng } }
            });

        } catch (err) {
            console.log(err);
            throw err;
        }


    };
};


export const loadPlaces = () => {
    return async dispatch => {

        try {
            const dbResult = await fetchPlaces();
            dispatch({
                type: 'SET_PLACES',
                places: dbResult.rows._array // This includes all the records in the database
            });

        } catch (err) {
            console.log(err);
            throw err;
        }


    };
};