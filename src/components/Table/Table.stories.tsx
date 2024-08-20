import { Meta, StoryObj } from "@storybook/react";
import Table from "./Table";

const meta = {
  title: "Components/Table",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

type Story = StoryObj<typeof meta>;

export default meta;

// type Story = StoryObj<typeof meta>;
// mock data
// const StoryWithHook = () => {
//   const [sorting, setSorting] = useState<SortingState>([
//     { desc: false, id: "name" },
//   ]);

//   return <Table table={table} />;
// };

// const table =
export const Default: Story = {
  args: {
    PageCount: 10,
    ShowPagination: true,
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    columns: [
      {
        header: "ลำดับ",
        accessorKey: "code",
      },
      {
        header: "ชื่อผู้แจ้ง",
        accessorKey: "name",
      },
      {
        header: "หน่วยงาน",
        accessorKey: "organization",
      },
      {
        header: "วันที่แจ้ง",
        accessorKey: "date",
      },
      {
        header: "สถานะ",
        accessorKey: "status",
      },
      {
        header: "ดำเนินการ",
        accessorKey: "action",
      },
    ],
    data: [
      {
        action: "ดูรายละเอียด",
        code: "0001",
        date: "01/01/2564",
        name: "นาย สมชาย ใจดี",
        organization: "หน่วยงาน A",
        status: "รับเรื่อง",
      },
    ],
  },
};
