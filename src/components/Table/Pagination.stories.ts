import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";

const meta = {
  title: "Components/Table/Pagination",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalPage: 100,
    page: 1,
  },
};
