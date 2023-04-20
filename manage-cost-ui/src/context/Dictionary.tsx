import React, { createContext, FC, PropsWithChildren, useState } from "react";
import Dictionary from "../models/dictionary.model";
import { isDictionaryArr } from "../functions/assertions";

type IDictionaryContext = {
  dictionary: Record<string, Dictionary[]>;
  setDictionary: (
    key: string,
    requiestFn: () => Promise<Dictionary[] | undefined>
  ) => void;
  loading: boolean;
};

const initialValue: IDictionaryContext = {
  dictionary: {},
  setDictionary: () => {},
  loading: false,
};

export const DictionaryContext =
  createContext<IDictionaryContext>(initialValue);

const Dictionary: FC<PropsWithChildren> = ({ children }) => {
  const [dictionary, setState] = useState<IDictionaryContext["dictionary"]>({});
  const [loading, setLoading] = useState<boolean>(false);

  const setDictionary: IDictionaryContext["setDictionary"] = async (
    key,
    requiestFn
  ) => {
    setLoading(true);
    try {
      const data = await requiestFn();
      isDictionaryArr(data);
      setState((prevState) => ({ ...prevState, [key]: data }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DictionaryContext.Provider value={{ dictionary, setDictionary, loading }}>
      {children}
    </DictionaryContext.Provider>
  );
};

export default Dictionary;
