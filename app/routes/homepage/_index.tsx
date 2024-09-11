import { useContexts } from "../_index";
// import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Transection from "~/components/transaction/Transection";
import { expenseColumns, incomeColumns } from "./state";

import stateManager from "~/contexts/StateManager";
import useIncomeApi from "~/services/useIncomeApi";
import useExpenseApi from "~/services/useExpenseApi";
import dayjs, { Dayjs } from "dayjs";
type TransectionType = "expense" | "income" | "saving";
interface TransectionModel {
  type: string;
  value: number;
  createDate: Date;
  tagId: string;
}
interface MenuItem {
  key: string;
  label: string;
}
// const DropdownItems: React.FC<{
//   itemSelect: string;
//   // items: MenuProps["items"];
//   callback: Function;
// }> = ({ items = [], callback, itemSelect }) => {
//   const [create, setCreate] = useState(false);
//   const [selected, setSelected] = useState("ชนิดรายการ");
//   const onClick: MenuProps["onClick"] = ({ key }) => {
//     const item = items.find(
//       (x): x is MenuItem =>
//         typeof x !== "string" && "label" in x! && x.key === key
//     );
//     if (item) {
//       setSelected(item.label);
//       callback(item.key);
//     }
//   };
//   useEffect(() => {
//     setSelected(
//       (x) => items.find((y) => y?.key === itemSelect)?.label || "ชนิดรายการ"
//     );
//   }, [itemSelect]);
//   useEffect(() => {
//     if (items.findIndex((x) => x?.key == -1) == -1) {
//       items.push({
//         label: create ? (
//           <Input aria-label="ชื่อรายการ"></Input>
//         ) : (
//           <span>เพิ่มรายการใหม่</span>
//         ),
//         onClick: (e) => {
//           setCreate(true);
//           // items.push({
//           //   label: <Input aria-label="ชื่อรายการ"></Input>,
//           //   key: -2,
//           //   onClick: (x) => {},
//           // });
//         },
//         key: -1,
//       });
//     }
//   }, []);
//   return (
//     <Dropdown menu={{ items, onClick }} trigger={["click"]}>
//       <Button>
//         <Space>
//           {selected}
//           <DownOutlined />
//         </Space>
//       </Button>
//     </Dropdown>
//   );
// };
// const DialogTransection: React.FC<{
//   open: boolean;
//   onCancel: Function;
//   onSubmit: ({
//     date,
//     tagId,
//     value,
//   }: {
//     date: dayjs.Dayjs;
//     tagId: string;
//     value: number;
//   }) => void;
//   type: string;
//   dropdowns: [];
// }> = ({ open, onCancel, onSubmit, type, dropdowns }) => {
//   const { spendingTypes } = useContexts()!;
//   const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
//   const [value, setValue] = useState<number>(0);
//   const [tagId, setTagId] = useState<string>("");

//   const items: MenuProps["items"] = dropdowns
//     .filter((x) => x.spendingTypeId === type)
//     .map((x) => {
//       return {
//         label: x.nameTh,
//         onClick: (e) => {
//           console.log(e.Key);
//         },
//         key: x.tagId,
//       };
//     });
//   const onChange: InputNumberProps["onChange"] = (value) => {
//     setValue((x) => parseFloat(value?.toString() || "0"));
//   };
//   const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
//     setDate((x) =>
//       x
//         .hour(time.get("hour"))
//         .minute(time.get("minute"))
//         .second(time.get("second"))
//     );
//   };
//   const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
//     setDate((x) =>
//       x.day(date.get("day")).month(date.get("month")).year(date.get("year"))
//     );
//   };
//   return (
//     <>
//       <Modal
//         title={spendingTypes.find((x) => x.spendingTypeId === type).nameTh}
//         centered
//         open={open}
//         onOk={() => {
//           onSubmit({ date, tagId, value });
//           setDate((x) => dayjs());
//           setValue((x) => 0);
//           setTagId((x) => "");
//         }}
//         onCancel={() => onCancel()}
//         width={300}
//       >
//         <div className="flex justify-between gap-2">
//           <DatePicker defaultValue={date} onChange={onDateChange} />
//           <TimePicker
//             defaultValue={date}
//             onChange={onTimeChange}
//             changeOnScroll
//             needConfirm={false}
//           />
//         </div>
//         <div className="my-2 flex justify-between gap-2">
//           <DropdownItems
//             itemSelect={tagId}
//             items={items}
//             callback={(e: string) => {
//               setTagId((x) => e);
//             }}
//           />
//           <InputNumber
//             placeholder="จำนวน"
//             className="w-full"
//             min={1}
//             value={value}
//             onChange={onChange}
//           />
//         </div>
//         <TextArea disabled placeholder="โน๊ตช่วยจำ" rows={2} />
//       </Modal>
//     </>
//   );
// };

const HomePage = () => {
  const navigate = useNavigate();
  const [incomes, setIncome] = useState([]);
  const [expenses, setExpense] = useState([]);

  const context = useContexts();
  console.log(context);
  const { spendingTypes, tags } = context;
  const [allTag, setAllTag] = useState([]);
  const [OpenDialog, setOpenDialog] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [summaryIncomeTransection, setSummaryIncomeTransection] = useState<[]>(
    []
  );
  const [summaryExpenseTransection, setSummaryExpenseTransection] = useState<
    []
  >([]);
  const incomeApi = useIncomeApi();
  const expenseApi = useExpenseApi();
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date();
  end.setUTCHours(23, 59, 59, 0);
  useEffect(() => {
    if (window.location.pathname === "/homepage") {
      // router.push("/");
      navigate("/");
    }
  }, []);
  async function getExpenseDaily() {
    const expenseData = await expenseApi.getExpenses(start, end);
    console.log(expenseData);
    setExpense(
      expenseData.map((g) => ({
        ...g,
        key: g.expenseId,
        tagId: allTag.find((f) => f.tagId === g.tagId)?.nameTh || g.tagId,
        createdDate: new Date(g.createdDate).toLocaleTimeString("en-GB", {
          hour12: false,
        }),
      }))
    );
  }
  async function getIncomeDaily() {
    const incomeData = await incomeApi.getIncomes(start, end);
    setIncome(
      incomeData.map((g) => ({
        ...g,
        key: g.incomeId,
        tagId: allTag.find((f) => f.tagId === g.tagId)?.nameTh || g.tagId,
        createdDate: new Date(g.createdDate).toLocaleTimeString("en-GB", {
          hour12: false,
        }),
      }))
    );
  }
  useEffect(() => {
    setAllTag([...tags]);
  }, [tags]);

  const fetchData = async () => {
    try {
      await Promise.all([getExpenseDaily(), getIncomeDaily()]);
      const [incomeData, expenseData] = await Promise.all([
        incomeApi.getSummaryIncomesByMonth(8, 2024),
        expenseApi.getSummaryExpensesByMonth(8, 2024),
      ]);
      setSummaryExpenseTransection((x) => expenseData);
      setSummaryIncomeTransection((x) => incomeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [allTag]);
  async function createTransection({
    date,
    tagId,
    value,
  }: {
    date: dayjs.Dayjs;
    tagId: string;
    value: number;
  }) {
    if (date == null || tagId == null || tagId == "" || value == 0) {
      return;
    }
    console.log(date.toISOString());
    // รายจ่าย
    try {
      if (type == spendingTypes[0].spendingTypeId) {
        const res = await expenseApi.createExpense({
          date: date.toISOString(),
          value,
          tagId,
        });
        await getExpenseDaily();
        return;
      }
      // รายรับ
      if (type == spendingTypes[1].spendingTypeId) {
        const res = await incomeApi.createIncome({
          date: date.toISOString(),
          value,
          tagId,
        });
        console.log(res);
        await getIncomeDaily();
        return;
      }
    } catch (ex) {}
  }
  return (
    <div className="px-4 py-4 flex flex-col gap-2">
      <div>
        <div className="font-bold">ข้อมูลรายวัน</div>
        <div className="flex w-full h-full gap-4 my-4 ">
          <Transection
            columns={incomeColumns}
            dataSource={incomes}
            type="income"
            isClickCallBack={() => {
              setOpenDialog((x) => true);
              setType(spendingTypes[1].spendingTypeId);
            }}
          ></Transection>
          <Transection
            columns={expenseColumns}
            dataSource={expenses}
            type="expense"
            isClickCallBack={() => {
              setOpenDialog((x) => true);
              setType(spendingTypes[0].spendingTypeId);
            }}
          ></Transection>
        </div>
      </div>
      <div>
        <div>
          <p className="font-bold">ข้อมูลรายเดือน</p>
          <div className="flex w-full gap-4 h-60">
            <div className="w-full flex flex-col">
              <div className="font-medium text-gray-500 ">เดือนปัจจุบัน</div>
              {/* <Card>
                <div className="h-full flex justify-around flex-col lg:flex-row">
                  <BarChartComponent
                    datas={summaryExpenseTransection}
                  ></BarChartComponent>

                  <BarChartComponent
                    datas={summaryIncomeTransection}
                  ></BarChartComponent>
                  <BarChartComponent
                    datas={[
                      {
                        name: "expense",
                        value: summaryExpenseTransection.reduce(
                          (acc, item) => acc + parseFloat(item.value),
                          0
                        ),
                      },
                      {
                        name: "income",
                        value: summaryIncomeTransection.reduce(
                          (acc, item) => acc + parseFloat(item.value),
                          0
                        ),
                      },
                    ]}
                  ></BarChartComponent>

                  <PieChartComponent
                    datas={summaryIncomeTransection}
                  ></PieChartComponent>
                </div>
              </Card> */}
            </div>
            {/* <div className="w-full flex flex-col ">
              <div className="font-medium text-gray-500 ">เดือนที่ผ่านมา</div>
              <Card>
                <div>ค่าใช้จ่าย vs รายรับ</div>
                <div className="h-full flex justify-between">
                  <BarChartComponent datas={[]}></BarChartComponent>
                  <PieChartComponent datas={[]}></PieChartComponent>
                </div>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
      {/* {type && (
        <DialogTransection
          dropdowns={allTag}
          type={type}
          onSubmit={(payload) => {
            setOpenDialog(false);
            createTransection(payload);
          }}
          open={OpenDialog}
          onCancel={() => {
            setOpenDialog((x) => false);
          }}
        ></DialogTransection>
      )} */}
    </div>
  );
};

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BarChartComponent = ({
  datas,
}: {
  datas: { name: string; value: number }[];
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      console.log(chartContainerRef.current);
      if (chartContainerRef.current) {
        setSize({
          width: chartContainerRef.current.clientWidth / 2 - 40,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    handleResize();
  }, []);

  return (
    <div ref={chartContainerRef}>
      <BarChart width={size.width} height={size.height} data={datas}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

import { PieChart, Pie } from "recharts";
import { promises } from "dns";
import { useNavigate } from "@remix-run/react";

const PieChartComponent = ({
  datas,
}: {
  datas: { name: string; value: number }[];
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setSize({
          width: chartContainerRef.current.clientWidth / 2 - 40,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    handleResize();
  }, []);
  return (
    <div ref={chartContainerRef}>
      <PieChart width={size.width} height={size.height}>
        <Pie
          data={datas}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default HomePage;
