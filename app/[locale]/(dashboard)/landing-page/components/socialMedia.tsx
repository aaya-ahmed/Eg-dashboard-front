"use client";
import { useEffect, useState } from "react";
import LandingService from "../../../../../services/landing.service";
import styles from "@styles/dashboard/acheivementform.module.scss";
import { useForm } from "react-hook-form";
import { Facebook, Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/request";

const service = new LandingService();

type SocialMedia = {
  whatsApp: string;
  facebook: string;
  instagram: string;
  linkedIn: string;
  youtube: string;
};

export default function SocialFormComponent() {
  const t = useTranslations("socialMedia");
  const { execute, loading } = useApi();
  const {
    getValues,
    setValue,
    register,
    formState: { errors, isValid },
  } = useForm<SocialMedia>({
    mode: "all",
    defaultValues: {
      whatsApp: "",
      facebook: "",
      instagram: "",
      linkedIn: "",
      youtube: "",
    },
  });

  useEffect(() => {
    service.Get("SocialMedia").then((res) => {
      if (res) {
        setValue("whatsApp", res.whatsApp ?? "");
        setValue("facebook", res.facebook ?? "");
        setValue("instagram", res.instagram ?? "");
        setValue("linkedIn", res.linkedIn ?? "");
        setValue("youtube", res.youtube ?? "");
      }
    });
  }, [setValue]);

  const submit = (e: any) => {
    e.preventDefault();
    execute({ serviceFunc: service.Post,
       errorMessage: t("error"),
        successMessage: t("success") }, 
        "SocialMedia", { key: "SocialMedia", value: getValues() });
  };

  return (
    <form onSubmit={submit}>
      {/* WhatsApp */}
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="whatsApp" className="input-label-absolute">
            <MessageCircle size={20} stroke="green" />
          </label>
          <input
            type="text"
            id="whatsApp"
            {...register("whatsApp", {
              maxLength: {
                value: 15,
                message: t("maxLength"),
              },
            })}
          />
        </div>
        {errors.whatsApp && <span className="invalid">{errors.whatsApp.message}</span>}
      </div>

      {/* Facebook */}
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="facebook" className="input-label-absolute">
            <Facebook size={20} stroke="blue" />
          </label>
          <input
            type="text"
            id="facebook"
            {...register("facebook", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
                message: t("invalidUrl"),
              },
            })}
          />
        </div>
        {errors.facebook && <span className="invalid">{errors.facebook.message}</span>}
      </div>

      {/* Instagram */}
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="instagram" className="input-label-absolute">
            <Instagram size={20} stroke="red" />
          </label>
          <input
            type="text"
            id="instagram"
            {...register("instagram", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/,
                message: t("invalidUrl"),
              },
            })}
          />
        </div>
        {errors.instagram && <span className="invalid">{errors.instagram.message}</span>}
      </div>

      {/* LinkedIn */}
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="linkedIn" className="input-label-absolute">
            <Linkedin size={20} stroke="black" />
          </label>
          <input
            type="text"
            id="linkedIn"
            {...register("linkedIn", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/,
                message: t("invalidUrl"),
              },
            })}
          />
        </div>
        {errors.linkedIn && <span className="invalid">{errors.linkedIn.message}</span>}
      </div>

      {/* Youtube */}
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="youtube" className="input-label-absolute">
            <Youtube size={20} stroke="red" />
          </label>
          <input
            type="text"
            id="youtube"
            {...register("youtube", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                message: t("invalidUrl"),
              },
            })}
          />
        </div>
        {errors.youtube && <span className="invalid">{errors.youtube.message}</span>}
      </div>

      {/* Actions */}
      <div className="btn-group">
        {loading ? (
          <Loader />
        ) : (
          <input
            type="submit"
            value={t("save")}
            disabled={!isValid}
            className="submit-form"
          />
        )}
      </div>
    </form>
  );
}
