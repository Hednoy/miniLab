import { Meta, StoryObj } from "@storybook/react";
import Downshift from "./Downshift";

const meta = {
  title: "Components/Downshift",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Downshift,
  tags: ["autodocs"],
} satisfies Meta<typeof Downshift>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: "apple" },
      { value: "pear" },
      { value: "orange" },
      { value: "grape" },
      { value: "banana" },
    ],
    value: "",
    onChange: () => {},
    color: "primary",
    helperText: "",
    title: "Title",
  },
};
