import { useState, useEffect } from "react";

const useApiLoading = (request: Function[]) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      for (let index = 0; index < request.length; index++) {
        const result = await request[index]();
        setData((x: any) => x.push(result));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading };
};

export default useApiLoading;
