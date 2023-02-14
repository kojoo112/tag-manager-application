import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const FormSelect = (props) => {
  const { items, label, action, id, selectValue } = props;

  return (
    <div className="w-100" style={{ margin: 5 }}>
      <InputGroup>
        <Form.Label className="w-25" column={true} style={styles.label}>
          {label}
        </Form.Label>
        <Form.Select
          className="w-50"
          style={styles.select}
          id={id}
          onChange={(e) => {
            action(e.target.value);
          }}
          value={selectValue}
        >
          {items && Array.isArray(items)
            ? items.map((value, index) => {
                return (
                  <option value={value} key={index}>
                    {value}
                  </option>
                );
              })
            : Object.entries(items).map((element, index) => {
                return (
                  <option value={element[0]} key={index}>
                    {element[1]}
                  </option>
                );
              })}
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
