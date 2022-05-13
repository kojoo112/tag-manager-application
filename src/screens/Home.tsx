import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Nav } from "react-bootstrap";
import PageList from "../components/PageList";
import SearchContainer from "../components/SearchContainer";
import { getData, storeNewComponents } from "../util/util";
import {
  INIT_DATA,
  MERCHANT_CHANGED,
  THEME_CHANGED,
  PAGE_CHANGED,
} from "../util/constants";
import InputForm from "../components/InputForm";

const initialState = {
  merchantList: [""],
  themeList: [""],
  pageList: [""],
  merchantValue: "mrc001",
  themeValue: "thm001",
  pageValue: "page01",
};

interface IState {
  merchantList: string[];
  themeList: string[];
  pageList: string[];
  merchantValue: string;
  themeValue: string;
  pageValue: string;
}

interface IAction {
  type: string;
  payload: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case INIT_DATA:
      return { ...action.payload };
    case MERCHANT_CHANGED:
      console.log(action.payload);
      return { ...action.payload };
    case THEME_CHANGED:
      return { ...action.payload };
    case PAGE_CHANGED:
      return { ...state, pageValue: action.payload };
    default:
      return state;
  }
};

interface IPageObjectType {
  component: string;
  url?: string;
  answer?: string;
}

const Home = () => {
  const [pageList, setPageList] = useState<IPageObjectType[]>([]);
  const [viewName, setViewName] = useState<object>({});
  const [isPasswordView, setIsPasswordView] = useState<boolean>(false);
  const [originalPageList, setOriginalPageList] = useState<IPageObjectType[]>(
    []
  );
  const [isModified, setIsModified] = useState<boolean>(false);

  const componentRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getMerchantList = async (): Promise<any> => {
    return await getData("/merchants");
  };

  const getThemeList = async (merchantCode: string): Promise<any> => {
    return await getData(`/themes/${merchantCode}`);
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
      getViewList().then((res) => setViewName(res));
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
    if (componentRef.current && inputRef.current && !isInputEmpty()) {
      let pageObject: IPageObjectType;
      const inputValue = inputRef.current.value.replace(/(\s*)/, "");
      if (isPasswordView) {
        pageObject = {
          component: componentRef.current.value,
          answer: inputValue,
        };
      } else {
        pageObject = {
          component: componentRef.current.value,
          url: inputValue,
        };
      }
      const pageListArray: IPageObjectType[] = [...pageList];
      pageListArray.push(pageObject);
      setPageList(pageListArray);
      initializeInput();
    } else {
      alert("필수항목을 입력해주세요.");
    }
  };

  const saveComponent = () => {
    const isSave = window.confirm("저장 하시겠습니까?");
    if (isSave) {
      const ref = `/tagView/${state.merchantValue}/${state.themeValue}/${state.pageValue}/components`;
      storeNewComponents(ref, pageList).then(() => {
        setIsModified(false);
        alert("성공적으로 저장했습니다.");
      });
    } else {
      return;
    }
  };

  const checkCompoent = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    inputRef.current!.value = "";
    if (value === "PasswordTagView") {
      setIsPasswordView(true);
    } else {
      setIsPasswordView(false);
    }
  };

  return (
    <div className="box">
      <div style={{ ...styles.card, float: "left" }} className="w-25">
        <Card className="bg-dark text-white w-100 text-center h-100">
          <Card.Header>
            <Card.Title>X-KIT Manager</Card.Title>
          </Card.Header>
          <Card.Body>
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
                <Form.Label className="w-25" column={true} style={styles.label}>
                  종류
                </Form.Label>
                <Form.Select
                  onChange={(e) => checkCompoent(e)}
                  className="w-50"
                  style={styles.select}
                  ref={componentRef}
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
            <div>
              <InputGroup style={styles.inputGroup}>
                <Form.Label className="w-25" column={true} style={styles.label}>
                  {isPasswordView ? "Answer" : "URL"}
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
                저장
              </Button>
              <Button
                variant="danger"
                style={styles.button}
                onClick={initializePageList}
                disabled={isModified ? false : true}
              >
                초기화
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          overflowY: "scroll",
          height: "100vh",
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
  card: {
    display: "fixed",
    height: "100vh",
    minHeight: 500,
  },
  inputGroup: {
    margin: 5,
  },
  button: {
    margin: 5,
  },
};
