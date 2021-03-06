import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import PageList from "../components/PageList";
import SearchContainer from "../components/SearchContainer";
import {
  getData,
  getItemList,
  setData,
  getMerchantList,
  getThemeList,
} from "../util/util";
import StorageItemList from "../components/StorageItemList";
import {
  INIT_DATA,
  MERCHANT_CHANGED,
  THEME_CHANGED,
  PAGE_CHANGED,
} from "../util/constants";
import { IState, IAction, IPageObjectType, IItemList } from "../util/interface";

const initialState = {
  merchantList: [""],
  themeList: [""],
  pageList: [""],
  merchantValue: "mrc001",
  themeValue: "thm001",
  pageValue: "page01",
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case INIT_DATA:
      return { ...action.payload };
    case MERCHANT_CHANGED:
      return { ...action.payload };
    case THEME_CHANGED:
      return { ...action.payload };
    case PAGE_CHANGED:
      return { ...state, pageValue: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [pageList, setPageList] = useState<IPageObjectType[]>([]);
  const [viewName, setViewName] = useState<object>({});
  const [isPasswordView, setIsPasswordView] = useState<boolean>(false);
  const [isCameraView, setIsCameraView] = useState<boolean>(false);
  const [originalPageList, setOriginalPageList] = useState<IPageObjectType[]>(
    []
  );
  const [isModified, setIsModified] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IPageObjectType[]>([]);
  const [componentValue, setComponentValue] = useState<string>("");

  const componentRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const moveToPageRef = useRef<HTMLSelectElement>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [storageItems, setStorageItems] = useState<any[]>();

  const formatItemList = (items: any[]) => {
    let itemListObjectArray: IItemList[];
    return (itemListObjectArray = items.map((element) => {
      return {
        prefix: `https://firebasestorage.googleapis.com/v0/b/xcape-hint-app.appspot.com/o/${state.merchantValue}%2F${state.themeValue}%2F${componentValue}%2F`,
        name: element.name,
        suffix: "?alt=media",
      };
    }));
  };

  const setStorageData = () => {
    getItemList(
      `${state.merchantValue}/${state.themeValue}/${componentValue}`
    ).then((res) => {
      if (res.items.length > 0) {
        const formattedItemList = formatItemList(res.items);
        setStorageItems(formattedItemList);
      } else {
        setStorageItems([]);
      }
    });
  };

  const getPageList = async (
    merchantCode: string,
    themeCode: string
  ): Promise<any> => {
    return await getData(`/tagView/${merchantCode}/${themeCode}`, false);
  };

  const getTagList = async (
    merchantCode: string,
    themeCode: string,
    pageCode: string
  ): Promise<any> => {
    return await getData(
      `/tagView/${merchantCode}/${themeCode}/${pageCode}/components`
    );
  };

  const getViewList = async () => {
    return await getData("/viewName");
  };

  const merchantChanged = async (merchantCode: string): Promise<any> => {
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

  const themeChanged = async (themeCode: string): Promise<any> => {
    const page = await getPageList(state.merchantValue, themeCode);
    const tagList = await getTagList(state.merchantValue, themeCode, "page01");
    const data = {
      merchantList: state.merchantList,
      themeList: state.themeList,
      pageList: page,
      merchantValue: state.merchantValue,
      themeValue: themeCode,
      pageValue: "page01",
    };
    setOriginalPageList(tagList);
    setPageList(tagList);
    dispatch({ type: THEME_CHANGED, payload: data });
  };

  const pageChanged = async (pageCode: string) => {
    const page = pageCode;
    const tagList = await getTagList(
      state.merchantValue,
      state.themeValue,
      pageCode
    );
    setOriginalPageList(tagList);
    setPageList(tagList);
    dispatch({ type: PAGE_CHANGED, payload: page });
  };

  useEffect(() => {
    const initList = async (): Promise<void> => {
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
    if (JSON.stringify(pageList) != JSON.stringify(originalPageList)) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [pageList]);

  useEffect(() => {
    initializeItemList();
    setStorageData();
  }, [state.merchantValue, state.themeValue, componentValue]);

  const initializeInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const initializePageList = () => {
    setPageList(originalPageList);
  };

  const isInputEmpty = (): boolean => {
    if (inputRef.current) {
      const value = inputRef.current.value.replace(/(\s*)/gi, "");
      if (value === "") {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

  const addPageList = () => {
    if (isPasswordView) {
      if (isInputEmpty()) {
        alert("??????????????? ??????????????????.");
        return;
      } else {
        if (componentRef.current && inputRef.current && moveToPageRef.current) {
          const inputValue = inputRef.current.value.replace(/(\s*)/, "");
          const moveToPageUrl = `${state.merchantValue}/${state.themeValue}/`;
          const pageObject: IPageObjectType = {
            component: componentRef.current.value,
            answer: inputValue,
            moveToPage: moveToPageUrl + moveToPageRef.current.value,
          };
          const pageListArray = [...pageList];
          pageListArray.push(pageObject);
          setPageList(pageListArray);
        }
      }
    } else if (isCameraView) {
      if (componentRef.current) {
        const pageObject: IPageObjectType = {
          component: componentRef.current.value,
        };
        const pageListArray = [...pageList];
        pageListArray.push(pageObject);
        setPageList(pageListArray);
      }
    } else {
      const pageListArray: IPageObjectType[] = [...pageList, ...selectedItem];
      setPageList(pageListArray);
      initializeItemList();
    }
    setIsModified(true);
  };

  const saveComponent = () => {
    const isSave = window.confirm("?????? ???????????????????");
    if (isSave) {
      const ref = `/tagView/${state.merchantValue}/${state.themeValue}/${state.pageValue}/components`;
      setData(ref, pageList).then(() => {
        setIsModified(false);
        setOriginalPageList(pageList);
        alert("??????????????? ??????????????????.");
      });
    } else {
      return;
    }
  };

  const checkCompoent = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
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
    itemList?.childNodes.forEach((element: any) => {
      if (element.className === "selected-item") {
        element.className = "item";
      }
    });
  };

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
            <div style={{ height: "50%" }}>
              <SearchContainer
                state={state}
                merchantChanged={merchantChanged}
                themeChanged={themeChanged}
                pageChanged={pageChanged}
              />
              <div className="w-100" style={styles.inputGroup}>
                <InputGroup
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    View ??????
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => checkCompoent(e)}
                    className="w-50"
                    style={styles.select}
                    ref={componentRef}
                    id="component"
                  >
                    {viewName &&
                      Object.entries(viewName).map(
                        (element: any, index: number): any => {
                          return (
                            <option
                              label={element[1]}
                              value={element[0]}
                              key={index}
                            ></option>
                          );
                        }
                      )}
                  </Form.Select>
                </InputGroup>
              </div>
              {isPasswordView ? (
                <div>
                  <div>
                    <InputGroup style={styles.inputGroup}>
                      <Form.Label
                        className="w-25"
                        column={true}
                        style={styles.label}
                      >
                        Answer
                      </Form.Label>
                      <Form.Control
                        className="w-50"
                        ref={inputRef}
                        type="text"
                        style={styles.select}
                      ></Form.Control>
                    </InputGroup>
                  </div>
                  <div>
                    <InputGroup style={styles.inputGroup}>
                      <Form.Label
                        className="w-25"
                        column={true}
                        style={styles.label}
                      >
                        ????????? ?????????
                      </Form.Label>
                      <Form.Select
                        className="w-50"
                        style={styles.select}
                        ref={moveToPageRef}
                        disabled={isPasswordView ? false : true}
                      >
                        {state.pageList.map((value, index) => {
                          return (
                            <option
                              label={value}
                              value={value}
                              key={index}
                            ></option>
                          );
                        })}
                      </Form.Select>
                    </InputGroup>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div>
                <Button
                  onClick={addPageList}
                  variant="light"
                  style={styles.button}
                >
                  +
                </Button>
                <Button
                  onClick={saveComponent}
                  style={styles.button}
                  disabled={isModified ? false : true}
                >
                  ??????
                </Button>
                <Button
                  variant="danger"
                  style={styles.button}
                  onClick={initializePageList}
                  disabled={isModified ? false : true}
                >
                  ?????????
                </Button>
              </div>
            </div>
            <div
              style={{ height: "100%", display: "flex", overflowX: "scroll" }}
            >
              {componentRef.current && (
                <StorageItemList
                  storageItems={storageItems}
                  setStorageItems={setStorageItems}
                  initializeItemList={initializeItemList}
                  component={componentValue}
                  merchant={state.merchantValue}
                  theme={state.themeValue}
                  pageList={pageList}
                  setPageList={setPageList}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}
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
          // height: "100%",
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
  asdf: {},
};
