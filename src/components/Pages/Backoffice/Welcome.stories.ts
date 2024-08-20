import { Meta, StoryObj } from "@storybook/react";
import BackofficeWelcome from "./Welcome";

const meta = {
  title: "Components/Pages/Backoffice/Default",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: BackofficeWelcome,
  tags: ["autodocs"],
} satisfies Meta<typeof BackofficeWelcome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
