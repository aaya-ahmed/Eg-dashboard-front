import { Fragment, useEffect, useState } from "react"
import styles from './image.module.scss'
import upload from '@public/upload.webp';
import { status } from "../../const/status";
import Image from "next/image";
export const ImageFormComponent = ({ images, setImage, setOneImage, oneImage }: {
    images?: {
        file?: File | null,
        id: number,
        name: string,
        attachmentUrl: string,
        isMain: boolean,
        status: number
    }[],
    oneImage?: {
        file?: File | null,
        id: number,
        name: string,
        attachmentUrl: string,
        isMain: boolean,
        status: number
    },
    setOneImage?: (data: {
        file?: File | null,
        id: number,
        name: string,
        attachmentUrl: string,
        isMain: boolean,
        status: number
    }) => void
    , setImage?: (data: {
        file?: File | null,
        id: number,
        name: string,
        attachmentUrl: string,
        isMain: boolean,
        status: number
    }[]) => void
}) => {

    const [isAdd, setIsAdd] = useState<boolean>(true)
    useEffect(() => {
        setIsAdd(images ? false : true)
        
    }, [])
    useEffect(
        () => { console.log(oneImage) }, [oneImage]
    )
    const AddToImages = (e: any) => {
        if (e.target.files[0].type.includes('image/'))
            if (images && setImage)
                setImage([...images, {
                    file: e.target.files[0],
                    id: images.length,
                    name: e.target.files[0].name,
                    attachmentUrl: '',
                    isMain: images.length == 0 ? true : false,
                    status: status.Add
                }])
            else if (setOneImage)
                setOneImage({
                    file: e.target.files[0],
                    id: 0,
                    name: oneImage?.name ? oneImage?.name : e.target.files[0].name,
                    attachmentUrl: oneImage?.attachmentUrl ? oneImage?.attachmentUrl : '',
                    isMain: true,
                    status: oneImage?.attachmentUrl ? status.Add : status.Update
                })
    }
    const RemoveFromImages = (id: number) => {
        if (setImage && images)
            isAdd ?
                setImage(images.filter(p => p.id != id)) :
                setImage(images.map(p => { if (p.id == id) p.status = status.Delete; return p }))
        if (setOneImage && oneImage)
            isAdd ?
                setOneImage(oneImage) :
                setOneImage({ ...oneImage, status: status.Delete })

    }
    return <div className={`${styles['container']}`}>
        {images ? <>
            <div>
                <label className={`${styles['image-label']}`} htmlFor="image">
                    <Image src={upload} alt='' />
                </label>
                <input type="file" name="image" accept="image/*" onChange={AddToImages} hidden id="image" />
            </div>
            {images?.map((item, index) => {
                return <Fragment key={`image-form-${index}`}>
                    {item.status != status.Delete &&
                        (
                            <div className={`${styles['image']}`}>
                                <Image src={item.file ? URL.createObjectURL(item.file) : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.attachmentUrl}`} alt='' priority width={'100'} height={'100'} />
                                <button type="button" onClick={() => RemoveFromImages(item.id)}>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        )
                    }
                </Fragment>
            })
            }</> :
            <>
                {
                    <div>
                        <label className={`${styles['image-label']}`} htmlFor="image">
                            <Image src={!oneImage?upload:oneImage.file ? URL.createObjectURL(oneImage.file) : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${oneImage.attachmentUrl}`} alt='' priority width={'100'} height={'100'} />
                        </label>
                        <input type="file" name="image" accept="image/*" onChange={AddToImages} hidden id="image" />
                    </div>
                }
            </>
        }
    </div>

}