import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFileExtensionName, getItemList } from "../util/util";
import { IPageObjectType } from "../util/interface";
import tape from "../assets/images/tape-play.gif";
import { AUDIO_VIEW, IMAGE_VIEW, VIDEO_VIEW } from "../util/constants";

const StorageItemList = (props) => {
  const { storageItems, selectedItem, setSelectedItem } = props;

  const showContent = (item) => {
    const extension = item.name.split(".")[1];
    const extensionName = getFileExtensionName(extension);

    if (extensionName === IMAGE_VIEW) {
      return (
        <div style={styles.item}>
          <div>{item.name}</div>
          <img
            style={{ cursor: "pointer" }}
            width={"150px"}
            onClick={(e) => {
              selected(e);
            }}
            id={item.prefix + item.name + item.suffix}
            src={item.prefix + item.name + item.suffix}
            alt=""
          />
        </div>
      );
    } else if (extensionName === AUDIO_VIEW) {
      return (
        <div style={styles.item}>
          <div>{item.name}</div>
          <img
            style={{ cursor: "pointer", width: "300px" }}
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
          <div>{item.name}</div>
          <video
            id={item.prefix + item.name + item.suffix}
            onClick={(e) => {
              e.preventDefault();
              selected(e);
            }}
            style={{ cursor: "pointer" }}
            controls={true}
            height={"200px"}
            src={item.prefix + item.name + item.suffix}
          ></video>
        </div>
      );
    }
  };

  const addItem = (url) => {
    const pageObject = {
      component: props.component,
      url: url,
    };

    const itemListArray = [...selectedItem];
    itemListArray.push(pageObject);
    setSelectedItem(itemListArray);
  };

  const removeItem = (url) => {
    const itemListArray = [...selectedItem];
    const removedItemList = itemListArray.filter((element) => {
      return element.url !== url;
    });
    setSelectedItem(removedItemList);
  };

  const selected = (e) => {
    const divElement = e.currentTarget.parentElement?.parentElement;
    if (divElement) {
      if (divElement.className === "item") {
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
        storageItems.map((element, index) => (
          <div
            key={index}
            className={"item"}
            style={{
              padding: 10,
              height: "100%",
              display: "flex",
              alignItems: "center",
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
    height: "fit-content",
    padding: 5,
  },
};
