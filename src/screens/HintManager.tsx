import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import { INIT_DATA, MERCHANT_CHANGED, THEME_CHANGED } from "../util/constants";
import { IAction } from "../util/interface";
import { getData, getMerchantList, getThemeList, setData } from "../util/util";

const initialState = {
  merchantList: [],
  themeList: [],
  merchantValue: "",
  themeValue: "",
  hintList: [],
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case INIT_DATA:
      return { ...action.payload };
    case MERCHANT_CHANGED:
      return { ...action.payload };
    case THEME_CHANGED:
      return { ...action.payload };
    default:
      return state;
  }
};

interface IHint {
  key: string;
  message1: string;
  message2: string;
  createTime?: object;
  seq?: string;
  use?: boolean;
}

interface IState {
  merchantList: string[];
  themeList: string[];
  merchantValue: string;
  themeValue: string;
  hintList: IHint[];
}

const HintManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hintList, setHintList] = useState<IHint[]>();
  const [code, setCode] = useState<string>();
  const [message1, setMessage1] = useState<string>("");
  const [message2, setMessage2] = useState<string>("");
  const [seq, setSeq] = useState<number>();

  const message1Ref = useRef<HTMLInputElement>(null);
  const message2Ref = useRef<HTMLInputElement>(null);

  const merchantChanged = async (merchantCode: string) => {
    const theme = await getThemeList(merchantCode);
    const hintList = await getHintList(merchantCode, Object.keys(theme)[0]);
    const data = {
      merchantList: state.merchantList,
      themeList: theme,
      merchantValue: merchantCode,
      themeValue: Object.keys(theme)[0],
      hintList: hintList,
    };
    dispatch({ type: MERCHANT_CHANGED, payload: data });
  };

  const themeChanged = async (themeCode: string) => {
    const hintList = await getHintList(state.merchantValue, themeCode);
    const data = {
      merchantList: state.merchantList,
      themeList: state.themeList,
      merchantValue: state.merchantValue,
      themeValue: themeCode,
      hintList: hintList,
    };
    console.log(themeCode);
    dispatch({ type: THEME_CHANGED, payload: data });
  };

  const getHintList = async (
    merchantCode: string,
    themeCode: string
  ): Promise<IHint[]> => {
    const hintList = await getData(`/hintCode/${merchantCode}/${themeCode}`);
    setHintList(hintList);
    return hintList;
  };

  const validateHintCode = (hintCode: any) => {
    if (hintCode !== null) {
      hintCode = hintCode.toUpperCase();
      const hintRegExp = new RegExp("[A-Z]{3}[\\d]{2}", "g");
      const isValidate = hintRegExp.test(hintCode);
      if (isValidate) {
        if (hintList !== undefined) {
          if (hintList[hintCode] !== undefined) {
            alert("중복된 힌트코드입니다.");
            return false;
          } else {
            return true;
          }
        } else {
          alert("올바른 힌트코드 형식이 아닙니다.");
          return false;
        }
      }
    }
  };

  const modifyHintCode = async (e: any) => {
    let newHintCode = prompt(
      "변경할 힌트코드를 입력해주세요.",
      "영문 3글자, 숫자 2글자 형식입니다."
    );
    if (newHintCode != null) {
      if (validateHintCode(newHintCode)) {
        newHintCode = newHintCode.toUpperCase();
        const hintCode = e.currentTarget.childNodes[0].nodeValue;

        const originalHintList: IHint[] = { ...state.hintList };
        const temp = originalHintList[hintCode];

        const newHint = { [newHintCode]: { ...temp, key: newHintCode } };
        delete originalHintList[hintCode];
        const newHintList: IHint[] = Object.assign(newHint, originalHintList);

        await setData(
          `/hintCode/${state.merchantValue}/${state.themeValue}`,
          newHintList
        );

        setHintList(newHintList);
      }
    }
  };

  const modifyHintMessage = async (message: string, key: any) => {
    let newMessage = prompt("변경할 메세지를 입력해주세요. 💻");
    if (newMessage !== null) {
      if (hintList !== undefined) {
        hintList[key] = { ...hintList[key], [message]: newMessage };
        await setData(
          `/hintCode/${state.merchantValue}/${state.themeValue}/${key}`,
          {
            ...hintList[key],
          }
        );
        setHintList({ ...hintList });
      }
    }
  };

  const mouseOver = (e: any) => {
    e.target.style = "border: 2px solid white; cursor: pointer";
  };

  const mouseOut = (e: any) => {
    e.target.style = "";
  };

  const createRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";

    let result = "";

    for (let i = 0; i < 3; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    for (let i = 0; i < 2; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return result.toUpperCase();
  };

  const initializeInput = () => {
    setCode((code) => createRandomCode());
    setMessage1((message1) => "");
    setMessage2((message2) => "");

    if (message1Ref.current != null && message2Ref.current !== null) {
      message1Ref.current.value = "";
      message2Ref.current.value = "";
    }
  };

  const addHint = async () => {
    if (
      code !== undefined &&
      message1 !== undefined &&
      message1 !== "" &&
      message2 !== undefined &&
      message2 !== ""
    ) {
      if (state.hintList !== undefined && validateHintCode(code)) {
        const newHint = {
          [code]: {
            createTime: {
              value: {
                _seconds: Math.floor(+new Date() / 1000),
              },
              __datatype__: "timestamp",
            },
            key: code,
            message1: message1,
            message2: message2,
            seq: (Object.keys(state.hintList).length + 1).toString(),
            use: true,
          },
        };

        const addedHintList = Object.assign({ ...newHint, ...hintList });

        await setData(`/hintCode/${state.merchantValue}/${state.themeValue}`, {
          ...addedHintList,
        });
        setHintList(addedHintList);
        initializeInput();
        alert("추가되었습니다.");
      }
    } else {
      alert("필수요소를 입력해주세요.");
      return;
    }
  };

  const onChange = (e: any, setState: any) => {
    setState(e.target.value);
  };

  useEffect(() => {
    const initList = async () => {
      const merchantList = await getMerchantList();
      const merchantValue = Object.keys(merchantList)[0];
      const themeList = await getThemeList(merchantValue);
      const themeValue = Object.keys(themeList)[0];
      const hintList = await getHintList(merchantValue, themeValue);
      const data = {
        merchantList: merchantList,
        themeList: themeList,
        merchantValue: merchantValue,
        themeValue: themeValue,
        hintList: hintList,
      };
      setCode(createRandomCode);
      dispatch({ type: INIT_DATA, payload: data });
    };

    initList();
  }, []);

  return (
    <>
      <Card className="bg-dark text-white text-center">
        <Card.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div style={{ width: "80%" }}>
              <div style={{ display: "flex" }}>
                <InputGroup style={styles.inputGroup}>
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    가맹점
                  </Form.Label>
                  <Form.Select
                    className="w-50"
                    value={state.merchantValue}
                    onChange={(e) => {
                      merchantChanged(e.target.value);
                    }}
                    style={styles.select}
                  >
                    {Object.entries(state.merchantList).map(
                      (element: any, index: number) => {
                        return (
                          <option
                            key={index}
                            label={element[1]}
                            value={element[0]}
                          ></option>
                        );
                      }
                    )}
                  </Form.Select>
                </InputGroup>

                <InputGroup style={styles.inputGroup}>
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    테마
                  </Form.Label>
                  <Form.Select
                    className="w-50"
                    value={state.themeValue}
                    onChange={(e) => themeChanged(e.target.value)}
                    style={styles.select}
                  >
                    {Object.entries(state.themeList).map(
                      (element: any, index: number) => {
                        return (
                          <option
                            key={index}
                            label={element[1]}
                            value={element[0]}
                          ></option>
                        );
                      }
                    )}
                  </Form.Select>
                </InputGroup>
                <InputGroup style={styles.inputGroup}>
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    코드
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="w-50"
                    id="code"
                    style={styles.select}
                    maxLength={5}
                    defaultValue={code}
                    onChange={(e) => onChange(e, setCode)}
                  ></Form.Control>
                </InputGroup>
              </div>
              <div style={{ display: "flex" }}>
                <InputGroup style={styles.inputGroup}>
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    메세지1
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="w-50"
                    id="message1"
                    ref={message1Ref}
                    style={styles.select}
                    onChange={(e) => onChange(e, setMessage1)}
                  ></Form.Control>
                </InputGroup>
                <InputGroup style={styles.inputGroup}>
                  <Form.Label
                    className="w-25"
                    column={true}
                    style={styles.label}
                  >
                    메세지2
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="w-50"
                    id="message2"
                    ref={message2Ref}
                    style={styles.select}
                    onChange={(e) => onChange(e, setMessage2)}
                  ></Form.Control>
                </InputGroup>
              </div>
            </div>
            <div style={{ width: "8%" }}>
              <Button
                variant="primary"
                onClick={addHint}
                style={{ width: "100%" }}
              >
                저장
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Table variant="dark" striped bordered hover size="md">
        <thead>
          <tr>
            <th>#</th>
            <th>코드</th>
            <th>메세지1</th>
            <th>메세지2</th>
          </tr>
        </thead>
        <tbody>
          {hintList &&
            Object.entries(hintList)
              .filter((element) => {
                if (element[1].use) {
                  return element;
                }
              })
              .map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="index">{index + 1}</td>
                    <td
                      onClick={(e) => {
                        modifyHintCode(e);
                      }}
                      onMouseOver={(e) => mouseOver(e)}
                      onMouseOut={(e) => mouseOut(e)}
                    >
                      {element[0]}
                    </td>
                    <td
                      onClick={() => modifyHintMessage("message1", element[0])}
                      onMouseOver={(e) => mouseOver(e)}
                      onMouseOut={(e) => mouseOut(e)}
                      style={{ cursor: "pointer" }}
                    >
                      {element[1].message1}
                    </td>
                    <td
                      onClick={() => modifyHintMessage("message2", element[0])}
                      onMouseOver={(e) => mouseOver(e)}
                      onMouseOut={(e) => mouseOut(e)}
                    >
                      {element[1].message2}
                    </td>
                  </tr>
                );
              })
              .sort((x, y) => {
                return x === y ? 0 : x ? 1 : -1;
              })}
        </tbody>
      </Table>
    </>
  );
};

export default HintManager;

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
};
