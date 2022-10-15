import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import PageList from "../components/PageList";
import { getData, getItemList, setData, getMerchantList, getThemeList, addPage } from "../util/util";
import StorageItemList from "../components/StorageItemList";
import { INIT_DATA, MERCHANT_CHANGED, THEME_CHANGED, PAGE_CHANGED, PAGE_RELOAD } from "../util/constants";
import FormSelect from "../components/FormSelect";

const initialState = {
  merchantList: [""],
  themeList: [""],
  pageList: [""],
  merchantValue: "mrc001",
  themeValue: "thm001",
  pageValue: "page01",
};

const reducer = (state, action) => {
  switch (action.type) {
    case INIT_DATA:
      return { ...action.payload };
    case MERCHANT_CHANGED:
      return { ...action.payload };
    case THEME_CHANGED:
      return { ...action.payload };
    case PAGE_CHANGED:
      return { ...state, pageValue: action.payload };
    case PAGE_RELOAD:
      return { ...state, pageList: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [pageList, setPageList] = useState([]);
  const [viewName, setViewName] = useState({});
  const [isPasswordView, setIsPasswordView] = useState(false);
  const [isCameraView, setIsCameraView] = useState(false);
  const [originalPageList, setOriginalPageList] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [componentValue, setComponentValue] = useState("");
  const [moveToPageValue, setMoveToPageValue] = useState("");

  const inputRef = useRef(null);
  const cameraHeightInput = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const [storageItems, setStorageItems] = useState([]);

  const pageName = useRef();

  const formatItemList = (items) => {
    return items.map((element) => {
      return {
        prefix: `https://firebasestorage.googleapis.com/v0/b/xcape-hint-app.appspot.com/o/${state.merchantValue}%2F${state.themeValue}%2F${componentValue}%2F`,
        name: element.name,
        suffix: "?alt=media",
      };
    });
  };

  const storageData = () => {
    getItemList(`${state.merchantValue}/${state.themeValue}/${componentValue}`).then((res) => {
      if (res.items.length > 0) {
        const formattedItemList = formatItemList(res.items);
        setStorageItems(formattedItemList);
      } else {
        setStorageItems([]);
      }
    });
  };

  const getPageList = async (merchantCode, themeCode) => {
    return await getData(`/tagView/${merchantCode}/${themeCode}`, false);
  };

  const getTagList = async (merchantCode, themeCode, pageCode) => {
    return await getData(`/tagView/${merchantCode}/${themeCode}/${pageCode}/components`);
  };

  const getViewList = async () => {
    return await getData("/viewName");
  };

  const merchantChanged = async (merchantCode) => {
    const theme = await getThemeList(merchantCode);
    const page = await getPageList(merchantCode, "thm001");
    const tagList = await getTagList(merchantCode, "thm001", "page01");
    const data = {
      merchantList: state.merchantList,
      themeList: theme,
      pageList: page,
      merchantValue: merchantCode,
      themeValue: "thm001",
      pageValue: "page01",
    };
    setOriginalPageList(tagList);
    setPageList(tagList);
    dispatch({ type: MERCHANT_CHANGED, payload: data });
  };

  const themeChanged = async (themeCode) => {
    const pageList = await getPageList(state.merchantValue, themeCode);
    const tagList = await getTagList(state.merchantValue, themeCode, "page01");
    const data = {
      merchantList: state.merchantList,
      themeList: state.themeList,
      pageList: pageList,
      merchantValue: state.merchantValue,
      themeValue: themeCode,
      pageValue: "page01",
    };
    setOriginalPageList(tagList);
    setPageList(tagList);
    dispatch({ type: THEME_CHANGED, payload: data });
  };

  const pageReload = async () => {
    const pageList = await getPageList(state.merchantValue, state.themeValue);
    dispatch({ type: PAGE_RELOAD, payload: pageList });
  };

  const pageChanged = async (pageCode) => {
    const tagList = await getTagList(state.merchantValue, state.themeValue, pageCode);
    setOriginalPageList(tagList);
    setPageList(tagList);
    dispatch({ type: PAGE_CHANGED, payload: pageCode });
  };

  useEffect(() => {
    const initList = async () => {
      const merchant = await getMerchantList();
      const theme = await getThemeList("mrc001");
      const page = await getPageList("mrc001", "thm001");
      const tagList = await getTagList("mrc001", "thm001", "page01");

      const data = {
        merchantList: merchant,
        themeList: theme,
        pageList: page,
        merchantValue: "mrc001",
        themeValue: "thm001",
        pageValue: "page01",
      };
      setOriginalPageList(tagList);
      setPageList(tagList);
      dispatch({ type: INIT_DATA, payload: data });
      getViewList().then((res) => {
        setComponentValue(Object.keys(res)[0]);
        setViewName(res);
      });
    };
    initList();
  }, []);

  useEffect(() => {
    if (JSON.stringify(pageList) !== JSON.stringify(originalPageList)) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [pageList]);

  useEffect(() => {
    initializeItemList();
    storageData();
  }, [state.merchantValue, state.themeValue, componentValue]);

  const initializeInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const initializePageList = () => {
    setPageList(originalPageList);
  };

  const isInputEmpty = () => {
    if (inputRef.current) {
      const value = inputRef.current.value.replace(/(\s*)/gi, "");
      return value === "";
    }
  };

  const addPageList = () => {
    if (isPasswordView) {
      console.log("passwordView");
      if (isInputEmpty()) {
        alert("필수항목을 입력해주세요.");
        return;
      } else {
        if (inputRef.current) {
          const inputValue = inputRef.current.value.replace(/(\s*)/, "");
          const moveToPageUrl = `${state.merchantValue}/${state.themeValue}/`;
          const pageObject = {
            component: componentValue,
            answer: inputValue,
            moveToPage: moveToPageUrl + moveToPageValue,
          };
          const pageListArray = [...pageList];
          pageListArray.push(pageObject);
          setPageList(pageListArray);
        }
      }
    } else if (isCameraView) {
      let cameraHeight = cameraHeightInput.current.value;
      if (cameraHeightInput.current.value === "") {
        cameraHeight = 400;
      }
      const pageObject = {
        component: componentValue,
        height: cameraHeight,
      };
      const pageListArray = [...pageList];
      pageListArray.push(pageObject);
      setPageList(pageListArray);
    } else {
      const pageListArray = [...pageList, ...selectedItem];
      setPageList(pageListArray);
      initializeItemList();
    }
    setIsModified(true);
  };

  const saveComponent = () => {
    const isSave = window.confirm("저장 하시겠습니까?");
    if (isSave) {
      const ref = `/tagView/${state.merchantValue}/${state.themeValue}/${state.pageValue}/components`;
      setData(ref, pageList).then(() => {
        setIsModified(false);
        setOriginalPageList(pageList);
        alert("성공적으로 저장했습니다.");
      });
    }
  };

  const checkComponent = (value) => {
    if (value === "PasswordTagView") {
      setIsPasswordView(true);
      setIsCameraView(false);
    } else if (value === "CameraView") {
      setIsCameraView(true);
      setIsPasswordView(false);
    } else {
      setIsCameraView(false);
      setIsPasswordView(false);
    }
    setComponentValue(value);
  };

  const initializeItemList = () => {
    const itemList = document.getElementById("storageItemList");
    setSelectedItem([]);
    itemList?.childNodes.forEach((element) => {
      if (element.className === "selected-item") {
        element.className = "item";
      }
    });
  };

  const FormToAddPage = (
    <Popover>
      <Popover.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const page = pageName.current;
            const ref = `/tagView/${state.merchantValue}/${state.themeValue}`;

            getData(ref).then((result) => {
              console.log("reference result", result);
              console.log("pageName", pageName);
              if (!(page in result)) {
                addPage(ref, page).then(() => {
                  alert("페이지를 생성했습니다!");
                  return pageReload();
                });
              } else {
                alert("동일한 페이지가 존재합니다!");
              }
            });
          }}
        >
          <Form.Label>페이지 이름</Form.Label>
          <Form.Control
            placeholder="예) page01"
            onChange={(e) => {
              pageName.current = e.target.value;
            }}
            ref={pageName}
          ></Form.Control>
        </Form>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="box">
      <div
        style={{
          position: "sticky",
          top: 0,
          float: "left",
          width: "40%",
          height: "100%",
        }}
      >
        <Card className="bg-dark text-white text-center">
          <Card.Header>
            <Card.Title>X-KIT Manager</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className={"h-50"}>
              <FormSelect items={state.merchantList} label="가맹점" action={merchantChanged} />
              <FormSelect items={state.themeList} label="테마" action={themeChanged} />
              <FormSelect items={state.pageList} label="PAGE" action={pageChanged} id={"page"} />
              <FormSelect items={viewName} label="View 종류" action={checkComponent} />
              {isPasswordView ? (
                <>
                  <div>
                    <InputGroup style={styles.inputGroup}>
                      <Form.Label className="w-25" column={true} style={styles.label}>
                        Answer
                      </Form.Label>
                      <Form.Control className="w-50" ref={inputRef} type="text" style={styles.select}></Form.Control>
                    </InputGroup>
                  </div>
                  <FormSelect items={state.pageList} label={"이동 할 페이지"} action={setMoveToPageValue} />
                </>
              ) : (
                <></>
              )}
              {isCameraView ? (
                <>
                  <div>
                    <InputGroup style={{ ...styles.inputGroup }}>
                      <Form.Label className="w-25" column={true} style={styles.label}>
                        높이
                      </Form.Label>
                      <Form.Control
                        className="w-50"
                        ref={cameraHeightInput}
                        type="number"
                        style={styles.select}
                        defaultValue={400}
                      ></Form.Control>
                    </InputGroup>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div>
                <Button variant="light" onClick={addPageList} style={styles.button} disabled={false}>
                  +
                </Button>
                <Button variant="primary" onClick={saveComponent} style={styles.button} disabled={!isModified}>
                  저장
                </Button>
                <Button variant="danger" style={styles.button} onClick={initializePageList} disabled={!isModified}>
                  초기화
                </Button>
                <OverlayTrigger
                  trigger="click"
                  overlay={FormToAddPage}
                  placement="right"
                  defaultShow={undefined}
                  onHide={undefined}
                  onToggle={undefined}
                  popperConfig={undefined}
                  delay={undefined}
                  flip={undefined}
                  show={undefined}
                  target={undefined}
                >
                  <Button variant="primary">페이지 추가</Button>
                </OverlayTrigger>
              </div>
            </div>
            <div style={{ height: "100%", display: "flex", overflowX: "scroll" }}>
              <StorageItemList
                storageItems={storageItems}
                component={componentValue}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          width: "60%",
        }}
      >
        <PageList pageList={pageList} setPageList={setPageList} />
      </div>
    </div>
  );
};

export default Home;

const styles = {
  label: {
    color: "white",
    backgroundColor: "#212429",
    border: "1px solid white",
    borderRadius: 3,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    fontWeight: 700,
  },
  select: {
    backgroundColor: "#6c757e",
    color: "white",
    border: "2px solid white",
    borderRadius: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    fontWeight: 700,
  },
  inputGroup: {
    margin: 5,
  },
  button: {
    margin: 5,
  },
};
