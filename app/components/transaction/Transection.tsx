export interface Column {
  title: string;
  dataIndex: string;
  key: string;
}
const transection: React.FC<{
  dataSource: [];
  columns: Column[];
  type: "expense" | "income" | "saving";
  isClickCallBack?: Function;
}> = ({ dataSource, columns, type, isClickCallBack }) => {
  const header =
    type == "expense" ? "รายจ่าย" : type == "income" ? "รายรับ" : "เงินเก็บ";
  const mainColor =
    type == "expense" ? "รายจ่าย" : type == "income" ? "รายรับ" : "เงินเก็บ";
  return (
    <>
      {/* <Card
        size="small"
        className="w-full  "
        title={header}
        bordered={false}
        extra={
          <Button
            size="small"
            onClick={() => isClickCallBack && isClickCallBack()}
          >
            <p className="text-sm">New</p>
          </Button>
        }
      >
        <Table
          size="small"
          pagination={{ position: ["none"] }}
          className="w-full h-full"
          dataSource={dataSource}
          columns={columns}
        />
      </Card> */}
    </>
  );
};

export default transection;
