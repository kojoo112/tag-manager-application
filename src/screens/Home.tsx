import { useEffect, useReducer, useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import PageList from "../components/PageList";
import SearchContainer from "../components/SearchContainer";
import { getData, storeNewComponents } from "../util/util";
import {
  INIT_DATA,
  MERCHANT_CHANGED,
  THEME_CHANGED,
  PAGE_CHANGED,
} from "../util/constants";

const initialState = {
  merchantList: [""],
  themeList: [""],
  pageList: [""],
  merchantValue: "mrc001",
  themeValue: "thm001",
  pageValue: "page01",
};

interface IPageObjectType {
  component: string;
  url: string;
  answer?: string;
}

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
      // console.log({ ...action.payload });
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
  url: string;
  answer?: string;
}

const Home = () => {
  const [pageList, setPageList] = useState<IPageObjectType[]>([]);

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
      setPageList(tagList);
      dispatch({ type: INIT_DATA, payload: data });
    };
    initList();
  }, []);

  const component = useRef<HTMLSelectElement>(null);
  const url = useRef<HTMLInputElement>(null);
  const keys = useRef<number>();

  const initializeInput = () => {
    if (url.current) {
      url.current.value = "";
    }
  };

  const addPageList = () => {
    if (component.current && url.current) {
      const pageObject: IPageObjectType = {
        component: component.current.value,
        url: url.current.value,
      };
      const pageListArray: IPageObjectType[] = [...pageList];
      pageListArray.push(pageObject);
      setPageList(pageListArray);
      initializeInput();
    }
  };

  const addComponent = () => {
    if (pageList.length > 0) {
      const ref = `/tagView/${state.merchantValue}/${state.themeValue}/${state.pageValue}/components`;
      storeNewComponents(ref, pageList).then(() => {
        alert("성공적으로 저장했습니다.");
      });
    } else {
      alert("추가할 컴포넌트가 없습니다.");
    }
  };

  return (
    <div className="box" style={{ textAlign: "center" }}>
      <SearchContainer
        state={state}
        merchantChanged={merchantChanged}
        themeChanged={themeChanged}
        pageChanged={pageChanged}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <InputGroup
          className="w-25"
          style={{
            alignItems: "center",
            margin: "10px",
          }}
        >
          <Form.Label className="w-25" column={true} style={styles.label}>
            종류
          </Form.Label>
          <Form.Select className="w-25" ref={component} style={styles.select}>
            <option value="ImageView" label="이미지"></option>
            <option value="AudioView" label="오디오"></option>
            <option value="VideoView" label="비디오"></option>
          </Form.Select>
        </InputGroup>
        <InputGroup
          className="w-25"
          style={{
            alignItems: "center",
            margin: 10,
          }}
        >
          <Form.Label className="w-25" column={true} style={styles.label}>
            URL
          </Form.Label>
          <Form.Control
            ref={url}
            type="text"
            style={styles.select}
          ></Form.Control>
        </InputGroup>
      </div>
      <div>
        <Button
          onClick={addPageList}
          variant="light"
          style={{ marginRight: 10 }}
        >
          +
        </Button>
        <Button onClick={addComponent}>저장</Button>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PageList key={keys} pageList={pageList} setPageList={setPageList} />
        </div>
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
  },
  select: {
    backgroundColor: "#6c757e",
    color: "white",
    border: "2px solid white",
    borderRadius: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
};
