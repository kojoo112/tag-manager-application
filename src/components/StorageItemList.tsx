import React, { useEffect, useState } from "react";
import { getItemList, imageRef, imagesRef } from "../util/util";

interface IReference {
  bucket: string;
  fullPath: string;
  name: string;
  parent: IReference;
  root: IReference;
  // storage: string;
}
const prefix =
  "https://firebasestorage.googleapis.com/v0/b/xcape-hint-app.appspot.com/o/images%2F";
const suffix = "?alt=media";

const StorageItemList = () => {
  const [storageItems, setStorageItems] = useState<any>();

  useEffect(() => {
    getItemList().then((res) => {
      console.log(res);
      setStorageItems(res.items);
    });
  }, []);

  return (
    <div
      style={{
        color: "white",
        overflowY: "scroll",
        height: "30%",
        backgroundColor: "black",
        marginTop: 10,
        paddingTop: 10,
      }}
    >
      {storageItems &&
        storageItems.map((element: any, index: number) => {
          return (
            <div key={index}>
              <img width={200} src={prefix + element.name + suffix} />
              <div>{element.name}</div>
            </div>
          );
        })}
    </div>
  );
};

export default StorageItemList;
