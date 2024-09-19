import { Downshift } from "@/components/Downshift";
import { useAmphures } from "@/lib-client/react-query/address/useAmphures";
import { useProvinces } from "@/lib-client/react-query/address/useProvinces";
import { useTambons } from "@/lib-client/react-query/address/useTambons";
import QueryKeys from "@/lib-client/react-query/queryKeys";
import { tr } from "@faker-js/faker";
import { Label, Select, TextInput } from "flowbite-react";
import React, { FC, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaStarOfLife } from "react-icons/fa";

type Option = { value: string; id?: string | number };

type Address = {
  address: string;
  province_id: number;
  amphure_id: number;
  tombon_id: number;
  postcode: number;
};

type AddressProps = {
  // onProvinceChange: (value: Option) => void;
  // onAumphurChange: (value: Option) => void;
  // onTambonChange: (value: Option) => void;
  // onZipcodeChange: (value: Option) => void;
};

const Address: FC<AddressProps> = () => {
  const formLocal = useFormContext<Address>() ?? null;

  const [selectionProvince, setSelectionProvince] = React.useState<Option>();
  const [selectionAumphur, setSelectionAumphur] = React.useState<Option>();
  const [selectionTambon, setSelectionTambon] = React.useState<Option>();
  const [selectionZipcode, setSelectionZipcode] = React.useState<Option>();

  useEffect(() => {
    if (selectionProvince) {
      formLocal?.setValue("province_id", selectionProvince.id as number);
      formLocal?.clearErrors("province_id");
    }
  }, [selectionProvince]);

  useEffect(() => {
    if (selectionAumphur) {
      formLocal?.setValue("amphure_id", selectionAumphur.id as number);
      formLocal?.clearErrors("amphure_id");
    }
  }, [selectionAumphur]);

  useEffect(() => {
    if (selectionTambon) {
      formLocal?.setValue("tombon_id", selectionTambon.id as number);
      formLocal?.clearErrors("tombon_id");
    }
  }, [selectionTambon]);

  useEffect(() => {
    if (selectionZipcode) {
      formLocal?.setValue("postcode", selectionZipcode.id as number);
      formLocal?.clearErrors("postcode");
    }
  }, [selectionZipcode]);

  const { data: _provinceOptions } = useProvinces(QueryKeys.PROVINCES, {
    page: 1,
    limit: 77,
    searchTerm: "",
  });

  const { data: _amphuresOptions } = useAmphures(QueryKeys.AMPHURES, {
    page: 1,
    limit: 99,
    provinceId: (selectionProvince?.id as number) ?? undefined,
  });

  const { data: tambonsOptions } = useTambons(QueryKeys.TAMBONS, {
    page: 1,
    limit: 99,
    amphureId: (selectionAumphur?.id as number) ?? undefined,
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="md:col-span-4">
        <div>
          <Label
            htmlFor="adddress"
            color={
              (Boolean(formLocal?.formState?.errors?.address?.message) &&
                "failure") ||
              undefined
            }
          >
            ที่อยู่ :
          </Label>
          <FaStarOfLife className="inline-block h-3 w-3 text-danger" />
        </div>
        <div>
          <TextInput
            id="address"
            placeholder="ที่อยู่"
            required
            {...formLocal?.register("address")}
            helperText={formLocal?.formState?.errors?.address?.message || ""}
            color={
              (Boolean(formLocal?.formState?.errors?.address?.message) &&
                "failure") ||
              undefined
            }
          />
        </div>
      </div>
      <div>
        <div>
          <Label
            htmlFor="province"
            color={
              (Boolean(formLocal?.formState?.errors?.province_id?.message) &&
                "failure") ||
              undefined
            }
          >
            จังหวัด :
          </Label>
          <FaStarOfLife className="inline-block h-3 w-3 text-danger" />
        </div>
        <div>
          <Downshift
            options={
              _provinceOptions?.items?.map((item) => ({
                value: item.name_th,
                id: item.id,
              })) || []
            }
            value={selectionProvince?.value || ""}
            onChange={(value) => {
              setSelectionProvince(value);
            }}
            helperText={
              formLocal?.formState?.errors?.province_id?.message || ""
            }
            color={
              (Boolean(formLocal?.formState?.errors?.province_id?.message) &&
                "failure") ||
              undefined
            }
            placeholder="จังหวัด"
            disabled={_provinceOptions?.items?.length === 0}
          />
        </div>
      </div>
      <div>
        <div>
          <Label
            htmlFor="aumphur"
            color={
              (Boolean(formLocal?.formState?.errors?.amphure_id?.message) &&
                "failure") ||
              undefined
            }
          >
            อำเภอ :
          </Label>
          <FaStarOfLife className="inline-block h-3 w-3 text-danger" />
        </div>
        <div>
          <Downshift
            options={
              _amphuresOptions?.items?.map((item) => ({
                value: item.name_th,
                id: item.id,
              })) || []
            }
            value={selectionAumphur?.value || ""}
            onChange={(value) => {
              setSelectionAumphur(value);
            }}
            helperText={formLocal?.formState?.errors?.amphure_id?.message || ""}
            color={
              (Boolean(formLocal?.formState?.errors?.amphure_id?.message) &&
                "failure") ||
              undefined
            }
            placeholder="อำเภอ"
            disabled={_amphuresOptions?.items?.length === 0}
          />
        </div>
      </div>
      <div>
        <div>
          <Label
            htmlFor="tambon"
            color={
              (Boolean(formLocal?.formState?.errors?.tombon_id?.message) &&
                "failure") ||
              undefined
            }
          >
            ตำบล :
          </Label>
          <FaStarOfLife className="inline-block h-3 w-3 text-danger" />
        </div>
        <div>
          <Downshift
            options={
              tambonsOptions?.items?.map((item) => ({
                value: item.name_th,
                id: item.id,
              })) || []
            }
            value={selectionTambon?.value || ""}
            onChange={(value) => {
              setSelectionTambon(value);
            }}
            helperText={formLocal?.formState?.errors?.tombon_id?.message || ""}
            color={
              (Boolean(formLocal?.formState?.errors?.tombon_id?.message) &&
                "failure") ||
              undefined
            }
            placeholder="ตำบล"
            disabled={tambonsOptions?.items?.length === 0}
          />
        </div>
      </div>
      <div>
        <div>
          <Label
            htmlFor="zipcode"
            color={
              (Boolean(formLocal?.formState?.errors?.postcode?.message) &&
                "failure") ||
              undefined
            }
          >
            รหัสไปรษณีย์ :
          </Label>
        </div>
        <div>
          <Downshift
            options={
              tambonsOptions?.items?.map((item) => ({
                value: `${item.zip_code}`,
                id: item.id,
              })) || []
            }
            value={selectionZipcode?.value || ""}
            onChange={(value) => {
              setSelectionZipcode(value);
            }}
            helperText={formLocal?.formState?.errors?.postcode?.message || ""}
            color={
              (Boolean(formLocal?.formState?.errors?.postcode?.message) &&
                "failure") ||
              undefined
            }
            placeholder="รหัสไปรษณีย์"
            disabled={tambonsOptions?.items?.length == 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
