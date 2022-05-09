import React from "react";
interface Item {
  component: HTMLSelectElement;
}
const Label: React.FunctionComponent<Item> = (props) => {
  console.log(props);
  const component = props.component;
  console.log(component);
  return <>component: {component}</>;
};

export default Label;
