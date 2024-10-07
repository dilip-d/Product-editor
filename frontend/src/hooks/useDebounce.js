import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return searchTerm;
};

export default useDebounce;
