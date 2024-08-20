import { Meta, StoryObj } from "@storybook/react";
import Step from "./Step";

const meta = {
  title: "Components/Pages/Step",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Step,
  tags: ["autodocs"],
} satisfies Meta<typeof Step>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
