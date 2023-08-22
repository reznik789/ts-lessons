type PosibleChildren = HTMLElement | Text | string;
type Fun = (...args: any[]) => any;
type CreatedElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : HTMLElement;
type Props<T> = T extends Fun
  ? Parameters<T>[0]
  : T extends string
  ? Partial<CreatedElement<T>>
  : never;

function nonNull<T, U>(val: T, fallback: U) {
  return Boolean(val) ? val : fallback;
}

function DOMparseNode<TEl extends string>(
  element: TEl,
  properties: Props<TEl>,
  children: PosibleChildren[]
) {
  const el = Object.assign(document.createElement(element), properties);
  DOMparseChildren(children).forEach((child) => {
    el.appendChild(child);
  });
  return el;
}

function DOMparseChildren(children: PosibleChildren[]) {
  return children.map((child) => {
    if (typeof child === "string") {
      return document.createTextNode(child);
    }
    return child;
  });
}

function DOMcreateElement<TComponent extends string | Fun>(
  element: TComponent,
  properties: Props<TComponent>,
  ...children: PosibleChildren[]
) {
  if (typeof element === "function") {
    return element({
      ...nonNull(properties, {}),
      children,
    });
  }
  return DOMparseNode(element, properties, children);
}

const Button = ({ msg }) => {
  return (
    <button onclick={() => alert(msg)}>
      <strong>Click me</strong>
    </button>
  );
};
const el = (
  <div>
    <h1 className="what">Hello world</h1>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae sed
      consectetur placeat veritatis illo vitae quos aut unde doloribus, minima
      eveniet et eius voluptatibus minus aperiam sequi asperiores, odio ad?
    </p>
    <Button msg="Yay" />
    <Button msg="Nay" />
  </div>
);
document.body.appendChild(el);
