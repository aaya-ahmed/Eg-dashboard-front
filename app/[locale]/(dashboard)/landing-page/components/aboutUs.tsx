"use client"
import { useEffect, useState } from "react";
import LandingService from "../../../../../services/landing.service"
import upload from '@public/upload.webp';
import Image from "next/image";
import AttachmentService from "../../../../../services/attachments.service";
import { useForm } from "react-hook-form";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/request";

const service = new LandingService();
const attachmentService = new AttachmentService();

type aboutUs = {
    title1: string,
    title1En: string,
    title2: string,
    title2En: string,
    description: string,
    descriptionEn: string,
    yearsOfExperience: number
}


export default function AboutUsFormComponent() {
    const t = useTranslations("aboutUs");
    const [image1, setImage1] = useState<any>();
    const [image2, setImage2] = useState<any>();
    const [aboutUs, setAboutUs] = useState<{
        key: 'aboutUs',
        value: {
            image1?: string,
            image2?: string,
            [key: string]: any
        }
    }>();
    const { execute, loading } = useApi();
    const { getValues, setValue, register, handleSubmit, formState: { errors, isValid } } = useForm<aboutUs>({
        mode: 'all',
        defaultValues: {
            title1: '',
            title1En: '',
            title2: '',
            title2En: '',
            description: "",
            descriptionEn: "",
            yearsOfExperience: 0
        }
    });

    useEffect(() => {
        service.Get('aboutUs').then(res => {
            if (res) {
                setAboutUs({ key: 'aboutUs', value: {image1:res.image1,image2:res.image2} });
                setValue('title1', res.title1 || '');
                setValue('title1En', res.title1En || '');
                setValue('title2', res.title2 || '');
                setValue('title2En', res.title2En || '');
                setValue('description', res.description || '');
                setValue('descriptionEn', res.descriptionEn || '');
                setValue('yearsOfExperience', res.yearsOfExperience || 0);
            }
        });
    }, []);


    const uploadImage = async (imageFile: File, imageName: string, existingUrl?: string) => {
        if (existingUrl) {
            return await execute({ serviceFunc: attachmentService.PutWithFile }, {
                name:existingUrl?.split('/').pop(),
                folderName: 'aboutUs',
                attachmentFile: imageFile,
                attachmentUrl: existingUrl,
                isMain: true,
                status: 1
            })
        } else {
            return await execute({ serviceFunc: attachmentService.PostWithFile }, {
                    name: `aboutUs-${imageName}`,
                    folderName: 'aboutUs',
                    AttachmentFile: imageFile,
                    isMain: true,
                    status: 0
                });
            }
    };

        const submit = async () => {
            try {
                const formData = getValues();
                let image1Url = aboutUs?.value?.image1;
                let image2Url = aboutUs?.value?.image2;

                if (image1) {
                    const response = await uploadImage(image1, 'image1', image1Url);
                    image1Url = response.data.attachmentUrl;
                }
                if (image2) {
                    const response = await uploadImage(image2, 'image2', image2Url);
                    image2Url = response.data.attachmentUrl;
                }

                const updatedData = {
                    ...formData,
                    image1: image1Url,
                    image2: image2Url
                };
                await execute({serviceFunc:service.Post},'aboutUs', { key: 'aboutUs', value: updatedData });
                setAboutUs({ key: 'aboutUs', value: updatedData });

            } catch (error) {
                console.error('Error saving about us data:', error);
            }
        };

        return (
            <>
                <form onSubmit={handleSubmit(submit)}>
                    <div className={`images-container`}>
                        <div className={`image`}>
                            <label className={`image-label`} htmlFor="image1">
                                {(image1 || !aboutUs?.value?.image1) && (
                                    <Image
                                        src={image1 ? URL.createObjectURL(image1) : upload}
                                        alt='Image 1'
                                        width={'200'}
                                        height={'200'}
                                    />
                                )}
                                {aboutUs?.value?.image1 && !image1 && (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${aboutUs?.value?.image1}`}
                                        alt='Image 1'
                                        priority
                                        width={'200'}
                                        height={'200'}
                                    />
                                )}
                            </label>
                            <input
                                type="file"
                                name="image1"
                                accept="image/*"
                                hidden
                                id="image1"
                                onChange={e => e?.target?.files && e?.target?.files.length > 0 ? setImage1(e?.target?.files[0]) : ''}
                            />
                            <span className='image-caption'>{t("image1")}</span>
                        </div>

                        <div className={`image`}>
                            <label className={`image-label`} htmlFor="image2">
                                {(image2 || !aboutUs?.value?.image2) && (
                                    <Image
                                        src={image2 ? URL.createObjectURL(image2) : upload}
                                        alt='Image 2'
                                        width={'200'}
                                        height={'200'}
                                    />
                                )}
                                {aboutUs?.value?.image2 && !image2 && (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${aboutUs?.value?.image2}`}
                                        alt='Image 2'
                                        priority
                                        width={'200'}
                                        height={'200'}
                                    />
                                )}
                            </label>
                            <input
                                type="file"
                                name="image2"
                                accept="image/*"
                                hidden
                                id="image2"
                                onChange={e => e?.target?.files && e?.target?.files.length > 0 ? setImage2(e?.target?.files[0]) : ''}
                            />
                            <span className='image-caption'>{t("image2")}</span>
                        </div>
                    </div>

                    <div className={`input-group`}>
                        <div className={`input-field`}>
                            <label htmlFor="title1" className='input-label-absolute'>{t('firstTitle')}</label>
                            <input
                                type="text"
                                id="title1"
                                {...register("title1", { required: t("firstTitleIsRequired") })}
                            />
                            {errors.title1?.ref && <span className="invalid">{errors.title1.message}</span>}
                        </div>

                        <div className={`input-field`}>
                            <label htmlFor="title1En" className='input-label-absolute'>{t('title1En')}</label>
                            <input
                                type="text"
                                id="title1En"
                                {...register("title1En", { required: "First Title (English) is required" })}
                            />
                            {errors.title1En?.ref && <span className="invalid">{errors.title1En.message}</span>}
                        </div>
                    </div>

                    <div className={`input-group`}>
                        <div className={`input-field`}>
                            <label htmlFor="title2" className='input-label-absolute'>{t('title2')}</label>
                            <input
                                type="text"
                                id="title2"
                                {...register("title2", { required: t("secondTitleIsRequired") })}
                            />
                            {errors.title2?.ref && <span className="invalid">{errors.title2.message}</span>}
                        </div>

                        <div className={`input-field`}>
                            <label htmlFor="title2En" className='input-label-absolute'>{t('title2En')}</label>
                            <input
                                type="text"
                                id="title2En"
                                {...register("title2En", { required: t("secondTitleEnglishIsRequired") })}
                            />
                            {errors.title2En?.ref && <span className="invalid">{errors.title2En.message}</span>}
                        </div>
                    </div>

                    <div className={`input-group`}>
                        <div className={`input-field`}>
                            <label htmlFor="yearsOfExperience" className='input-label-absolute'>{t('yearsOfExperience')}</label>
                            <input
                                type="number"
                                id="yearsOfExperience"
                                min="0"
                                {...register("yearsOfExperience", {
                                    required: t("yearsOfExperienceIsRequired"),
                                    min: { value: 0, message: t("yearsOfExperienceMustBeNonNegative") }
                                })}
                            />
                            {errors.yearsOfExperience?.ref && <span className="invalid">{errors.yearsOfExperience.message}</span>}
                        </div>
                    </div>

                    <div className={`input-group`}>
                        <div className={`input-field`}>
                            <label htmlFor="description" className='input-label-absolute'>{t('description')}</label>
                            <textarea
                                id="description"
                                rows={5}
                                {...register("description", { required: t("descriptionIsRequired") })}
                            />
                            {errors.description?.ref && <span className="invalid">{errors.description.message}</span>}
                        </div>

                        <div className={`input-field`}>
                            <label htmlFor="descriptionEn" className='input-label-absolute'>{t('descriptionEn')}</label>
                            <textarea
                                id="descriptionEn"
                                rows={5}
                                {...register("descriptionEn", { required: t("descriptionEnglishIsRequired") })}
                            />
                            {errors.descriptionEn?.ref && <span className="invalid">{errors.descriptionEn.message}</span>}
                        </div>
                    </div>

                    {loading ? <Loader />:
                    <input type="submit" value={t('save')} disabled={!isValid} className='submit-form' />}
                </form>
            </>
        );
    }