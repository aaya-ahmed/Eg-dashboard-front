import { Fragment, useEffect, useState } from "react";
import LandingService from "../../../../../services/landing.service"
import { useFieldArray, useForm } from "react-hook-form";
import AttachmentService from "../../../../../services/attachments.service";
import styles from '@styles/dashboard/acheivementform.module.scss'

import upload from '@public/upload.webp'
import uploadV from '@public/uploadImage.jpg'

import Image from "next/image";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/request";
const attachmentService = new AttachmentService();

const service = new LandingService();
type Item = {
    video?: File;
    photo?: File;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    buttonLink: string;
    buttonText: string;
    buttonTextEn: string;
    photoUrl?: string,
    videoUrl?: string
};

type FormValues = {
    items: Item[];
};

export default function sliderFormComponent() {
    const t = useTranslations('slider')
    const { getValues, watch, control, setValue, register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
        defaultValues: {
            items: []
        }
    })
    const watchedItems = watch("items");
    const { fields, append, remove, update } = useFieldArray<FormValues>({
        control,
        name: "items"
    });
    const { execute, loading } = useApi();

    useEffect(() => {
        service.Get('Sliders').then(res => {
            if (res) {
                setValue('items', res.length > 0 ? res.map((p: Item) => ({ ...p, photoUrl: p.photo, videoUrl: p.video })) : [])
            }
        })
    }, []);

    const onSubmit = async (data: any) => {
        const value = getValues();

        try {
            await Promise.all(
                value.items.map(async (item) => {
                    if ((item.photoUrl && item.photo instanceof File) || (item.videoUrl && item.video instanceof File)) {
                        const result = await execute({ serviceFunc: attachmentService.PutWithFile }, {
                            name: item.photoUrl ? item.photoUrl?.split('/').pop() : item.videoUrl?.split('/').pop(),
                            folderName: 'Sliders',
                            AttachmentFile: item.photoUrl ?? item.videoUrl,
                            isMain: true,
                            status: 1
                        })
                        item.photo ? item.photoUrl = result.data.attachmentUrl : item.videoUrl = result.data.attachmentUrl;
                        item.photo ? item.photo = result.data.attachmentUrl : item.video = result.data.attachmentUrl;

                    } else if ((!item.photoUrl && item.photo instanceof File) || (!item.videoUrl && item.video instanceof File)) {
                        const result = await execute({ serviceFunc: attachmentService.PostWithFile }, {
                            name: 'Sliders',
                            folderName: 'Sliders',
                            AttachmentFile: item.photo ?? item.video,
                            isMain: true,
                            status: 0
                        })
                        item.photo ? item.photoUrl = result.data.attachmentUrl : item.videoUrl = result.data.attachmentUrl;
                        item.photo ? item.photo = result.data.attachmentUrl : item.video = result.data.attachmentUrl;

                    }
                })
            );
            await execute({ serviceFunc: service.Post,successMessage:t('success'),errorMessage:t('error') }, 'Sliders', { key: 'Sliders', value: value.items })
            if (value.items.length == 0)
                await execute({ serviceFunc: service.Post,successMessage:t('success'),errorMessage:t('error') }, 'Sliders', { key: 'Sliders', value: [] })
        } catch {

        }


    };
    return <>
        <form onSubmit={handleSubmit(onSubmit)} className={`${styles["slider-form"]}`}>
            {fields.map((field, index) => (
                <Fragment key={field.id}>
                    <div className={`input-group ${styles["input-group"]}`}>
                        <button type="button" className={` btn remove-button ${styles['btn']}`}
                            onClick={() => remove(index)}>
                            {t("Remove")}
                        </button>
                        {/* Video Input */}
                        <div className={`input-group `}>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <input
                                    id={`video-input-${index}`}
                                    type="file"
                                    accept="video/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setValue(`items.${index}.video`, file);
                                        setValue(`items.${index}.photo`, undefined);
                                    }}
                                />
                                <label htmlFor={`video-input-${index}`} className={styles["image-label"]}>
                                    {watchedItems?.[index]?.video ? (
                                        <video

                                            width="120"
                                            controls
                                            muted
                                        >
                                            <source src={
                                                watchedItems[index].video instanceof File
                                                    ? URL.createObjectURL(watchedItems[index].video)
                                                    : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${watchedItems[index].videoUrl}`
                                            } type="video/mp4" />
                                        </video>
                                    ) : (
                                        <Image src={uploadV} alt="Preview" />
                                    )}
                                </label>
                            </div>

                            {/* Photo Input */}
                            <div className={`input-field ${styles["input-field"]}`}>
                                <input
                                    id={`photo-input-${index}`}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setValue(`items.${index}.video`, undefined);
                                        setValue(`items.${index}.photo`, file);
                                    }}
                                />
                                <label htmlFor={`photo-input-${index}`} className={styles["image-label"]}>
                                    {watchedItems?.[index]?.photo ? (
                                        <img
                                            src={
                                                watchedItems[index].photo instanceof File
                                                    ? URL.createObjectURL(watchedItems[index].photo)
                                                    : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${watchedItems[index].photoUrl}`
                                            }
                                            alt="Preview"
                                        />
                                    ) : (
                                        <Image src={upload} alt="Preview" />
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Title AR/EN */}
                        <div className={` input-group`}>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("Title")} (AR)</label>
                                <input
                                    type="text"
                                    placeholder={t("TitleAr")}
                                    {...register(`items.${index}.title` as const, { required: true })}
                                />
                                {errors.items?.[index]?.title && (
                                    <span className="invalid">{errors.items[index].title?.message}</span>
                                )}
                            </div>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("Title")} (EN)</label>
                                <input
                                    type="text"
                                    placeholder={t("TitleEn")}
                                    {...register(`items.${index}.titleEn` as const, { required: true })}
                                />
                                {errors.items?.[index]?.titleEn && (
                                    <span className="invalid">{errors.items[index].titleEn?.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Description AR/EN */}
                        <div className={` input-group`}>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("Description")} (AR)</label>
                                <textarea
                                    placeholder={t("DescriptionAr")}
                                    {...register(`items.${index}.description` as const, { required: true })}
                                />
                            </div>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("Description")} (EN)</label>
                                <textarea
                                    placeholder={t("DescriptionEn")}
                                    {...register(`items.${index}.descriptionEn` as const, { required: true })}
                                />
                            </div>
                        </div>

                        {/* Button Text AR/EN */}
                        <div className={` input-group`}>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("ButtonText")} (AR)</label>
                                <input
                                    type="text"
                                    placeholder={t("ButtonTextAr")}
                                    {...register(`items.${index}.buttonText` as const, { required: true })}
                                />
                            </div>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("ButtonText")} (EN)</label>
                                <input
                                    type="text"
                                    placeholder={t("ButtonTextEn")}
                                    {...register(`items.${index}.buttonTextEn` as const, { required: true })}
                                />
                            </div>
                        </div>
                        {/* Button Link */}
                        <div className={` input-group`}>
                            <div className={`input-field ${styles["input-field"]}`}>
                                <label className="input-label-absolute">{t("ButtonLink")}</label>
                                <input
                                    type="text"
                                    placeholder={t("ButtonLink")}
                                    {...register(`items.${index}.buttonLink` as const, { required: true })}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Controls */}
                </Fragment>
            ))}
            <div className={`btn-group ${styles["btn-group"]}`}>

                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        append({
                            video: undefined,
                            photo: undefined,
                            title: "",
                            titleEn: "",
                            description: "",
                            descriptionEn: "",
                            buttonLink: "",
                            buttonText: "",
                            buttonTextEn: "",
                        })
                    }
                >
                    {t("AddNewItem")}
                </button>
                {loading ? <Loader />:
                 <input type="submit" className="submit-form" value={t("Save")} />}
            </div>

        </form>

    </>
}