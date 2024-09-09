import type { Column } from "~/components/transaction/Transection";
const columns: Column[] = [
  {
    dataIndex: "createdDate",
    key: "createdDate",
    title: "เวลา",
  },
  {
    dataIndex: "tagId",
    key: "tagId",
    title: "ประเภท",
  },
  {
    dataIndex: "value",
    key: "value",
    title: "จำนวน",
  },
];

const expenseColumns: Column[] = [...columns];

const incomeColumns: Column[] = [...columns];

export { columns, incomeColumns, expenseColumns };
