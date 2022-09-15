import { get, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";
import { firebaseDB, firebaseStorage } from "../firebase/firebase";
import {
  AUDIO,
  AUDIO_VIEW,
  IMAGE,
  IMAGE_VIEW,
  VIDEO,
  VIDEO_VIEW,
} from "./constants";

export const getData = async (reference, isReturnKeys = true) => {
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

export const setData = async (reference, data) => {
  try {
    await set(ref(firebaseDB, reference), data);
  } catch (e) {
    console.error("util.tsx >>> storeNewComponents >>> ", e);
  }
};

export const imagesRef = Storage.ref(firebaseStorage, "images");

export const getItemList = async (reference) => {
  return await Storage.listAll(Storage.ref(firebaseStorage, reference)).then(
    (res) => {
      return res;
    }
  );
};

export const getFileExtensionName = (extension) => {
  if (IMAGE.includes(extension)) {
    return IMAGE_VIEW;
  } else if (AUDIO.includes(extension)) {
    return AUDIO_VIEW;
  } else if (VIDEO.includes(extension)) {
    return VIDEO_VIEW;
  }
  return "";
};

export const getMerchantList = async () => {
  return await getData("/merchants");
};

export const getThemeList = async (merchantCode) => {
  return await getData(`/themes/${merchantCode}`);
};

export const addPage = async (reference, pageName) => {
  try {
    await set(ref(firebaseDB, reference + `/${pageName}`), { dummy: pageName });
  } catch (e) {
    console.error("util.tsx >>> addPage >>> ", e);
  }
};
