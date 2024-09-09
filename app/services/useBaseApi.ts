import stateManager from "~/contexts/StateManager";

export default function useBaseApi() {
  const requestInstance = (url: string, option: RequestInit = {}) => {
    let accressToken: string | null = stateManager.getAccessTokenState();

    const API_URL =
      typeof window !== "undefined"
        ? (window as any).ENV.API_URL
        : process.env.API_URL;
    const API_KEY =
      typeof window !== "undefined"
        ? (window as any).ENV.API_KEY
        : process.env.API_KEY;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-API-KEY", API_KEY);
    if (accressToken) {
      myHeaders.append("Authorization", "Bearer " + accressToken);
    }
    const options: RequestInit = {
      headers: myHeaders,
      ...option,
    };
    return fetch(API_URL + url, options)
      .then((x) => x)
      .catch((x) => {
        console.log("server down");
        return null;
      });
  };
  const responseInterceptor = async (
    response: Response | null,
    parseJson = true
  ) => {
    if (response?.status == 401) {
      throw response;
    }
    if (response == null) return null;
    if (parseJson) {
      const data = await response.json();
      return data;
    }
    return response;
  };
  const baseApiInstance = async (
    url: string,
    option: RequestInit = {},
    parseJson = true
  ) => {
    try {
      const response = await requestInstance(url, option);
      const data = await responseInterceptor(response, parseJson);
      return data;
    } catch (error) {
      console.error("Fetch errorss:", error);
      throw error;
    }
  };
  return {
    async getRequest(url: string, parseJson = true) {
      try {
        return await baseApiInstance(url, {}, parseJson);
      } catch (ex) {
        throw ex;
      }
    },
    async deleteRequest(url: string, parseJson = true) {
      try {
        return await baseApiInstance(url, {}, parseJson);
      } catch (ex) {
        throw ex;
      }
    },
    async putRequest(url: string, parseJson = true) {
      try {
        return await baseApiInstance(url, {}, parseJson);
      } catch (ex) {
        throw ex;
      }
    },
    async postRequest<T>(url: string, body: T, parseJson = true) {
      try {
        return await baseApiInstance(
          url,
          {
            body: JSON.stringify(body),
            method: "POST",
          },
          parseJson
        );
      } catch (ex) {
        throw ex;
      }
    },
  };
}
