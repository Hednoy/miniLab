import {
  CellContext,
  ColumnDef,
  ColumnDefBase,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { FC, useMemo, useState } from "react";

type AttachmentData = {
  id: string;
  file: File;
  desc: string;
};

type AttachmentDisplayProps = {
  attachments: AttachmentData[];
};

const Attachment = ({ attachment }: { attachment: AttachmentData }) => {
  return (
    <div>
      <p>{attachment.desc}</p>
      <p>{attachment.file.name}</p>
    </div>
  );
};

type AttachmentAddProps = {
  addAttachment: (file: File) => void;
};

const AttachmentAdd: FC<AttachmentAddProps> = ({ addAttachment }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddAttachment = () => {
    if (file) {
      addAttachment(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAddAttachment}>Add Attachment</button>
    </div>
  );
};

const AttachmentDisplay: FC<AttachmentDisplayProps> = ({ attachments }) => {
  const columnHelper = createColumnHelper<AttachmentData>();

  const columns: ColumnDef<AttachmentData, any>[] = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        header: "ID",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("desc", {
        id: "desc",
        header: "Description",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("file", {
        id: "file",
        header: "File",
        cell: (info: CellContext<AttachmentData, File>) => (
          <span>{info.getValue()?.name}</span>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: attachments,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-3 gap-4 divide-x-2">
      <div>
        <div className="mb-2">
          <div>
            <Label htmlFor="document-upload" value="เอกสารแนบ" />
          </div>
          <FileInput id="document-upload" />
        </div>
        <div className="mb-2">
          <div>
            <Label htmlFor="description-document-upload" value="คำอธิบาย" />
          </div>
          <TextInput id="description-document-upload" sizing={"md"} />
        </div>
        <div className="mb-2">
          <Button>บันทึกไฟล์แนบ</Button>
        </div>
      </div>
      <div className="col-span-2">
        {attachments.map((attachment) => (
          <Attachment key={attachment.id} attachment={attachment} />
        ))}
      </div>
    </div>
  );
};

export default AttachmentDisplay;
