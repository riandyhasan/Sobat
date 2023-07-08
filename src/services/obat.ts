import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  startAt,
  endAt,
  orderBy,
  getCountFromServer,
  doc,
  updateDoc,
  DocumentSnapshot,
  endBefore,
  where,
} from "firebase/firestore";
import { db } from "@services/firebase";

export const getObatNoFilter = async (): Promise<Obat[]> => {
  try {
    const queryRef = query(collection(db, "obat"), orderBy("index"));

    const querySnapshot = await getDocs(queryRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Obat[];

    return data as Obat[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getAllObat = async (
  pageLimit?: number,
  startDoc?: number
): Promise<Obat[]> => {
  try {
    const limitQuery = pageLimit != null ? pageLimit : 20;
    const startQuery = startDoc != null ? startDoc : 1;
    const queryRef = query(
      collection(db, "obat"),
      orderBy("index"),
      startAfter(startQuery),
      limit(limitQuery)
    );
    const querySnapshot = await getDocs(queryRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data as Obat[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getObatByName = async (searchQuery: string): Promise<Obat[]> => {
  try {
    const queryRef = query(collection(db, "obat"), orderBy("nama_obat"));

    const querySnapshot = await getDocs(queryRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Obat[];

    const sortedData = data
      .filter((obat) =>
        obat.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aDistance = Math.abs(
          a.nama_obat.toLowerCase().indexOf(searchQuery.toLowerCase())
        );
        const bDistance = Math.abs(
          b.nama_obat.toLowerCase().indexOf(searchQuery.toLowerCase())
        );
        return aDistance - bDistance;
      });

    return sortedData as Obat[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getObatLen = async (): Promise<number> => {
  const coll = collection(db, "obat");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const editObat = async (
  obatId: string,
  updatedData: Partial<Obat>
): Promise<string> => {
  try {
    const obatRef = doc(db, "obat", obatId);
    await updateDoc(obatRef, updatedData);
    return "success";
  } catch (error) {
    console.log("Error updating document:", error);
    return "failed";
  }
};
