'use server';

import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export async function saveName(name: string) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: name,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}
