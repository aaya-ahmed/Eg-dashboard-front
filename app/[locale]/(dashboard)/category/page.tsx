"use client"
import { useState } from 'react';
import { Notification } from '@shared/notification';
import UnitService from '../../../../services/category.service';
import { category } from './model';
import FormComponent from './form';
import ListComponent from './List';
import { useTranslations } from 'next-intl';
const Service = new UnitService();
const NewsComponent = () => {
    const [ShowForm, SetShowForm] = useState<boolean>(false)
    const [selectedData, SetSelectedData] = useState<category | null>(null)
    const [refetch, SetRefetch] = useState<boolean>(true);
    const t = useTranslations("operation");

    const confirmDelete = () => {
        if (selectedData?.id)
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
            <section style={{ height: '100%' }}>
                {!ShowForm && <div className={`btn-group`}>
                    <button className={`add-btn`} onClick={() => { SetSelectedData(null); SetShowForm(true) }}>{t('add')}</button>
                    <button className={`edit-btn`} disabled={!selectedData} onClick={() => SetShowForm(true)}>{t('edit')}</button>
                    <button className={`delete-btn`} disabled={!selectedData} onClick={confirmDelete}>{t('delete')}</button>
                </div>}

                {!ShowForm && <ListComponent setRefetch={SetRefetch} selectedData={selectedData} setSelectedData={SetSelectedData} refetch={refetch} />}
                {ShowForm && <FormComponent setRefetch={SetRefetch} setData={SetSelectedData} setShowForm={SetShowForm} data={selectedData} />}

            </section>
        </>
    );
};
export default NewsComponent;
