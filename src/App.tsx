import { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageList from "./components/PageList";
import { getData, storeNewComponents } from "./util/util";
import { Button, Form, InputGroup } from "react-bootstrap";

const App = () => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageList, setPageList] = useState<PageObjectType[]>([]);
  const [index, setIndex] = useState<number>(0);

  const component = useRef<HTMLSelectElement>(null);
  const url = useRef<HTMLInputElement>(null);
  const keys = useRef<number>();

  interface PageObjectType {
    index: number;
    component: string;
    url: string;
    answer?: string;
  }

  const formatNumber = (number: number) => {
    if (number < 10) {
      return `page0${number}`;
    } else {
      return `page${number}`;
    }
  };
  const initializeInput = () => {
    if (url.current) {
      url.current.value = "";
    }
  };

  const addPageList = () => {
    if (component.current && url.current) {
      const pageObject: PageObjectType = {
        index: index,
        component: component.current.value,
        url: url.current.value,
      };
      console.log(pageObject);

      const pageListArray: PageObjectType[] = [...pageList];
      pageListArray.push(pageObject);
      setPageList(pageListArray);
      setIndex(index + 1);
      initializeInput();
    }
  };

  const addComponent = () => {
    if (pageList.length > 0) {
      const pageIndex = formatNumber(pageNumber);
      storeNewComponents(`/mrc003/thm003/${pageIndex}/components/`, pageList);
      setPageNumber(pageNumber + 1);
      alert("저장 되었습니다.");
    } else {
      alert("추가할 컴포넌트가 없습니다.");
    }
  };

  useEffect(() => {
    getData("/hintImage/mrc003/thm003", (snapshot) => {
      setPageNumber(snapshot.size);
    });
  }, []);

  return (
    <div className="App">
      <div className="box" style={{ textAlign: "center" }}>
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
            <PageList
              index={index}
              key={keys}
              pageList={pageList}
              setPageList={setPageList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
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

export default App;
