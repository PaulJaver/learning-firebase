import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './components/Button';
import app from './firebase';

export default function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const onAuth = () => {
    signInWithRedirect(auth, provider);
  };

  const createAuthWithEmailAndPassword = () => {
    createUserWithEmailAndPassword(auth, 'something@gmail.com', 'xqsi1234')
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loginAuthWithEmailAndPassword = () => {
    signInWithEmailAndPassword(auth, 'something@gmail.com', 'xqsi1234')
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSignInData = () => {
    getRedirectResult(auth)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result?.user;
        console.log(token, user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createDataCollection = async () => {
    const infoUser = {
      product: 'Reloj',
      category: 'Tiempo',
      price: [
        {
          money: 'USD',
          quantity: 100,
        },
      ],
    };

    try {
      await addDoc(collection(db, 'cart'), infoUser);
    } catch (error) {
      console.log(error);
    }
  };

  const getColletionData = async () => {
    const { docs } = await getDocs(collection(db, 'users'));

    const userMapped = docs.map((user) => user.data());
    console.log(userMapped);
  };

  const updateColletionData = async () => {
    const userSelected = doc(db, 'cart', 'Opz4MRzkWYvLjxrIUL3g');

    try {
      await updateDoc(userSelected, {
        product: 'Mateo Max',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteColletionData = async () => {
    const userSelected = doc(db, 'cart', 'Opz4MRzkWYvLjxrIUL3g');

    try {
      await deleteDoc(userSelected);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSignInData();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Sign-in with Google" onPress={onAuth} />
      <Button title="Create user" onPress={createAuthWithEmailAndPassword} />
      <Button title="Login user" onPress={loginAuthWithEmailAndPassword} />
      <Button title="Create Data Collection" onPress={createDataCollection} />
      <Button title="Get User Data" onPress={getColletionData} />
      <Button title="Update Product Data" onPress={updateColletionData} />
      <Button title="Erase Product Data" onPress={deleteColletionData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00563e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
  },
});
