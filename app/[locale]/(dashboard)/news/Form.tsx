import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notification } from "@shared/notification";
import { status } from "../../../../const/status";
import NewService from "../../../../services/news.service";
import { ImageFormComponent } from "@shared/image/imageForm";
import { news } from "./News.type";
import FormContainer from "../Components/formContainer";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";

const NewsFormComponent = ({ data, setData, setShowForm ,setRefetch}: { data: news | null, setData: (data: news | null) => void, setShowForm: (data: any) => void,setRefetch:(value:boolean)=>void }) => {
  const t = useTranslations('news');
  const [isLoading, setIsLoading] = useState<boolean>();
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm({
    mode: 'all', defaultValues: {
      id: data?.id ?? 0,
      createdDate: data?.createdDate.substring(0, 10) ?? new Date().toISOString(),
      title: data?.title ?? '',
      titleEn: data?.titleEn ?? '',
      description: data?.description ?? '',
      descriptionEn: data?.descriptionEn ?? ''

    }
  });
  const [images, setImage] = useState<{
    file?: File | null,
    id: number,
    name: string,
    attachmentUrl: string,
    isMain: boolean,
    status: number
  }[]>([]);
  const [IsValid, setIsValid] = useState<boolean>()
  useEffect(() => {
    if (data) {
      if (data.attachments?.length > 0) {
        for (let i = 0; i < data.attachments.length; i++) {
          images.push({
            id: data.attachments[i].id,
            file: null,
            name: data.attachments[i].name,
            attachmentUrl: data.attachments[i].attachmentUrl,
            isMain: data.attachments[i].isMain,
            status: -1
          })
        }
        setImage(data.attachments)
      }
    }
  }, [data])
  useEffect(() => {
    setIsValid(images.length - images.filter(p => p.status == status.Delete).length > 0);
  }, [images])

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
    const service = new NewService();
    const action = data ? service.PutWithFile : service.PostWithFile;

    action.call(service, formData)
      .then(() => {
        setData(null);
        setShowForm(false);
        setIsLoading(false);
        setRefetch(true)
        Notification({
          title: t('success'),
          type: 'success',
        });
      })
      .catch(() => {
        setIsLoading(false);
        Notification({
          title: t('error'),
          type: 'error',
        });
      });
  }
  return (
    <FormContainer header={data ? t('editTitle') : t('addTitle')} isAdd={!!data}>
      <button
        type="button"
        className="return-btn"
        onClick={() => {
          setShowForm(false);
          setData(null);
        }}
      >
        {t('back')}
      </button>
      <form  onSubmit={handleSubmit(submit)}>
        <div className="input-group">
          <div className="input-field">
            <input
              id="title"
              placeholder={t('titlePlaceholder')}
              className={errors?.title ? 'is-invalid' : ''}
              type="text"
              {...register('title', {
                required: t('titleRequired'),
                maxLength: {
                  value: 50,
                  message: t('titleMax'),
                },
              })}
            />
            {errors.title?.ref && <span className="invalid">{errors.title.message}</span>}
          </div>

          <div className="input-field">
            <input
              id="titleEn"
              placeholder={t('titleEn')}
              className={errors?.titleEn ? 'is-invalid' : ''}
              type="text"
              {...register('titleEn', {
                required: t('titleRequired'),
                maxLength: {
                  value: 50,
                  message: t('titleMax'),
                },
              })}
            />
            {errors.titleEn?.ref && <span className="invalid">{errors.titleEn.message}</span>}
          </div>
        </div>

        <div className="input-group">
          <div className="input-field">
            <textarea
              id="description"
              placeholder={t('descriptionPlaceholder')}
              rows={10}
              className={errors?.description ? 'is-invalid' : ''}
              {...register('description', {
                required: t('descriptionRequired'),
              })}
            />
            {errors.description?.ref && <span className="invalid">{errors.description.message}</span>}
          </div>

          <div className="input-field">
            <textarea
              id="descriptionEn"
              placeholder={t('descriptionEn')}
              rows={10}
              className={errors?.descriptionEn ? 'is-invalid' : ''}
              {...register('descriptionEn', {
                required: t('descriptionEnRequired'),
              })}
            />
            {errors.descriptionEn?.ref && <span className="invalid">{errors.descriptionEn.message}</span>}
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="images" className="form-label">{t('imagesLabel')}</label>
          <ImageFormComponent images={images} setImage={setImage} />
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="btn-group">
            <input
              type="submit"
              disabled={!(IsValid && isValid)}
              className={data ? 'btn edit-btn' : 'btn add-btn'}
              value={data ? t('submitEdit') : t('submitAdd')}
            />
          </div>
        )}
      </form>
    </FormContainer>
  );

}
export default NewsFormComponent;