type DeepReadOnly<T> = {
  readonly [P in keyof T]: DeepReadOnly<T[P]>;
};

type VideoFormatURLs = {
  format360p: URL;
  format480p: URL;
  format720p: URL;
  format1080p: URL;
};

type SubtitleURLs = {
  english: URL;
  german: URL;
  french: URL;
};

type UserPreferences = {
  format: keyof VideoFormatURLs;
  subtitles: {
    active: boolean;
    language: keyof SubtitleURLs;
  };
  theme: "dark" | "light";
};

const defaultUP: DeepReadOnly<UserPreferences> = {
  format: "format1080p",
  subtitles: {
    active: false,
    language: "english",
  },
  theme: "light",
};

const userP = {
  format: "format480p",
  theme: "dark",
} as const;

function combinePreferences<UserP extends Partial<UserPreferences>>(
  defaultP: UserPreferences,
  userP: UserP
) {
  return { ...defaultP, ...userP };
}

const p = combinePreferences(defaultUP, userP);
p.format;
p.theme;

const userPref: UserPreferences = combinePreferences(defaultUP, userP);

type Keys = keyof VideoFormatURLs;
const k: Keys = "format360p";

const videoFormatURLs: VideoFormatURLs = {
  format360p: new URL("http://some.org"),
  format480p: new URL("http://some.org"),
  format720p: new URL("http://some.org"),
  format1080p: new URL("http://some.org"),
};

type URLObject = {
  [key: string]: URL;
};

type Loaded<Key> = {
  format: Key;
  loaded: boolean;
};

async function loadFile<Formats extends URLObject, Key extends keyof Formats>(
  fileFormats: Formats,
  format: Key
): Promise<Loaded<Key>> {
  // Fetch the data
  const data = await fetch(fileFormats[format].href);
  return {
    // Return the format
    format,
    // and see if we get an OK response
    loaded: data.status === 200,
  };
}

loadFile(videoFormatURLs, "format720p").then((res) => console.log(res));
loadFile({ some: new URL("http://some.org") }, "some").then((res) =>
  console.log(res.loaded)
);

type Split<Obj> = {
  [K in keyof Obj]: Record<K, Obj[K]>;
}[keyof Obj];

type AvailableFormats = Split<VideoFormatURLs>;

const format: AvailableFormats = {
  format720p: new URL(""),
};
