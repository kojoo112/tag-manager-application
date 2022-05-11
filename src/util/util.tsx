import { get, ref, set } from "firebase/database";
import { firebaseDB } from "../firebase/firebase";

export const getData = async (
  reference: string,
  isReturnKeys: boolean = true
) => {
  try {
    return await get(ref(firebaseDB, reference)).then((snapshot) => {
      if (snapshot.exists()) {
        if (isReturnKeys) {
          return snapshot.val();
        } else {
          return Object.keys(snapshot.val()).sort();
        }
      } else {
        console.error("database를 확인해주세요.");
      }
    });
  } catch (e) {
    console.error("util.tsx >>> getData >>> ", e);
  }
};

export const storeNewComponents = async (
  reference: string,
  components: object[]
) => {
  try {
    await set(ref(firebaseDB, reference), components);
  } catch (e) {
    console.error("util.tsx >>> storeNewComponents >>> ", e);
  }
};
