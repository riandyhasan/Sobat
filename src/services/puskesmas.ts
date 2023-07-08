import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@services/firebase";

export const getAllPuskesmas = async (): Promise<Puskesmas[]> => {
  try {
    const queryRef = query(collection(db, "puskesmas"), orderBy("index"));

    const querySnapshot = await getDocs(queryRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Puskesmas[];

    return data as Puskesmas[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};
