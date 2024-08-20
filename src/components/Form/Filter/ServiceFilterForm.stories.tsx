import { Meta, StoryObj } from "@storybook/react";
import ServiceFilterForm from "./ServiceFilterForm";

const meta = {
  title: "Components/Form/Filter/ServiceFilterForm",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered", // 'centered' | 'fullscreen' | 'padded'
  },
  component: ServiceFilterForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ServiceFilterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    oranizationOptions: [
      { value: "องค์กรที่ 1", id: "1" },
      { value: "องค์กรที่ 2", id: "2" },
      { value: "องค์กรที่ 3", id: "3" },
      { value: "องค์กรที่ 4", id: "4" },
      { value: "องค์กรที่ 5", id: "5" },
    ],
    provinceOptions: [
      { value: "กระบี่", id: "1" },
      { value: "กรุงเทพมหานคร", id: "2" },
      { value: "กาญจนบุรี", id: "3" },
      { value: "กาฬสินธุ์", id: "4" },
      { value: "กำแพงเพชร", id: "5" },
    ],
    statusOptions: [
      { value: "เปิดใช้งาน", id: "1" },
      { value: "ปิดใช้งาน", id: "2" },
    ],
  },
};
