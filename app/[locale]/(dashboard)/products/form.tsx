import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notification } from "@shared/notification";
import { status } from "../../../../const/status";
import { ImageFormComponent } from "@shared/image/imageForm";
import { product } from "./model";
import CategoryService from "../../../../services/category.service";
import ProductService from "../../../../services/products.service";
import FormContainer from "../Components/formContainer";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
const service = new ProductService()
const ProductFormComponent = ({ data, setData, setShowForm ,setRefetch}: { data: product | null, setData: (data: product | null) => void, setShowForm: (data: any) => void ,setRefetch:(value:boolean)=>void}) => {
    const t = useTranslations("product");
    const [isLoading, setIsLoading] = useState<boolean>();
    const [ref, setRef] = useState<boolean>(true);

    const [category, setCategory] = useState<any[] | null>(null)
    const {
        handleSubmit,
        formState: { errors, isValid },
        register,
        setValue,
        watch
    } = useForm({
        mode: 'all', defaultValues: {
            id: data?.id ?? 0,
            createdDate: data?.createdDate.substring(0, 10) ?? new Date().toISOString(),
            name: data?.name ?? '',
            nameEn: data?.nameEn ?? '',
            description: data?.description ?? '',
            descriptionEn: data?.descriptionEn ?? '',
            discount: data?.discount ?? 0,
            priceAfterDiscount: data?.priceAfterDiscount ?? 0,
            quantity: data?.quantity ?? 0,
            unitPrice: data?.unitPrice ?? 0,
            categoryId: data?.categoryId ?? 0,
            categoryName: data?.categoryName ?? '',

        }
    });
    const unitPrice = watch('unitPrice');
    const discount = watch('discount')
    const [images, setImage] = useState<{
        file?: File | null,
        id: number,
        name: string,
        attachmentUrl: string,
        isMain: boolean,
        status: number
    }[]>([]);
    useEffect(() => {
        if (ref) {

            new CategoryService().GetNames().then(res => {
                setCategory(res.data)
            });
            if (data && data.id) {
                (async () => {
                    const result = await service.GetById(data?.id ?? 0);
                    setData(result.data);
                    if (result.data.attachments?.length > 0) {
                        for (let i = 0; i < result.data.attachments.length; i++) {
                            images.push({
                                id: result.data.attachments[i].id,
                                file: null,
                                name: result.data.attachments[i].name,
                                attachmentUrl: result.data.attachments[i].attachmentUrl,
                                isMain: result.data.attachments[i].isMain,
                                status: -1
                            });
                        }
                        setImage(images)
                    }
                })();
            }
            setRef(false)
        }
    }, [])
    useEffect(() => {
        setValue('priceAfterDiscount',
            unitPrice - (unitPrice * discount / 100));
    }, [unitPrice, discount]);
    const submit = (e: any) => {
        setIsLoading(true)
        const formData = new FormData();
        const newImages = images.filter(p => p.status >= 0)
        for (let i = 0; i < newImages.length; i++) {

            formData.append(`attachments[${i}].id`, `${newImages[i].id}`);
            const file = newImages[i]?.file;
            if (file) {
                formData.append(`attachments[${i}].attachmentFile`, file);
            }
            formData.append(`attachments[${i}].name`, newImages[i].file?.name ?? newImages[i].name)
            newImages[i].status != null && formData.append(`attachments[${i}].status`, `${newImages[i].status}`)
            i == 0 && formData.append(`attachments[${i}].isMain`, `${true}`)

        }
        delete e.attachments;
        for (const key in e) {
            formData.append(key, e[key].toString())
        }

        const request = !!data
            ? new ProductService().PutWithFile(formData)
            : new ProductService().PostWithFile(formData);
        request
            .then(() => {
                setData(null);
                setShowForm(false);
                setIsLoading(false);
                setRefetch(true)
                Notification({
                    title: t("success"),
                    type: "success",
                });
            })
            .catch(() => {
                setIsLoading(false);
                Notification({
                    title: t("error"),
                    type: "error",
                });
            });
    }

    return (
        <FormContainer header={data ? t("updateProduct") : t("addProduct")} isAdd={!!data}>
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
                <form onSubmit={handleSubmit(submit)} id="productForm">
                    {/* Category */}
                    <div className="input-group">
                        <div className="input-field">
                            <label className="input-label" htmlFor="categoryId">{t("category")}</label>
                            <select
                                id="categoryId"
                                className={errors?.categoryId ? "is-invalid" : ""}
                                {...register("categoryId", { required: t("categoryRequired") })}
                            >
                                {category?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="invalid">{errors.categoryId.message}</span>}
                        </div>
                    </div>

                    {/* Name & NameEn */}
                    <div className="input-group">
                        <div className="input-field">
                            <label className="input-label" htmlFor="name">{t("name")}</label>
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
                        <div className="input-field">
                            <label className="input-label" htmlFor="nameEn">{t("nameEn")}</label>
                            <input
                                id="nameEn"
                                type="text"
                                className={errors?.nameEn ? "is-invalid" : ""}
                                {...register("nameEn", {
                                    required: t("required"),
                                    maxLength: { value: 25, message: t("nameEnMaxLength") },
                                })}
                            />
                            {errors.nameEn && <span className="invalid">{errors.nameEn.message}</span>}
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-field">
                            <label className="input-label" htmlFor="description">{t("description")}</label>
                            <textarea
                                id="description"
                                rows={8}
                                className={errors?.description ? "is-invalid" : ""}
                                {...register("description", {
                                    required: t("required"),
                                    maxLength: { value: 700, message: t("descriptionMaxLength") },
                                })}
                            />
                            {errors.description && <span className="invalid">{errors.description.message}</span>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="input-group">

                        <div className="input-field">
                            <label className="input-label" htmlFor="descriptionEn">{t("descriptionEn")}</label>
                            <textarea
                                id="descriptionEn"
                                rows={8}
                                className={errors?.descriptionEn ? "is-invalid" : ""}
                                {...register("descriptionEn", {
                                    required: t("required"),
                                    maxLength: { value: 700, message: t("descriptionEnMaxLength") },
                                })}
                            />
                            {errors.descriptionEn && (
                                <span className="invalid">{errors.descriptionEn.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Prices & Quantity */}
                    <div className="input-group">
                        <div className="input-field">
                            <label className="input-label" htmlFor="unitPrice">{t("unitPrice")}</label>
                            <input
                                id="unitPrice"
                                type="number"
                                step="0.01"
                                {...register("unitPrice", { required: t("required"), valueAsNumber: true })}

                            />
                            {errors.unitPrice && <span className="invalid">{errors.unitPrice.message}</span>}
                        </div>

                        <div className="input-field">
                            <label className="input-label" htmlFor="discount">{t("discount")}</label>
                            <input
                                id="discount"
                                type="number"
                                step="0.01"
                                {...register("discount", { required: t("required"), valueAsNumber: true })}
                            />
                            {errors.discount && <span className="invalid">{errors.discount.message}</span>}
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <label className="input-label" htmlFor="priceAfterDiscount">{t("priceAfterDiscount")}</label>
                            <input
                                id="priceAfterDiscount"
                                type="number"
                                disabled
                                step="0.01"
                                {...register("priceAfterDiscount", { required: t("required"), valueAsNumber: true })}
                            />
                            {errors.priceAfterDiscount && <span className="invalid">{errors.priceAfterDiscount.message}</span>}
                        </div>

                        <div className="input-field">
                            <label className="input-label" htmlFor="quantity">{t("quantity")}</label>
                            <input
                                id="quantity"
                                type="number"
                                step="0.001"
                                {...register("quantity", { required: t("required"), valueAsNumber: true })}
                            />
                            {errors.quantity && <span className="invalid">{errors.quantity.message}</span>}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="input-field">
                        <label className="input-label">{t("images")}</label>
                        <ImageFormComponent images={images} setImage={setImage} />
                    </div>

                </form>
                {isLoading && <Loader />}
                {!isLoading && (
                    <div className="btn-group" style={{ paddingInline: '0' }}>
                        <input
                            type="submit"
                            form="productForm"
                            disabled={!(isValid)}
                            className={"submit-form"}
                            value={data ? t("updateButton") : t("addButton")}
                        />
                    </div>
                )}
            </>
        </FormContainer>
    );

}
export default ProductFormComponent;