import firebase from 'firebase/app';

const config = {
  apiKey: 'AIzaSyCsYU_HkObfPqy2ZYQURS_qmuuuw72j2oQ',
  authDomain: 'cryptowatch-975fc.firebaseapp.com',
  databaseURL: 'https://cryptowatch-975fc.firebaseio.com',
  projectId: 'cryptowatch-975fc',
  storageBucket: 'cryptowatch-975fc.appspot.com',
  messagingSenderId: '603280724069',
};

firebase.initializeApp(config);

export default firebase;
