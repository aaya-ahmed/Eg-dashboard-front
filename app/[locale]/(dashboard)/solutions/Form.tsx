import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notification } from "@shared/notification";
import { ImageFormComponent } from "@shared/image/imageForm";
import { solution } from "./solution.type";
import SolutionService from "../../../../services/solution.service";
import FormContainer from "../Components/formContainer";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
const service = new SolutionService();

const SolutionFormComponent = ({
    data,
    setData,
    setShowForm,
    setRefetch,
}: {
    data: solution | null;
    setData: (data: solution | null) => void;
    setShowForm: (data: any) => void;
    setRefetch:(value:boolean)=>void
}) => {
    const t = useTranslations("solution");
    const [isLoading, setIsLoading] = useState<boolean>();
    const {
        handleSubmit,
        formState: { errors, isValid },
        register,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            id: 0,
            createdDate:
                data?.createdDate.substring(0, 10) ?? new Date().toISOString(),
            title: "",
            titleEn: "",
            problemSolution: "",
            problemSolutionEn: "",
            problem: "",
            problemEn: "",
            subTitle: "",
            subTitleEn: "",
        },
    });

    const [image, setImage] = useState<{
        file?: File | null;
        id: number;
        name: string;
        attachmentUrl: string;
        isMain: boolean;
        status: number;
    }>();

    useEffect(() => {
        if (data && data.id) {
            (async () => {
                const result = await new SolutionService().GetById(data?.id ?? 0);
                reset(result.data);
                if (result.data.photo)
                    setImage({
                        id: result.data.photo.id,
                        file: null,
                        name: result.data.photo.name,
                        attachmentUrl: result.data.photo.attachmentUrl,
                        isMain: result.data.photo.isMain,
                        status: -1,
                    });
            })();
        }
    }, []);
    const submit = (e: any) => {
        setIsLoading(true);
        const formData = new FormData();
        for (const key in e) {
            formData.append(key, e[key].toString());
        }
        if (!data && image?.file) {
            formData.append("image", image.file)
        }
        if (data && image?.file) {
            const image2 = {
                id: image?.id?.toString(),
                attachmentFile: image.file,
                name: image.name,
                attachmentUrl: image.attachmentUrl,
                isMain: image.isMain ? "true" : "false",
                status: data ? "1" : "0"
            }
            formData.append(`Image`, JSON.stringify(image2));
        }
        const request = !!data
            ? new SolutionService().PutWithFile(formData)
            : new SolutionService().PostWithFile(formData);
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
    };

    return (
        <FormContainer
            isAdd={!!data}
            header={data ? t("updateSolution") : t("addSolution")}
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

            <form onSubmit={handleSubmit(submit)}>
                {/* Title + TitleEn */}
                <div className="input-group">
                    <div className="input-field">
                        <label className="input-label" htmlFor="title">
                            {t("title")}
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title", {
                                required: t("required"),
                                maxLength: { value: 25, message: t("titleMaxLength") },
                            })}
                        />
                        {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </div>

                    <div className="input-field">
                        <label className="input-label" htmlFor="titleEn">
                            {t("titleEn")}
                        </label>
                        <input
                            type="text"
                            id="titleEn"
                            {...register("titleEn", {
                                required: t("required"),
                                maxLength: { value: 25, message: t("titleEnMaxLength") },
                            })}
                        />
                        {errors.titleEn && (
                            <span className="invalid">{errors.titleEn.message}</span>
                        )}
                    </div>
                </div>

                {/* SubTitle + SubTitleEn */}
                <div className="input-group">
                    <div className="input-field">
                        <label className="input-label" htmlFor="subTitle">
                            {t("subTitle")}
                        </label>
                        <input
                            type="text"
                            id="subTitle"
                            {...register("subTitle", {
                                required: t("required"),
                                maxLength: { value: 15, message: t("subTitleMaxLength") },
                            })}
                        />
                        {errors.subTitle && (
                            <span className="invalid">{errors.subTitle.message}</span>
                        )}
                    </div>

                    <div className="input-field">
                        <label className="input-label" htmlFor="subTitleEn">
                            {t("subTitleEn")}
                        </label>
                        <input
                            type="text"
                            id="subTitleEn"
                            {...register("subTitleEn", {
                                required: t("required"),
                                maxLength: { value: 15, message: t("subTitleEnMaxLength") },
                            })}
                        />
                        {errors.subTitleEn && (
                            <span className="invalid">{errors.subTitleEn.message}</span>
                        )}
                    </div>
                </div>

                {/* Problem + ProblemEn */}
                <div className="input-group">
                    <div className="input-field">
                        <label className="input-label" htmlFor="problem">
                            {t("problem")}
                        </label>
                        <textarea
                            id="problem"
                            {...register("problem", {
                                required: t("required"),
                                maxLength: { value: 100, message: t("problemMaxLength") },
                            })}
                        />
                        {errors.problem && (
                            <span className="invalid">{errors.problem.message}</span>
                        )}
                    </div>

                    <div className="input-field">
                        <label className="input-label" htmlFor="problemEn">
                            {t("problemEn")}
                        </label>
                        <textarea
                            id="problemEn"
                            {...register("problemEn", {
                                required: t("required"),
                                maxLength: { value: 100, message: t("problemEnMaxLength") },
                            })}
                        />
                        {errors.problemEn && (
                            <span className="invalid">{errors.problemEn.message}</span>
                        )}
                    </div>
                </div>

                {/* Problem Solution + Problem Solution En */}
                <div className="input-group">
                    <div className="input-field">
                        <label className="input-label" htmlFor="problemSolution">
                            {t("problemSolution")}
                        </label>
                        <textarea
                            id="problemSolution"
                            {...register("problemSolution", {
                                required: t("required"),
                                maxLength: { value: 1000, message: t("problemSolutionMaxLength") },
                            })}
                        />
                        {errors.problemSolution && (
                            <span className="invalid">{errors.problemSolution.message}</span>
                        )}
                    </div>

                    <div className="input-field">
                        <label className="input-label" htmlFor="problemSolutionEn">
                            {t("problemSolutionEn")}
                        </label>
                        <textarea
                            id="problemSolutionEn"
                            {...register("problemSolutionEn", {
                                required: t("required"),
                                maxLength: { value: 1000, message: t("problemSolutionEnMaxLength") },
                            })}
                        />
                        {errors.problemSolutionEn && (
                            <span className="invalid">{errors.problemSolutionEn.message}</span>
                        )}
                    </div>
                </div>

                {/* Image upload */}
                <div className="input-field">
                    <label htmlFor="images" className="input-label">
                        {t("images")}
                    </label>
                    <ImageFormComponent oneImage={image} setOneImage={setImage} />
                </div>

                {isLoading && <Loader />}
                {!isLoading && (
                    <div className="btn-group">
                        <input
                            type="submit"
                            disabled={!(isValid)}
                            className={data ? 'btn edit-btn' : 'btn add-btn'}

                            value={data ? t("updateButton") : t("addButton")}
                        />
                    </div>
                )}
            </form>

        </FormContainer>
    );
};

export default SolutionFormComponent;

