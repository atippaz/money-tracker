import useBaseApi from "./useBaseApi";
interface Profile {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
  userId: string;
  userName: string;
}
interface Payload {
  startDate: Date | null;
  endDate: Date | null;
}
interface PayloadSummary {
  month: number;
  year: number;
}
export default function useIncomeApi() {
  const baseApi = useBaseApi();
  const controllerName = "incomes";
  return {
    async getIncomes(startDate: Date | null, endDate: Date | null) {
      try {
        const objPayload: Payload = {
          startDate: startDate,
          endDate: endDate,
        };
        const searchParams = new URLSearchParams();
        Object.keys(objPayload).forEach((key) => {
          const value = objPayload[key as keyof Payload];
          if (value) {
            searchParams.append(key, value.toISOString());
          }
        });
        const res = await baseApi.getRequest(
          controllerName + "?" + searchParams
        );
        return res as [];
      } catch (ex) {
        throw ex;
      }
    },
    async createIncome(payload: {
      date: string;
      value: number;
      tagId: string;
    }) {
      try {
        const res = await baseApi.postRequest(controllerName, payload);
        return res;
      } catch (ex) {
        throw ex;
      }
    },
    async getSummaryIncomesByMonth(month: number, year: number) {
      try {
        const objPayload: PayloadSummary = {
          month,
          year,
        };
        const searchParams = new URLSearchParams();
        Object.keys(objPayload).forEach((key) => {
          const value = objPayload[key as keyof PayloadSummary];
          if (value) {
            searchParams.append(key, value.toString());
          }
        });
        const res = await baseApi.getRequest(
          controllerName + "/summary?" + searchParams
        );
        return res as [];
      } catch (ex) {
        throw ex;
      }
    },
  };
}
