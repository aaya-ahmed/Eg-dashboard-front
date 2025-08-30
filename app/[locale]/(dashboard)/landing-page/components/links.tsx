
"use client";
import { useEffect, useRef, useState } from "react";
import LandingService from "../../../../../services/landing.service";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import styles from '@styles/dashboard/acheivementform.module.scss'
import { useApi } from "@/hooks/request";

type link = {
    label: string;
    value: string;
};

type FormValues = {
    links: link[];
};

const service = new LandingService();


export default function LinkFormComponent() {
    const t = useTranslations("links");
    const ref = useRef<boolean>(false);
    const { execute, loading } = useApi();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm<FormValues>({
        mode: "all",
        defaultValues: {
            links: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'links',
    });

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            service.Get('links').then((res) => {
                if (res) {
                    res.forEach((element: link) => {
                        append(element);
                    });
                }
            });
        }
    }, []);

    const onSubmit = (data: FormValues) => {
        execute({ serviceFunc: service.Post, successMessage: t('success'), errorMessage: t('error') },
            'links', {
            key: 'links',
            value: data.links,
        })
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className={`input-group ${styles['input-group']}`}>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className={` btn remove-button ${styles['btn']}`}
                        >
                            {t("remove")}
                        </button>

                        <div className="input-field">
                            <label className="input-label-absolute">{t("label")}</label>
                            <input
                                type="text"
                                {...register(`links.${index}.label` as const, {
                                    required: t("required"),
                                })}
                            />
                            {errors?.links?.[index]?.label?.ref && <span className="invalid">{errors?.links?.[index]?.label?.message}</span>}
                        </div>
                        <div className="input-field">
                            <label className="input-label-absolute">{t("value")}</label>
                            <input
                                type="text"

                                {...register(`links.${index}.value` as const, {
                                    required: t("required"),
                                })}
                            />
                            {errors?.links?.[index]?.value?.ref && <span className="invalid">{errors?.links?.[index]?.value?.message}</span>}
                        </div>

                    </div>
                );
            })}

            <div className="btn-group">
                <button
                    type="button"
                    onClick={() => append({ label: "", value: '' })}
                    className="submit-form"
                >
                    {t("add")}
                </button>
                <button type="submit" className="submit-form" disabled={loading || fields.length === 0}>
                    {t("save")}
                </button>
            </div>
        </form>
    );
}
