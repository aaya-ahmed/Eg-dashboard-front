import { useCallback, useEffect, useState } from "react";
import LandingService from "../../../../../services/landing.service"
import upload from '@public/upload.webp';
import Image from "next/image";
import styles from '@styles/dashboard/logoform.module.scss'
import AttachmentService from "../../../../../services/attachments.service";
import { Loader } from "@shared/loader/loader";
import { useApi } from "@/hooks/request";
import { useTranslations } from "next-intl";
const service = new LandingService();
const attachmentService = new AttachmentService();

export default function LogoFormComponent() {
    const t = useTranslations("common");
    const [image, setImage] = useState<any>();
    const setImageState = useCallback((newImage: any) => {
        setImage((prev: any) => {
            if (prev === newImage) return prev;
            return newImage;
        });
    }, []);
    const { execute, loading } = useApi();
    const [logo, setLogo] = useState<{
        key: 'logo',
        value: null | string
    }>();
    useEffect(() => {
        service.Get('logo').then(res => {
            if (res)
                setLogo({ key: 'logo', value: res })
        })
    }, []);
    const submit = async (e: any) => {
        e.preventDefault();
        try {
            if (!logo?.value) {
                const imageData = {
                    name: 'logo',
                    folderName: 'logo',
                    AttachmentFile: image,
                    isMain: true,
                    status: 0
                }
                const imageRes = await execute({ serviceFunc: attachmentService.PostWithFile, errorMessage: t('error') }, imageData)
                if (imageRes) {
                    setLogo({ key: 'logo', value: imageRes.data.attachmentUrl })
                    await execute({ serviceFunc: service.Post, errorMessage: t('error'), successMessage: t('success') }, 'logo', { key: 'logo', value: imageRes.data.attachmentUrl })
                }
                return
            }
            const imageData = {
                name:logo.value?.split('/').pop(),
                folderName: 'logo',
                attachmentFile: image,
                attachmentUrl: logo.value,
                isMain: true,
                status: 1
            }
            const imageRes = await execute({ serviceFunc: attachmentService.PutWithFile, errorMessage: t('error') }, imageData)
            if (imageRes) {
                setLogo({ key: 'logo', value: imageRes.data.attachmentUrl })
                await execute({ serviceFunc: service.Post, errorMessage: t('error'), successMessage: t('success') }, 'logo', { key: 'logo', value: imageRes.data.attachmentUrl })
            }
        } catch { }
    }
    return <>
        <form className={`${styles['logo-form']}`} onSubmit={submit}>
            <div className={`${styles['image']}`}>
                <label className={`${styles['image-label']}`} htmlFor="image">
                    {(image || !logo?.value) && <Image src={image ? URL.createObjectURL(image) : upload} alt='' width={'100'} height={'100'} />}
                    {logo?.value && !image && <Image src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${logo?.value}`} alt='' priority width={'100'} height={'100'} />}
                </label>
                <input type="file" name="image" accept="image/*" hidden id="image" onChange={e => e?.target?.files && e?.target?.files.length > 0 ? setImageState(e?.target?.files[0]) : ''} />
            </div>
            {loading ? <Loader />:
             <input type="submit" value="upload Image" className='submit-form'  />}
        </form>
    </>
}