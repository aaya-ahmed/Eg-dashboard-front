"use client";
import { useEffect, useRef, useState } from "react";
import LandingService from "../../../../../services/landing.service";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import styles from '@styles/dashboard/acheivementform.module.scss'
import AttachmentService from "@/services/attachments.service";
import upload from '@public/upload.webp'
import Image from "next/image";
import { useApi } from "@/hooks/request";

type Achievement = {
    label: string;
    labelEn: string;
    value: number;
    icon?: File | string | null;
    exist?: string | null;
};

type FormValues = {
    achievements: Achievement[];
};

const attachmentService = new AttachmentService();
const service = new LandingService();


export default function AchievementForm() {
    const t = useTranslations("achievementForm");
    const ref = useRef<boolean>(false);
    const {
        control,
        register,
        watch,
        handleSubmit,
        setValue,
    } = useForm<FormValues>({
        mode: "all",
        defaultValues: {
            achievements: [],
        },
    });
    const { execute, loading } = useApi();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "achievements",
    });
    const watchedItems = watch("achievements");

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            service.Get("achievements").then((res) => {
                if (res) {
                    console.log(res);
                    res.forEach((element: Achievement) => {
                        append({
                            ...element,
                            exist: element.icon?.toString() ? element.icon.toString() : "",
                        });
                    });
                }
            });
        }
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            const updatedAchievement: Achievement[] = [];
            for (let i = 0; i < data.achievements.length; i++) {
                const achievement = data.achievements[i];
                const index = i;
                if ((achievement.exist && achievement.icon instanceof File)) {
                    const result = await execute({ serviceFunc: attachmentService.PutWithFile }, {
                        name: achievement.exist?.split('/').pop(),
                        folderName: "achievements",
                        attachmentFile: achievement.icon,
                        attachmentUrl: achievement.exist,
                        isMain: true,
                        status: 1,
                    });
                    updatedAchievement.push({
                        ...achievement,
                        icon: result.data.attachmentUrl
                    });
                }
                else if ((!achievement.exist && achievement.icon instanceof File)) {
                    const result = await execute({ serviceFunc: attachmentService.PostWithFile }, {
                        name: "achievements",
                        folderName: "achievements",
                        AttachmentFile: achievement.icon,
                        isMain: true,
                        status: 0
                    });
                    updatedAchievement.push({
                        ...achievement,
                        icon: result.data.attachmentUrl
                    });
                } else {
                    updatedAchievement.push({
                        ...achievement,
                        icon:achievement.exist
                    });
                }
                if (index === data.achievements.length - 1) {
                    execute({ serviceFunc: service.Post, successMessage: t('success'), errorMessage: t('error') }, "achievements", {
                        key: "achievements",
                        value: updatedAchievement,
                    });
                }
            }
        } catch {

        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles['achievement-form']}>
            {fields.map((field, index) => {
                return (<div key={field.id} className={` ${styles['input-group']}`}>
                    <div className={`input-group`}>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className={` btn remove-button ${styles['btn']}`}
                        >
                            {t("remove")}
                        </button>
                        <div className={`${styles['input-field']} input-field`}>

                            <input
                                id={`photo-input-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden-input"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setValue(`achievements.${index}.icon`, file);
                                }}
                            />
                            <label htmlFor={`photo-input-${index}`} className={`image-label`}>
                                {watchedItems?.[index]?.icon ? (
                                    <img
                                        src={watchedItems[index].icon instanceof File ? URL.createObjectURL(watchedItems[index].icon) : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${watchedItems[index].exist}`}
                                        alt="Preview"
                                        width={'35px'}
                                        height={'35px'}
                                    />
                                ) : (
                                    <Image
                                        src={upload}
                                        alt="Preview"
                                        style={{ width: '35px', height: '35px' }}
                                    />
                                )}
                            </label>
                        </div>
                    </div>
                    <div className={`input-group`}>
                        <div className="input-field">
                            <label className="input-label-absolute">{t("label")}</label>
                            <input
                                type="text"
                                {...register(`achievements.${index}.label` as const)}
                            />
                        </div>
                        <div className="input-field">
                            <label className="input-label-absolute">{t("labelEn")}</label>
                            <input
                                type="text"
                                {...register(`achievements.${index}.labelEn` as const)}
                            />
                        </div>
                        <div className="input-field">
                            <label className="input-label-absolute">{t("value")}</label>
                            <input
                                type="number"

                                {...register(`achievements.${index}.value` as const, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                    </div>
                </div>
                );
            })}

            <div className="btn-group">
                <button
                    type="button"
                    onClick={() => append({ label: "", value: 0, icon: null,labelEn:'' })}
                    className="add-btn"

                >
                    {t("add")}
                </button>
                <button type="submit" className="submit-form" disabled={loading || fields.length == 0} >
                    {t("save")}
                </button>
            </div>
        </form>
    );
}
