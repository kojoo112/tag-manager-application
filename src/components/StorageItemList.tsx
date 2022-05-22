import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getItemList } from "../util/util";
import { IPageObjectType } from "../util/interface";
import tape from "../assets/images/tape-play.gif";

const StorageItemList = (props: {
  initializeItemList: VoidFunction;
  component: string;
  merchant: string;
  theme: string;
  pageList: IPageObjectType[];
  setPageList: Dispatch<SetStateAction<IPageObjectType[]>>;
  selectedItem: IPageObjectType[];
  setSelectedItem: Dispatch<SetStateAction<IPageObjectType[]>>;
}) => {
  const { initializeItemList, merchant, theme, selectedItem, setSelectedItem } =
    props;

  const [storageItems, setStorageItems] = useState<any[]>();

  const prefix = `https://firebasestorage.googleapis.com/v0/b/xcape-hint-app.appspot.com/o/${merchant}%2F${theme}%2F${props.component}%2F`;
  const suffix = "?alt=media";

  const showContent = (item: any) => {
    if (props.component === "ImageView") {
      return (
        <img
          style={{ cursor: "pointer" }}
          width={150}
          onClick={(e) => {
            selected(e);
          }}
          src={prefix + item.name + suffix}
        />
      );
    } else if (props.component === "AudioView") {
      return (
        <div>
          <img src={tape} alt="" width={150} />
          <audio
            style={{ width: "100%" }}
            controls={true}
            src={prefix + item.name + suffix}
          />
        </div>
      );
    } else if (props.component === "VideoView") {
      return (
        <video
          controls={true}
          width={150}
          src={prefix + item.name + suffix}
        ></video>
      );
    }
  };

  useEffect(() => {
    initializeItemList();
    if (
      props.component === "ImageView" ||
      props.component === "AudioView" ||
      props.component === "VideoView"
    ) {
      getItemList(`${merchant}/${theme}/${props.component}`).then((res) => {
        if (res.items.length > 0) {
          setStorageItems(res.items);
        } else {
          setStorageItems((storageItems) => []);
        }
      });
    } else {
      setStorageItems([]);
    }
  }, [merchant, theme, props.component]);

  const addItem = (url: string) => {
    const pageObject: IPageObjectType = {
      component: "ImageView",
      url: url,
    };

    const itemListArray: IPageObjectType[] = [...selectedItem];
    itemListArray.push(pageObject);
    setSelectedItem(itemListArray);
  };

  const removeItem = (url: string) => {
    const itemListArray = [...selectedItem];
    const removedItemList = itemListArray.filter((element) => {
      return element.url !== url;
    });

    setSelectedItem(removedItemList);
  };

  const selected = (e: React.MouseEvent<HTMLImageElement | null>) => {
    const divElement = e.currentTarget.parentElement;
    if (divElement) {
      if (divElement.className == "item") {
        divElement.className = "selected-item";
        addItem(e.currentTarget.src);
      } else {
        divElement.className = "item";
        removeItem(e.currentTarget.src);
      }
    }
  };

  return (
    <div
      style={{
        color: "white",
        backgroundColor: "black",
        height: "100%",
      }}
      id="storageItemList"
    >
      {storageItems &&
        storageItems.map((element: any, index: number) => (
          <div key={index} className={"item"} style={{ padding: 10 }}>
            <>{showContent(element)}</>
          </div>
        ))}
    </div>
  );
};

export default StorageItemList;
