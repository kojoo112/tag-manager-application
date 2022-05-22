import { get, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";
import { firebaseDB, firebaseStorage } from "../firebase/firebase";

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

export const imageRef = () => {
  return Storage.ref(firebaseStorage, "image.jpeg");
};

export const imagesRef = Storage.ref(firebaseStorage, "images");

export const getItemList = async (reference: string) => {
  return await Storage.list(Storage.ref(firebaseStorage, reference)).then(
    (res) => {
      return res;
    }
  );
};
