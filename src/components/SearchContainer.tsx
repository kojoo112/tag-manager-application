import { Card } from "react-bootstrap";
import FormSelect from "./FormSelect";

interface IState {
  merchantList: string[];
  themeList: string[];
  pageList: string[];
  merchantValue: string;
  themeValue: string;
  pageValue: string;
}

const SearchContainer = (props: {
  state: IState;
  merchantChanged: Awaited<Promise<any>>;
  themeChanged: Awaited<Promise<any>>;
  pageChanged: Awaited<Promise<any>>;
}) => {
  const { state, merchantChanged, themeChanged, pageChanged } = props;

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card className="bg-dark text-white w-75">
        <Card.Header>
          <Card.Title>X-KIT Tag Manager</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormSelect
              items={state.merchantList}
              label="가맹점"
              value={state.merchantValue}
              action={merchantChanged}
            />
            <FormSelect
              items={state.themeList}
              label="테마"
              value={state.themeValue}
              action={themeChanged}
            />
            <FormSelect
              items={state.pageList}
              label="X-KIT"
              value={state.pageValue}
              action={pageChanged}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchContainer;
