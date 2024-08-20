// "use client";
// import { useMemo, useState } from "react";

// import { ColumnDef } from "@tanstack/react-table";
// import QueryKeys from "@/lib-client/react-query/queryKeys";
// import DeleteModal from "@/components/Table/DeleteModal";
// import EditModal from "@/components/Table/EditModal";
// import CreateModal from "@/components/Table/CreateModal";
// import Table from "@/components/Table/Table";
// import { OperationalReportUpdateMutationData } from "@/types/models/ReportProvince";
// import { OperationalReport } from "@prisma/client";
// import {
//   useCreateReport,
//   useDeleteReport,
//   useFetchReports,
//   useUpdateReport,
// } from "@/lib-client/react-query/report/province";

// const Home = () => {
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedData, setSelectedData] =
//     useState<OperationalReportUpdateMutationData>(null);

//   const { mutate: mutateUpdateReport } = useUpdateReport();
//   const { mutate: mutateDeleteReport } = useDeleteReport();
//   const { mutate: mutateCreateReport } = useCreateReport();
//   const handleCreate = () => {
//     setCreateModalOpen(true);
//   };

//   const handleEdit = (data: OperationalReportUpdateMutationData) => {
//     setSelectedData(data);
//     setEditModalOpen(true);
//   };

//   const handleDelete = (data: OperationalReportUpdateMutationData) => {
//     setSelectedData(data);
//     setDeleteModalOpen(true);
//   };

//   const handleCreateSubmit = (
//     CreateData: OperationalReportUpdateMutationData
//   ) => {
//     console.log(CreateData);
//     mutateCreateReport(CreateData);
//     setCreateModalOpen(false);
//   };

//   const handleEditSubmit = (
//     EditedData: OperationalReportUpdateMutationData
//   ) => {
//     console.log(EditedData);
//     mutateUpdateReport(EditedData);
//     setEditModalOpen(false);
//   };

//   const handleDeleteConfirm = () => {
//     mutateDeleteReport(selectedData?.id);
//     console.log(selectedData);
//     setDeleteModalOpen(false);
//   };
//   const columns = useMemo<ColumnDef<OperationalReport, any>[]>(
//     () => [
//       {
//         accessorKey: "id",
//         header: "Id",
//       },
//       {
//         accessorKey: "province_name",
//         header: "province name",
//       },
//       {
//         accessorKey: "sub_districts",
//         cell: (info) => {
//           return (
//             <span>
//               <ul>
//                 {Object.entries(info?.getValue()).map(([key, value]) => (
//                   <li key={key}>{`${key}: ${value?.name} ${value?.amount}`}</li>
//                 ))}
//               </ul>
//             </span>
//           );
//         },

//         header: "subDistrict",
//       },
//       {
//         accessorKey: "action",
//         cell: (info) => {
//           return (
//             <span>
//               <button
//                 type="button"
//                 className="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
//                 onClick={() => handleEdit(info.row.original)}
//               >
//                 Edit
//               </button>
//               <button
//                 type="button"
//                 className="mb-2 me-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
//                 onClick={() => handleDelete(info.row.original)}
//               >
//                 Delete
//               </button>
//             </span>
//           );
//         },
//         header: "Action",
//       },
//     ],
//     []
//   );

//   return (
//     <>
//       <div className="container mx-auto p-4">
//         <button
//           type="button"
//           className="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
//           onClick={() => handleCreate()}
//         >
//           Add Item
//         </button>
//         {/* Table */}
//         {/* <Table
//           useFetchData={useFetchReports}
//           useCreateData={useCreateReport}
//           useUpdateData={useUpdateReport}
//           useDeleteData={useDeleteReport}
//           columns={columns}
//           queryKey={QueryKeys.REPORT_PROVINCE}
//         /> */}
//       </div>
//       {/* Create Modal */}
//       <CreateModal
//         isOpen={isCreateModalOpen}
//         onClose={() => setCreateModalOpen(false)}
//         onSubmit={handleCreateSubmit}
//       />

//       {/* Edit Modal */}
//       <EditModal
//         isOpen={isEditModalOpen}
//         data={selectedData}
//         onClose={() => setEditModalOpen(false)}
//         onSubmit={handleEditSubmit}
//       />

//       {/* Delete Modal */}
//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         data={selectedData}
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => setDeleteModalOpen(false)}
//       />
//     </>
//   );
// };

const Home = () => {
  return <div>Report</div>;
};

export default Home;
