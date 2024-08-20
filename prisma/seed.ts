import { PrismaClient } from "@prisma/client";
import geographic from "./data/thai_geographies.json";
import amphures from "./data/thai_amphures.json";
import provinces from "./data/thai_provinces.json";
import tambons from "./data/thai_tambons.json";
import roles from "./data/thai_role.json";
import newsType from "./data/news_type.json";
import members from "./data/member.json";
import inspectionTpye from "./data/inspection_type.json";
import machine from "./data/machine.json";
import pathogens from "./data/pathogens.json";
import testType from "./data/test_type.json";

const prisma = new PrismaClient();

const geographicData = geographic.RECORDS.map((v) => ({
  name: v.name,
  id: v.id,
}));

const provincesData = provinces.RECORDS.map((v) => ({
  name_en: v.name_en,
  name_th: v.name_th,
  geography_id: v.geography_id,
  id: v.id,
}));

const amphuresData = amphures.RECORDS.map((v) => ({
  name_en: v.name_en,
  name_th: v.name_th,
  id: v.id,
  province_id: v.province_id,
}));

const tambonsData = tambons.RECORDS.map((v) => ({
  zip_code: v.zip_code,
  name_en: v.name_en,
  name_th: v.name_th,
  id: v.id,
  amphure_id: v.amphure_id,
}));

const rolesData = roles.RECORDS.map((v) => ({
  role_id: v.role_id,
  name: v.name,
  is_admin: v.is_admin,
  is_active: v.is_active,
}));

const newsTypes = newsType.RECORDS.map((v) => ({
  code: v.code,
  name: v.name,
  description: v.description,
  is_active: v.is_active,
}));

const memberData = members.RECORDS.map((v) => ({
  id: v.id,
  username: v.username,
  password: v.password,
  role_id: v.role_id,
}));

const inspectionTypeData = inspectionTpye.RECORDS.map((v) => ({
  id: v.id,
  name: v.name,
  description: v.description,
}));

const machineData = machine.RECORDS.map((v) => ({
  id: v.id,
  name: v.name,
  description: v.description,
  code: v.code,
  rows: v.rows,
  report_type: v.report_type,
  is_name: v.is_name,
  is_labno: v.is_labno,
  is_gender: v.is_gender,
  is_age: v.is_age,
  is_idcard: v.is_idcard,
  is_hn: v.is_hn,
  is_an: v.is_an,
  is_hospital: v.is_hospital,
  is_specimens: v.is_specimens,
  is_satid: v.is_satid,
  is_visittype: v.is_visittype,
  is_collecteddate: v.is_collecteddate,
  is_recieveddate: v.is_recieveddate,
  is_history: v.is_history,
  test_type_id: v.test_type_id,
}));

const pathogensData = pathogens.RECORDS.map((v) => ({
  id: v.id,
  code: v.code,
  name: v.name,
  description: v.description,
}));

const testTypeData = testType.RECORDS.map((v) => ({
  id: v.id,
  prefix_name: v.prefix_name,
  subfix_name: v.subfix_name,
  description: v.description,
}));

async function main() {
  console.log(`Start seeding ...`);

  const geog = await prisma.geographic.createMany({
    data: geographicData,
  });
  console.log(`Created geographic with id: ${geog.count}`);

  const province = await prisma.provinces.createMany({
    data: provincesData,
  });

  console.log(`Created province with id: ${province.count}`);

  const amphure = await prisma.amphures.createMany({
    data: amphuresData,
  });
  console.log(`Created amphure with id: ${amphure.count}`);

  const tambon = await prisma.tambons.createMany({
    data: tambonsData,
  });
  console.log(`Created tambon with id: ${tambon.count}`);

  const role = await prisma.role.createMany({
    data: rolesData,
  });

  const newsTypess = await prisma.newsType.createMany({
    data: newsTypes,
  });
  console.log(`Created tambon with id: ${newsTypess.count}`);

  const member = await prisma.member.createMany({
    data: memberData,
  });
  console.log(`Created member with id: ${member.count}`);

  const inspectionType = await prisma.inspectionType.createMany({
    data: inspectionTypeData,
  });
  console.log(`Created inspectionType with id: ${inspectionType.count}`);
  const testType = await prisma.testType.createMany({
    data: testTypeData,
  });
  console.log(`Created testType with id: ${testType.count}`);

  const machines = await prisma.machine.createMany({
    data: machineData,
  });
  console.log(`Created machine with id: ${machines.count}`);

  const pathogens = await prisma.pathogens.createMany({
    data: pathogensData,
  });
  console.log(`Created pathogens with id: ${pathogens.count}`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
