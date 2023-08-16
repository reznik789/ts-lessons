// toJSON returns this object for
// serialization, no matter which other
// properties this type has.
type Widget = {
  toJSON(): {
    kind: "Widget";
    date: Date;
  };
};
type Item = {
  // Regular primitive types
  text: string;
  count: number;
  // Options get preserved
  choice: "yes" | "no" | null;
  // Functions get dropped.
  func: () => void;
  // Nested elements need to be parsed
  // as well
  nested: {
    isSaved: boolean;
    data: [1, undefined, 2];
  };
  // A pointer to another type
  widget: Widget;
  // The same object referenced again
  children?: Item[];
};

type UndefinedAsNull<T> = T extends undefined ? null : T;

type JSONifiedObject<T extends object> = {
  [P in keyof T]: JSONified<T[P]>;
};

type JSONifiedArray<T> = Array<UndefinedAsNull<T>>;

type JSONifiedValue<T> = T extends number | string | null | undefined | boolean
  ? T
  : T extends Function
  ? never
  : T extends object
  ? JSONifiedObject<T>
  : T extends Array<infer Item>
  ? JSONifiedArray<Item>
  : never;

type JSONified<T> = JSONifiedValue<T extends { toJSON: infer U } ? U : T>;

type JSONifiedItem = JSONified<Item>;
