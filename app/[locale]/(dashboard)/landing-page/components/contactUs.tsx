"use client";
import { useEffect, useRef, useState } from "react";
import LandingService from "../../../../../services/landing.service";
import { useForm, useFieldArray } from "react-hook-form";
import { Map, MapPin, Phone } from "lucide-react";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";
import styles from '@styles/dashboard/acheivementform.module.scss'
import { useApi } from "@/hooks/request";

const service = new LandingService();

type Contact = {
    location: string;
    address: string;
    phone: string;
};

type ContactForm = {
    contacts: Contact[];
};

export default function ContactUsFormComponent() {
    const t = useTranslations("contact");
    const ref = useRef<boolean>(false);
    const {
        control,
        getValues,
        setValue,
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ContactForm>({
        mode: "all",
        defaultValues: {
            contacts: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "contacts",
    });
    const { execute, loading } = useApi();

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            service.Get("contactUs").then((res) => {
                if (res?.contacts?.length) {
                    setValue("contacts", res.contacts);
                }
            });
        }
    }, []);

    const submit = async (e: any) => {
        await execute({ serviceFunc: service.Post, successMessage: t('success'), errorMessage: t('error') }, "contactUs", {
            key: "contactUs",
            value: getValues(),
        })
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            {fields.map((field, index) => (
                <div key={field.id} className={`input-group ${styles['input-group']}`}>
                    <button
                        type="button"
                        className={` btn remove-button ${styles['btn']}`}
                        onClick={() => remove(index)}
                    >
                        {t("remove")}
                    </button>
                    {/* Address */}
                    <div className="input-field">
                        <label className="input-label-absolute">
                            <Map size={20} stroke="green" />
                        </label>
                        <input
                            type="text"
                            placeholder={t("address")}
                            {...register(`contacts.${index}.address`, {
                                maxLength: {
                                    value: 150,
                                    message: t("validation.maxLength150"),
                                },
                            })}
                        />
                        {errors.contacts?.[index]?.address && (
                            <span className="invalid">
                                {errors.contacts[index]?.address?.message}
                            </span>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="input-field">
                        <label className="input-label-absolute">
                            <Phone size={20} stroke="blue" />
                        </label>
                        <input
                            type="text"
                            placeholder={t("phone")}
                            {...register(`contacts.${index}.phone`, {
                                maxLength: {
                                    value: 15,
                                    message: t("validation.maxLength15"),
                                },
                            })}
                        />
                        {errors.contacts?.[index]?.phone && (
                            <span className="invalid">
                                {errors.contacts[index]?.phone?.message}
                            </span>
                        )}
                    </div>

                    {/* Location */}
                    <div className="input-field">
                        <label className="input-label-absolute">
                            <MapPin size={20} stroke="red" />
                        </label>
                        <input
                            type="text"
                            placeholder={t("location")}
                            {...register(`contacts.${index}.location`)}
                        />
                        {errors.contacts?.[index]?.location && (
                            <span className="invalid">
                                {errors.contacts[index]?.location?.message}
                            </span>
                        )}
                    </div>


                </div>
            ))}

            <div className="btn-group">
                {loading ?<Loader />:
                 (<>
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() =>
                            append({ location: "", address: "", phone: "" })
                        }
                    >
                        {t("addContact")}
                    </button>
                    <input
                        type="submit"
                        value={t("save")}
                        disabled={!isValid}
                        className="submit-form"
                    />
                </>
                )}
            </div>

        </form>
    );
}
