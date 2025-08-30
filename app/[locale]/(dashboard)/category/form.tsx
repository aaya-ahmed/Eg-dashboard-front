"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Notification } from "@shared/notification";
import CategoryService from "../../../../services/category.service";
import FormContainer from "../Components/formContainer";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";


interface Category {
  id: number;
  createdDate: string;
  name: string;
  nameEn: string;
}

const FormComponent = ({
  data,
  setData,
  setShowForm,
  setRefetch
}: {
  data: Category | null;
  setData: (data: Category | null) => void;
  setShowForm: (data: any) => void;
  setRefetch:(value:boolean)=>void
}) => {
  const t = useTranslations("category");
  const [isLoading, setIsLoading] = useState<boolean>();

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm({
    mode: "all",
    defaultValues: {
      id: data?.id ?? 0,
      createdDate: data?.createdDate?.substring(0, 10) ?? new Date().toISOString(),
      name: data?.name ?? "",
      nameEn: data?.nameEn ?? "",
    },
  });

  const submit = (e: any) => {
    setIsLoading(true);
    if (data) {
      new CategoryService()
        .Put(e)
        .then(() => {
          setData(null);
          setShowForm(false);
          setIsLoading(false);
          setRefetch(true)
          Notification({ title: t("success"), type: "success" });
        })
        .catch(() => {
          setIsLoading(false);
          Notification({ title: t("error"), type: "error" });
        });
    } else {
      new CategoryService()
        .Post(e)
        .then(() => {
          setData(null);
          setShowForm(false);
          setIsLoading(false);
          setRefetch(true)
          Notification({ title: t("success"), type: "success" });
        })
        .catch(() => {
          setIsLoading(false);
          Notification({ title: t("error"), type: "error" });
        });
    }
  };

  return (
    <FormContainer
      header={data ? t("updateCategory") : t("addCategory")}
      isAdd={!!data}
    >
        
      <button
        type="button"
        className="return-btn"
        onClick={() => {
          setShowForm(false);
          setData(null);
        }}
      >
        {t("cancel")}
      </button>
      <>

      <form method="post" onSubmit={handleSubmit(submit)} id="categoryForm">
        <div className="input-group">
          {/* Name */}
          <div className="input-field">
            <label className="input-label" htmlFor="name">
              {t("name")}
            </label>
            <input
              id="name"
              type="text"
              className={errors?.name ? "is-invalid" : ""}
              {...register("name", {
                required: t("required"),
                maxLength: { value: 25, message: t("nameMaxLength") },
              })}
            />
            {errors.name && <span className="invalid">{errors.name.message}</span>}
          </div>

          {/* Name (English) */}
          <div className="input-field">
            <label className="input-label" htmlFor="nameEn">
              {t("nameEn")}
            </label>
            <input
              id="nameEn"
              type="text"
              className={errors?.nameEn ? "is-invalid" : ""}
              {...register("nameEn", {
                required: t("required"),
                maxLength: { value: 25, message: t("nameEnMaxLength") },
              })}
            />
            {errors.nameEn && (
              <span className="invalid">{errors.nameEn.message}</span>
            )}
          </div>
        </div>

      </form>
        {isLoading && <Loader />}
        {!isLoading && (
          <div className="btn-group" style={{paddingInline:'0'}}>
            <input
              type="submit"
              form="categoryForm"
              disabled={!isValid}
              className={data ? 'btn edit-btn' : 'btn add-btn'}
              value={data ? t("updateButton") : t("addButton")}
            />
          </div>
        )}
      </>
    </FormContainer>
  );
};


export default FormComponent;