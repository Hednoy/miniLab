import { Meta, StoryObj } from "@storybook/react";
import AttachmentDisplay from "./AttachmentDisplay";

const meta = {
  title: "Components/Attachment/Default",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  component: AttachmentDisplay,
  tags: ["autodocs"],
} satisfies Meta<typeof AttachmentDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    attachments: [],
  },
};
