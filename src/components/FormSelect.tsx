import { Form, InputGroup } from "react-bootstrap";

const FormSelect = (props: {
  items: object;
  label: string;
  value: string;
  action: Awaited<Promise<any>>;
}) => {
  const { items, label, value, action } = props;

  return (
    <div className="w-100" style={{ margin: 5 }}>
      <InputGroup>
        <Form.Label className="w-25" column={true} style={styles.label}>
          {label}
        </Form.Label>
        <Form.Select
          className="w-50"
          style={styles.select}
          value={value}
          onChange={(e) => action(e.target.value)}
        >
          {Array.isArray(items)
            ? items.map((value, index) => {
                return (
                  <option label={value} value={value} key={index}></option>
                );
              })
            : Object.entries(props.items).map(
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
  );
};

export default FormSelect;

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
};
