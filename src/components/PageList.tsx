import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";

// a little function to help us with reordering the result
const reorder = (list: [], startIndex: number, endIndex: number) => {
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
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): object => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 500,
  position: "relative",
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

const PageList = (props: any) => {
  const [placeholderProps, setPlaceholderProps] = useState({});
  const { pageList, setPageList } = props;
  // const [items, setItems] = useState(getItems(10));

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setPlaceholderProps({});

    setPageList((pageList: []) =>
      reorder(pageList, result.source.index, result.destination.index)
    );
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
            {pageList.map(
              (
                item: {
                  component: string;
                  url: string;
                },
                index: number
              ) => (
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
                      <label>index: {index}</label>
                      <br />

                      <br />
                      <>component: {item.component}</>
                      <div>
                        <img src={item.url} alt="" height="200" />
                        <br />
                        <>url: {item.url}</>
                      </div>
                    </div>
                  )}
                </Draggable>
              )
            )}

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
