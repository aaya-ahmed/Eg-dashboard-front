"use client"
import { Notification } from '@shared/notification';
import { solution } from "./solution.type";
import SolutionService from '../../../../services/solution.service';
import { useState } from 'react';
import SolutionForm from './Form';
import SolutionList from './List';
import { useTranslations } from 'next-intl';
const Service = new SolutionService();
const SolutionsComponent = () => {
    const [ShowForm, SetShowForm] = useState<boolean>(false)
    const [selectedData, SetSelectedData] = useState<solution | null>(null)
    const [refetch, SetRefetch] = useState<boolean>(true);
    const t= useTranslations("operation");
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
            <section >
                    {!ShowForm && <div className={`btn-group`}>
                        <button className={`add-btn`} onClick={() => { SetSelectedData(null); SetShowForm(true) }}>{t('add')}</button>
                        <button className={`edit-btn`} disabled={!selectedData} onClick={() => SetShowForm(true)}>{t('edit')}</button>
                        <button className={`delete-btn`} disabled={!selectedData} onClick={confirmDelete}>{t('delete')}</button>
                    </div>}

                    {ShowForm && <SolutionForm setRefetch={SetRefetch} setData={SetSelectedData} setShowForm={SetShowForm} data={selectedData} />}
                    {!ShowForm && <SolutionList selectedData={selectedData} setSelectedData={SetSelectedData} refetch={refetch} setRefresh={SetRefetch} />}

            </section>
        </>
    );
};
export default SolutionsComponent;
