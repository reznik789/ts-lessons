type FromConstructor<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : any;
  
type RequestPayload<T extends MethodDefinition> = keyof T extends never
  ? undefined
  : {
      [Key in keyof T]: FromConstructor<T[Key]>;
    };
    
type RequestObject<S extends ServiceDefinition> = {
  [Key in keyof S]: {
    message: Key;
    payload: S[Key];
  };
}[keyof S];

type RequestHandler<S extends ServiceDefinition> = (
  req: RequestObject<S>
) => boolean;

type ServiceMethod<T extends MethodDefinition> =
  // The empty object?
  keyof T extends never
    ? // No arguments!
      () => boolean
    : // Otherwise, it's the payload we already
      // defined
      (payload: RequestPayload<T>) => boolean;

type ServiceObject<S extends ServiceDefinition> = {
  [Key in keyof S]: ServiceMethod<S[Key]>;
};

type MethodDefinition = {
  [key: string]: StringConstructor | NumberConstructor;
};

type ServiceDefinition = {
  [key: string]: MethodDefinition;
};

function createService<S extends ServiceDefinition>(
  serviceDef: S,
  handler: RequestHandler<S>
): ServiceObject<S> {
  const service: Record<string, Function> = {};
  for (const name in serviceDef) {
    service[name] = (payload: any) =>
      handler({
        message: name,
        payload,
      });
  }
  return service as ServiceObject<S>;
}

const serviceDefinition = {
  open: { filename: String },
  insert: { pos: Number, text: String },
  delete: { pos: Number, len: Number },
  close: {},
};

const service = createService(serviceDefinition, (req) => {
  // req is now perfectly typed and we know
  // which messages we are able to get
  switch (req.message) {
    case "open":
      // Do something
      break;
    case "insert":
      // Do something
      break;
    default:
      // Due to control flow anaysis, this
      // message now can only be close or
      // delete.
      // We can narrow this down until we
      // reach never
      break;
  }
  return true;
});

service.open({ filename: 'some.txt' });
service.close()
