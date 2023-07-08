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
  addDoc,
  DocumentSnapshot,
  endBefore,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@services/firebase";
import { formatIndonesianDate } from "@utils/converters";

export const getAllPermintaan = async (
  pageLimit?: number,
  startDoc?: number
): Promise<Permintaan[]> => {
  try {
    const limitQuery = pageLimit != null ? pageLimit : 20;
    const startQuery = startDoc != null ? startDoc : 1;
    const queryRef = query(
      collection(db, "permintaan"),
      orderBy("index"),
      startAfter(startQuery),
      limit(limitQuery)
    );
    const querySnapshot = await getDocs(queryRef);

    const data = querySnapshot.docs.map((doc) => {
      const formattedDate = formatIndonesianDate(
        doc.data().tanggal_permintaan.toDate()
      );
      return {
        id: doc.id,
        ...doc.data(),
        tanggal_permintaan: formattedDate,
      };
    });

    return data as Permintaan[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getPermintaanByMonth = async (
  month: number,
  year: number
): Promise<Permintaan[]> => {
  try {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1);

    const queryRef = query(
      collection(db, "permintaan"),
      where("tanggal_permintaan", ">=", startOfMonth),
      where("tanggal_permintaan", "<", endOfMonth)
    );
    const querySnapshot = await getDocs(queryRef);

    const data = querySnapshot.docs.map((doc) => {
      const formattedDate = formatIndonesianDate(
        doc.data().tanggal_permintaan.toDate()
      );
      return {
        id: doc.id,
        ...doc.data(),
        tanggal_permintaan: formattedDate,
      };
    });

    return data as Permintaan[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getPermintaanLen = async (): Promise<number> => {
  const coll = collection(db, "permintaan");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const addPermintaan = async (
  newPermintaan: Partial<Permintaan>
): Promise<string> => {
  try {
    const permintaanRef = collection(db, "permintaan");
    const allPermintaan = await getPermintaanLen();
    const addedPermintaan = {
      ...newPermintaan,
      index: allPermintaan + 1,
    };
    await addDoc(permintaanRef, addedPermintaan);
    return "success";
  } catch (error) {
    console.log("Error adding document:", error);
    return "failed";
  }
};

export const editPermintaan = async (
  obatId: string,
  updatedData: Partial<Permintaan>
): Promise<string> => {
  try {
    const obatRef = doc(db, "permintaan", obatId);
    await updateDoc(obatRef, updatedData);
    return "success";
  } catch (error) {
    console.log("Error updating document:", error);
    return "failed";
  }
};

export const deletePermintaan = async (
  permintaanId: string
): Promise<string> => {
  try {
    const permintaanRef = doc(db, "permintaan", permintaanId);
    await deleteDoc(permintaanRef);
    return "success";
  } catch (error) {
    console.log("Error deleting document:", error);
    return "failed";
  }
};
