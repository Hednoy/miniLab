-- CreateTable
CREATE TABLE "tbm_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "opm_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_attachment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "category_id" INTEGER,
    "test_type_id" INTEGER,
    "inspection_type_id" INTEGER,
    "lab_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "officerId" INTEGER,

    CONSTRAINT "tb_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_attachment_lab" (
    "id" SERIAL NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "lab_id" INTEGER NOT NULL,
    "attachmentId" INTEGER,

    CONSTRAINT "tb_attachment_lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_attachment_log" (
    "id" SERIAL NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_attachment_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_patient" (
    "id" SERIAL NOT NULL,
    "hn" TEXT NOT NULL,
    "an" TEXT NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "inspection_type_id" INTEGER NOT NULL,
    "case_no" TEXT NOT NULL,
    "title" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "id_card" TEXT NOT NULL,
    "passport" TEXT,
    "phone_no" TEXT NOT NULL,
    "visit_type" TEXT NOT NULL,
    "sat_id" TEXT NOT NULL,
    "test_type_id" INTEGER,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "date_of_birth" TIMESTAMP(3),
    "date_of_send" TIMESTAMP(3),
    "collected_date" TIMESTAMP(3),
    "collected_time" TEXT DEFAULT '00:00',
    "received_date" TIMESTAMP(3),
    "received_time" TEXT DEFAULT '00:00',
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_hospital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_test_type" (
    "id" SERIAL NOT NULL,
    "prefix_name" TEXT NOT NULL,
    "subfix_name" TEXT NOT NULL,
    "description" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_test_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pathogens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "machine_id" INTEGER,

    CONSTRAINT "tb_pathogens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_inspection_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "machine_id" INTEGER,

    CONSTRAINT "tb_inspection_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_machine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rows" INTEGER NOT NULL,
    "report_type" INTEGER NOT NULL,
    "is_name" BOOLEAN NOT NULL,
    "is_labno" BOOLEAN NOT NULL,
    "is_gender" BOOLEAN NOT NULL,
    "is_age" BOOLEAN NOT NULL,
    "is_idcard" BOOLEAN NOT NULL,
    "is_hn" BOOLEAN NOT NULL,
    "is_an" BOOLEAN NOT NULL,
    "is_hospital" BOOLEAN NOT NULL,
    "is_specimens" BOOLEAN NOT NULL,
    "is_satid" BOOLEAN NOT NULL,
    "is_visittype" BOOLEAN NOT NULL,
    "is_collecteddate" BOOLEAN NOT NULL,
    "is_recieveddate" BOOLEAN NOT NULL,
    "is_history" BOOLEAN NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "test_type_id" INTEGER NOT NULL,

    CONSTRAINT "tb_machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_machine_log" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "report_type" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_machine_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_machine_lab" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "virus_type_id" INTEGER NOT NULL,

    CONSTRAINT "tb_machine_lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_machine_prefix" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "tb_machine_prefix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_machine_suffix" (
    "id" SERIAL NOT NULL,
    "machine_prefix_id" INTEGER NOT NULL,
    "tb1_nil" TEXT NOT NULL,
    "tb2_nil" TEXT NOT NULL,
    "mitogen_nil" TEXT NOT NULL,
    "qft_plus_result" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "machineId" INTEGER,

    CONSTRAINT "tb_machine_suffix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_machine_lab_log" (
    "id" SERIAL NOT NULL,
    "machine_lab_id" INTEGER NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "virus_type_id" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_machine_lab_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_lab" (
    "id" SERIAL NOT NULL,
    "test_type_id" INTEGER,
    "inspection_type_id" INTEGER NOT NULL,
    "approve_by_id" INTEGER,
    "approve_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "approve_time" TEXT DEFAULT '00:00',
    "report_by_id" INTEGER,
    "report_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "report_time" TEXT DEFAULT '00:00',
    "case_no" TEXT NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "hospital_id" INTEGER,
    "patient_id" INTEGER,
    "detail" TEXT,
    "paper_code" TEXT,
    "comment" TEXT,
    "detection_method" TEXT,
    "status" TEXT,
    "result" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_lab_log" (
    "id" SERIAL NOT NULL,
    "lab_id" INTEGER NOT NULL,
    "case_no" TEXT NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "paper_code" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "detection_method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_lab_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_lab_test" (
    "id" SERIAL NOT NULL,
    "lab_id" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "pathogens_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_lab_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_lab_test_log" (
    "id" SERIAL NOT NULL,
    "lab_test_id" INTEGER NOT NULL,
    "lab_id" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "machineLab_id" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_lab_test_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_geographic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tbm_geographic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_provinces" (
    "id" SERIAL NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "geography_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_amphures" (
    "id" SERIAL NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_amphures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_tambons" (
    "id" SERIAL NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "amphure_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_tambons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_role" (
    "role_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "department" TEXT,
    "permission_patient" BOOLEAN NOT NULL DEFAULT false,
    "permission_lab" BOOLEAN NOT NULL DEFAULT false,
    "permission_news" BOOLEAN NOT NULL DEFAULT false,
    "permission_management" BOOLEAN NOT NULL DEFAULT false,
    "permission_data" BOOLEAN NOT NULL DEFAULT false,
    "permission_history" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "tb_member" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tb_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_member_log" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "action_by" INTEGER NOT NULL,
    "action_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_member_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_officer_log" (
    "id" SERIAL NOT NULL,
    "officer_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "action_by" INTEGER NOT NULL,
    "action_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_officer_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_officer" (
    "id" SERIAL NOT NULL,
    "citizen_id" TEXT NOT NULL,
    "title_name" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nickname" TEXT,
    "mobile_phone" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "position" TEXT,
    "department" TEXT,
    "role_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "tb_officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_person" (
    "id" SERIAL NOT NULL,
    "id_card" TEXT NOT NULL,
    "title_name" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" TEXT,
    "email" TEXT,
    "age" INTEGER,
    "address" TEXT NOT NULL,
    "province_id" INTEGER,
    "amphure_id" INTEGER,
    "tombon_id" INTEGER,
    "postcode" TEXT NOT NULL,
    "telephone" TEXT,
    "mobile_phone" TEXT NOT NULL,
    "fax" TEXT,
    "occupation" TEXT,
    "organization" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "tb_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_notification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sender_type" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_by" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_news" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "date_start" TIMESTAMP(3),
    "date_end" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_news_images" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_news_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbm_news_type" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbm_news_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_attachment" ADD CONSTRAINT "tb_attachment_inspection_type_id_fkey" FOREIGN KEY ("inspection_type_id") REFERENCES "tb_inspection_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment" ADD CONSTRAINT "tb_attachment_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "tb_lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment" ADD CONSTRAINT "tb_attachment_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tbm_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment" ADD CONSTRAINT "tb_attachment_test_type_id_fkey" FOREIGN KEY ("test_type_id") REFERENCES "tb_test_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment" ADD CONSTRAINT "tb_attachment_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "tb_officer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment_lab" ADD CONSTRAINT "tb_attachment_lab_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "tb_attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_attachment_lab" ADD CONSTRAINT "tb_attachment_lab_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "tb_lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_attachment_log" ADD CONSTRAINT "tbl_attachment_log_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "tb_attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_patient" ADD CONSTRAINT "tb_patient_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "tb_hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_patient" ADD CONSTRAINT "tb_patient_inspection_type_id_fkey" FOREIGN KEY ("inspection_type_id") REFERENCES "tb_inspection_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pathogens" ADD CONSTRAINT "tb_pathogens_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_inspection_type" ADD CONSTRAINT "tb_inspection_type_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine" ADD CONSTRAINT "tb_machine_test_type_id_fkey" FOREIGN KEY ("test_type_id") REFERENCES "tb_test_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_machine_log" ADD CONSTRAINT "tbl_machine_log_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine_lab" ADD CONSTRAINT "tb_machine_lab_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine_lab" ADD CONSTRAINT "tb_machine_lab_virus_type_id_fkey" FOREIGN KEY ("virus_type_id") REFERENCES "tb_pathogens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine_prefix" ADD CONSTRAINT "tb_machine_prefix_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine_suffix" ADD CONSTRAINT "tb_machine_suffix_machine_prefix_id_fkey" FOREIGN KEY ("machine_prefix_id") REFERENCES "tb_machine_prefix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_machine_suffix" ADD CONSTRAINT "tb_machine_suffix_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "tb_machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_machine_lab_log" ADD CONSTRAINT "tbl_machine_lab_log_machine_lab_id_fkey" FOREIGN KEY ("machine_lab_id") REFERENCES "tb_machine_lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab" ADD CONSTRAINT "tb_lab_test_type_id_fkey" FOREIGN KEY ("test_type_id") REFERENCES "tb_test_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab" ADD CONSTRAINT "tb_lab_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "tb_hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab" ADD CONSTRAINT "tb_lab_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "tb_patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab" ADD CONSTRAINT "tb_lab_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "tb_machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab" ADD CONSTRAINT "tb_lab_inspection_type_id_fkey" FOREIGN KEY ("inspection_type_id") REFERENCES "tb_inspection_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_lab_log" ADD CONSTRAINT "tbl_lab_log_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "tb_lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab_test" ADD CONSTRAINT "tb_lab_test_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "tb_lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lab_test" ADD CONSTRAINT "tb_lab_test_pathogens_id_fkey" FOREIGN KEY ("pathogens_id") REFERENCES "tb_pathogens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_lab_test_log" ADD CONSTRAINT "tbl_lab_test_log_lab_test_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "tb_lab_test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbm_provinces" ADD CONSTRAINT "tbm_provinces_geography_id_fkey" FOREIGN KEY ("geography_id") REFERENCES "tbm_geographic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbm_amphures" ADD CONSTRAINT "tbm_amphures_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "tbm_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbm_tambons" ADD CONSTRAINT "tbm_tambons_amphure_id_fkey" FOREIGN KEY ("amphure_id") REFERENCES "tbm_amphures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_member" ADD CONSTRAINT "tb_member_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbm_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_member_log" ADD CONSTRAINT "tbl_member_log_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "tb_officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_officer_log" ADD CONSTRAINT "tbl_officer_log_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "tb_officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_officer" ADD CONSTRAINT "tb_officer_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbm_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_officer" ADD CONSTRAINT "tb_officer_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "tb_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_person" ADD CONSTRAINT "tb_person_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "tb_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_news_images" ADD CONSTRAINT "tb_news_images_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "tb_news"("id") ON DELETE CASCADE ON UPDATE CASCADE;
