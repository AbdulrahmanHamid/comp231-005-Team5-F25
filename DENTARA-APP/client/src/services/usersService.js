import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const listenToDoctors = (callback) => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "doctor")
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      fullName: d.data().firstName + " " + d.data().lastName
    }));
    callback(list);
  });
};
