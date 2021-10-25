import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDp3DdsqNfYJeCXIveh-7dDvnJhmudgdeE',
  authDomain: 'sentinel-a6249.firebaseapp.com',
  databaseURL: 'https://sentinel-a6249-default-rtdb.firebaseio.com/',
  projectId: 'sentinel-a6249',
  storageBucket: 'sentinel-a6249.appspot.com',
  messagingSenderId: '1069922297779',
//   appId: 'app-id',
//   measurementId: 'G-measurement-id',
};

const database = getDatabase(app);

initializeApp(firebaseConfig);

