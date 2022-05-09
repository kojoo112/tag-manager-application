import { firebaseDB } from "../firebase/firebase";
import { onValue, ref, set } from "firebase/database";

export const getData = (
  reference: string,
  callback: (snapshot: any) => void
) => {
  const refer = ref(firebaseDB, reference);
  onValue(refer, (snapshot: any) => callback(snapshot));
};

export const storeNewComponents = (reference: string, components: object) => {
  set(ref(firebaseDB, `/hintImage${reference}`), components);
};
