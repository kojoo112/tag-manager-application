import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFileExtensionName, getItemList } from "../util/util";
import { IPageObjectType } from "../util/interface";
import tape from "../assets/images/tape-play.gif";
import { AUDIO_VIEW, IMAGE_VIEW, VIDEO_VIEW } from "../util/constants";

const StorageItemList = (props: {
  storageItems: any;
  setStorageItems: Dispatch<SetStateAction<any>>;
  initializeItemList: VoidFunction;
  component: string;
  merchant: string;
  theme: string;
  pageList: IPageObjectType[];
  setPageList: Dispatch<SetStateAction<IPageObjectType[]>>;
  selectedItem: IPageObjectType[];
  setSelectedItem: Dispatch<SetStateAction<IPageObjectType[]>>;
}) => {
  const { storageItems, selectedItem, setSelectedItem } = props;

  const showContent = (item: any) => {
    const extension = item.name.split(".")[1];
    const extensionName = getFileExtensionName(extension);

    if (extensionName === IMAGE_VIEW) {
      return (
        <div style={styles.item}>
          <img
            style={{ cursor: "pointer" }}
            height={"70%"}
            onClick={(e) => {
              selected(e);
            }}
            id={item.prefix + item.name + item.suffix}
            src={item.prefix + item.name + item.suffix}
          />
        </div>
      );
    } else if (extensionName === AUDIO_VIEW) {
      return (
        <div style={{ padding: 5 }}>
          <img
            style={{ cursor: "pointer" }}
            src={tape}
            alt=""
            onClick={(e) => {
              selected(e);
            }}
            id={item.prefix + item.name + item.suffix}
          />
          <audio
            style={{ width: "100%" }}
            controls={true}
            src={item.prefix + item.name + item.suffix}
          />
        </div>
      );
    } else if (extensionName === VIDEO_VIEW) {
      return (
        <div style={styles.item}>
          <video
            id={item.prefix + item.name + item.suffix}
            onClick={(e) => {
              selected(e);
            }}
            style={{ cursor: "pointer" }}
            // controls={true}
            height={"70%"}
            width={""}
            src={item.prefix + item.name + item.suffix}
          ></video>
        </div>
      );
    }
  };

  const addItem = (url: string) => {
    const pageObject: IPageObjectType = {
      component: props.component,
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

  const selected = (
    e: React.MouseEvent<HTMLImageElement | HTMLVideoElement>
  ) => {
    const divElement = e.currentTarget.parentElement?.parentElement;
    console.log(divElement);
    console.log("clicked");
    if (divElement) {
      if (divElement.className == "item") {
        divElement.className = "selected-item";
        addItem(e.currentTarget.id);
      } else {
        divElement.className = "item";
        removeItem(e.currentTarget.id);
      }
    }
  };

  return (
    <div
      style={{
        color: "white",
        backgroundColor: "#212529",
        display: "flex",
      }}
      id="storageItemList"
    >
      {storageItems &&
        storageItems.map((element: any, index: number) => (
          <div
            key={index}
            className={"item"}
            style={{
              padding: 10,
              height: "100%",
            }}
          >
            <>{showContent(element)}</>
          </div>
        ))}
    </div>
  );
};

export default StorageItemList;

const styles = {
  item: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
};
