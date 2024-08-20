import { Meta, StoryObj } from "@storybook/react";
import About from "./About";

const meta = {
  title: "Components/Pages/About",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: About,
  tags: ["autodocs"],
} satisfies Meta<typeof About>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
