import React, { useState, SetStateAction, Dispatch } from "react";
import tape from "../assets/images/tape-play.gif";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { Trash3 } from "react-bootstrap-icons";
import { IPageObjectType } from "../util/interface";
import { IMAGE_VIEW, PASSWORD_TAG_VIEW, VIDEO_VIEW } from "../util/constants";

const showContent = (item: IPageObjectType) => {
  const value = item.component;
  if (value === IMAGE_VIEW) {
    return <img src={item.url} alt="" width={"50%"} />;
  } else if (value === "AudioView") {
    return (
      <div>
        <img src={tape} alt="" width={"50%"} />
        <audio style={{ width: "100%" }} controls={true} src={item.url} />
      </div>
    );
  } else if (value === VIDEO_VIEW) {
    return <video controls={true} width={"100%"} src={item.url}></video>;
  } else if (value === PASSWORD_TAG_VIEW) {
    return (
      <div>
        <>answer : {item.answer}</>
        <br />
        <>이동할 페이지 : {item.moveToPage?.split("/")[2]}</>
      </div>
    );
  }
  return;
};

// a little function to help us with reordering the result
const reorder = (
  list: IPageObjectType[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): object => ({
  overflowY: "scroll",
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): object => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "50%",
  position: "relative",
  height: "fit-content",
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

const PageList = (props: {
  pageList: IPageObjectType[];
  setPageList: Dispatch<SetStateAction<IPageObjectType[]>>;
}) => {
  const [placeholderProps, setPlaceholderProps] = useState({});
  const { pageList, setPageList } = props;
  const [isHover, setIsHover] = useState<boolean>(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    setPlaceholderProps({});

    setPageList((pageList: IPageObjectType[]) =>
      reorder(pageList, result.source.index, result.destination.index)
    );
  };

  const removeComponent = (item: number) => {
    const pageListArray = [...pageList];
    const removedPageList = pageListArray.filter((el, index) => {
      return index !== item;
    });
    if (removedPageList.length > 0) {
      setPageList(removedPageList);
    } else {
      alert("1개 이상은 존재해야 합니다.");
    }
  };

  const onDragUpdate = (update: any) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);
    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;

    //   const clientY =
    //     parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
    //     [...draggedDOM.parentNode.children]
    //       .slice(0, destinationIndex)
    //       .reduce((total, curr) => {
    //         const style = curr.currentStyle || window.getComputedStyle(curr);
    //         const marginBottom = parseFloat(style.marginBottom);
    //         return total + curr.clientHeight + marginBottom;
    //       }, 0);

    //   setPlaceholderProps({
    //     clientHeight,
    //     clientWidth,
    //     clientY,
    //     clientX: parseFloat(
    //       window.getComputedStyle(draggedDOM.parentNode).paddingLeft
    //     ),
    //   });
    // };
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {pageList &&
              pageList.map((item: IPageObjectType, index: number) => (
                <Draggable
                  key={`item${index}`}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <Trash3
                          size={30}
                          id={`trash-${index}`}
                          color={isHover ? "red" : "white"}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            removeComponent(index);
                          }}
                        />
                      </div>
                      <div>
                        <>View 종류 : {item.component}</>
                      </div>
                      <div>
                        <>{showContent(item)}</>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

            {provided.placeholder /** 필수요소 */}
            {/* <CustomPlaceholder snapshot={snapshot} /> */}
            <div
              style={{
                position: "absolute",
                // top: placeholderProps.clientY,
                // left: placeholderProps.clientX,
                // height: placeholderProps.clientHeight,
                background: "tomato",
                // width: placeholderProps.clientWidth,
              }}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PageList;
