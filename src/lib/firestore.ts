'use server';

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // Import db from the new firebase setup

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
    // Ensure we throw to be caught by the UI
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("An unknown error occurred while saving the name.");
  }
}