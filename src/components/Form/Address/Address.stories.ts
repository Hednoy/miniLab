import { Meta, StoryObj } from "@storybook/react";
import Address from "./Address";

const meta = {
  title: "Components/Form/Address",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Address,
  tags: ["autodocs"],
} satisfies Meta<typeof Address>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
