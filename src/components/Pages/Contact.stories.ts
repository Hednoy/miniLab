import { Meta, StoryObj } from "@storybook/react";
import Contact from "./Contact";

const meta = {
  title: "Components/Pages/Contact",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Contact,
  tags: ["autodocs"],
} satisfies Meta<typeof Contact>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
