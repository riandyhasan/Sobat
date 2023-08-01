import {
  collection,
  getDocs,
  getDoc,
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

export const getAllPenerimaan = async (
  pageLimit?: number,
  startDoc?: number
): Promise<Penerimaan[]> => {
  try {
    const limitQuery = pageLimit != null ? pageLimit : 20;
    const startQuery = startDoc != null ? startDoc : 1;
    const queryRef = query(
      collection(db, "penerimaan"),
      orderBy("index"),
      startAfter(startQuery),
      limit(limitQuery)
    );
    const querySnapshot = await getDocs(queryRef);

    const data = querySnapshot.docs.map((doc) => {
      const formattedDate = formatIndonesianDate(
        doc.data().tanggal_penerimaan.toDate()
      );
      return {
        id: doc.id,
        ...doc.data(),
        tanggal_penerimaan: formattedDate,
      };
    });

    return data as Penerimaan[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getPenerimaanByMonth = async (
  month: number,
  year: number
): Promise<Penerimaan[]> => {
  try {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1);

    const queryRef = query(
      collection(db, "penerimaan"),
      where("tanggal_penerimaan", ">=", startOfMonth),
      where("tanggal_penerimaan", "<", endOfMonth)
    );
    const querySnapshot = await getDocs(queryRef);

    const data = querySnapshot.docs.map((doc) => {
      const formattedDate = formatIndonesianDate(
        doc.data().tanggal_penerimaan.toDate()
      );
      return {
        id: doc.id,
        ...doc.data(),
        tanggal_penerimaan: formattedDate,
      };
    });

    return data as Penerimaan[];
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
};

export const getPenerimaanLen = async (): Promise<number> => {
  const coll = collection(db, "penerimaan");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const addPenerimaan = async (
  newPenerimaan: Partial<Penerimaan>
): Promise<string> => {
  try {
    const penerimaanRef = collection(db, "penerimaan");
    const allPenerimaan = await getPenerimaanLen();
    const addedPenerimaan = {
      ...newPenerimaan,
      index: allPenerimaan + 1,
    };
    if (addedPenerimaan.obat_id) {
      const obatRef = doc(db, "obat", addedPenerimaan?.obat_id);
      const obatDoc = await getDoc(obatRef);
      const currentStok = obatDoc?.data()?.stok ?? 0;
      const updatedStok = currentStok + addedPenerimaan.jumlah;
      await updateDoc(obatRef, { stok: updatedStok });
      await addDoc(penerimaanRef, addedPenerimaan);
    } else {
      throw Error("Obat tidak ditemukan");
    }
    return "success";
  } catch (error) {
    console.log("Error adding document:", error);
    return "failed";
  }
};

export const editPenerimaan = async (
  obatId: string,
  updatedData: Partial<Penerimaan>
): Promise<string> => {
  try {
    const penerimaanRef = doc(db, "penerimaan", obatId);
    await updateDoc(penerimaanRef, updatedData);
    return "success";
  } catch (error) {
    console.log("Error updating document:", error);
    return "failed";
  }
};

export const deletePenerimaan = async (
  penerimaanId: string
): Promise<string> => {
  try {
    const penerimaanRef = doc(db, "penerimaan", penerimaanId);
    await deleteDoc(penerimaanRef);
    return "success";
  } catch (error) {
    console.log("Error deleting document:", error);
    return "failed";
  }
};
