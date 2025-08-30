"use client"
import { useState } from 'react';
import NewsListComponent from './List';
import NewsFormComponent from './Form';
import { Notification } from '@shared/notification';
import NewService from '../../../../services/news.service';
import { news } from './News.type';
import { useTranslations } from 'next-intl';
const Service = new NewService();
const NewsComponent = () => {
    const t = useTranslations('operation');
     const [ShowForm, SetShowForm] = useState<boolean>(false)
        const [selectedData, SetSelectedData] = useState<news|null>(null)
        const [refetch, SetRefetch] = useState<boolean>(true)
    const confirmDelete = () => {
        if(selectedData?.id)
        Service.Delete(selectedData?.id).then(res => {
            SetRefetch(true);
            SetSelectedData(null);
        }).catch(err => {
            Notification({
                title: t('error'),
                type: 'error'
            })
        });
    }
    return (
        <>
            <section >
        {!ShowForm && <div className={`btn-group`}>
                <button className={`add-btn`} onClick={() => { SetSelectedData(null); SetShowForm(true) }}>{t('add')}</button>
                <button className={`edit-btn`} disabled={!selectedData} onClick={() => SetShowForm(true)}>{t("edit")}</button>
                <button className={`delete-btn`} disabled={!selectedData} onClick={confirmDelete}>{t('delete')}</button>
            </div>}

                    {ShowForm && <NewsFormComponent setRefetch={SetRefetch} setData={SetSelectedData} setShowForm={SetShowForm} data={selectedData} />}
                    {!ShowForm && <NewsListComponent setRefetch={SetRefetch} selectedData={selectedData} setSelectedData={SetSelectedData} refetch={refetch} />}

            </section>
        </>
    );
};
export default NewsComponent;
