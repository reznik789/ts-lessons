type State = any;

enum ActionType {
  one = "one", // number
  two = "two", // string
}

type Action<T extends ActionType> = {
  type: T;
  payload: T extends ActionType.one ? number : string;
};

const reducer = <T extends ActionType>(
  state: State,
  action: Action<T>
): State => state;

const a: Action<ActionType.one> = {
  type: ActionType.one,
  payload: 25,
};
