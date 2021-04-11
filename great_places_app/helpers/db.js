
//The init will be imported on App.js file because I want my database to be ready as soon as the application starts.
import * as SQLite from 'expo-sqlite';


//If doesn't exists, it will create the database, if exists, it will open connection to it.
const db = SQLite.openDatabase('places.db');

//SQL databases works with tables, and tables includes records.
export const init = () => {
    const promise = new Promise((resolve, reject) => { // ON SUCCESS RETURN RESOLVE, ON ERROR RETURN REJECT WITH AN ERROR MESSAGE
        db.transaction((tx) => { // transaction allows me to execute SQL queries.
            tx.executeSql('CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
                [],
                () => {// ON SUCCESS 
                    resolve(); //IF the table exists, we again will get resolve from the promise.
                },
                (_, err) => { // ON ERROR
                    reject(err);
                }
            )
        });
    });
    return promise;
};

//INSERT DATA
export const insertPlace = (title,imageUri,address,lat,lng) => {
    const promise = new Promise((resolve, reject) => { // ON SUCCESS RETURN RESOLVE, ON ERROR RETURN REJECT WITH AN ERROR MESSAGE
        db.transaction((tx) => { // transaction allows me to execute SQL queries.
            //ID will be generated automatically so I will inserst other columns instead.
            tx.executeSql(`INSERT INTO places (title,imageUri,address,lat,lng) VALUES(?,?,?,?,?);`,
                [title,imageUri,address,lat,lng], //USE THIS APPROACH TO AVOID POSSIBLE INJECTION ATTACKS.
                (_,result) => {// ON SUCCESS --- FIRST ARGUMENT WHICH IS _ , IS THE REPETITION OF THE QUERY SO I CAN JUST USE _ INSTEAD OF MULTIPLYING THE QUERY.
                    resolve(result); //IF the table exists, we again will get resolve from the promise.
                },
                (_, err) => { // ON ERROR
                    reject(err);
                }
            )
        });
    });
    return promise;
};


export const fetchPlaces = () => {
    const promise = new Promise((resolve, reject) => { // ON SUCCESS RETURN RESOLVE, ON ERROR RETURN REJECT WITH AN ERROR MESSAGE
        db.transaction((tx) => { // transaction allows me to execute SQL queries.
            //ID will be generated automatically so I will inserst other columns instead.
            tx.executeSql(`SELECT * FROM places`,
                [], //USE THIS APPROACH TO AVOID POSSIBLE INJECTION ATTACKS.
                (_,result) => {// ON SUCCESS --- FIRST ARGUMENT WHICH IS _ , IS THE REPETITION OF THE QUERY SO I CAN JUST USE _ INSTEAD OF MULTIPLYING THE QUERY.
                    resolve(result); //IF the table exists, we again will get resolve from the promise.
                },
                (_, err) => { // ON ERROR
                    reject(err);
                }
            )
        });
    });
    return promise;
}