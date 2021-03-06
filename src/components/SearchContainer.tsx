import FormSelect from "./FormSelect";
import { IState } from "../util/interface";

const SearchContainer = (props: {
  state: IState;
  merchantChanged: Awaited<Promise<any>>;
  themeChanged: Awaited<Promise<any>>;
  pageChanged: Awaited<Promise<any>>;
}) => {
  const { state, merchantChanged, themeChanged, pageChanged } = props;

  return (
    <div>
      <div>
        <FormSelect
          items={state.merchantList}
          label="가맹점"
          value={state.merchantValue}
          action={merchantChanged}
        />
      </div>
      <div>
        <FormSelect
          items={state.themeList}
          label="테마"
          value={state.themeValue}
          action={themeChanged}
        />
      </div>
      <div>
        <FormSelect
          items={state.pageList}
          label="X-KIT"
          value={state.pageValue}
          action={pageChanged}
        />
      </div>
    </div>
  );
};

export default SearchContainer;
