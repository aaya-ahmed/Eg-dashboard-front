"use client"
import { useState } from 'react';
import { Notification } from '@shared/notification';
import ContactUsService from '../../../../services/contact.service';
import { Message } from './Messages.types';
import MessagesListComponent from './List';
import MessageDetails from './View';
import { useTranslations } from 'next-intl';
const Service = new ContactUsService();
const ContactsReasonComponent = () => {
    const [selectedData, SetSelectedData] = useState<Message | null>(null)
    const [refetch, SetRefetch] = useState<boolean>(true);
    const [showView, SetShowView] = useState<boolean>(false);
    const t=useTranslations('operation');

    const confirmDelete = () => {
        if (selectedData?.id)
            Service.Delete(selectedData.id).then(res => {
                SetRefetch(true);
                SetSelectedData(null);
                SetRefetch(false);
            }).catch(err => {
                Notification({
                    title: 'فشل الحذف',
                    type: 'error'
                })
            });
    }
    return (
        <>
            <div className={`btn-group`}>
                    <button className={`edit-btn`} disabled={!selectedData} onClick={() => { SetShowView(true) }}>{t('view')}</button>
                    <button className={`delete-btn`} disabled={!selectedData} onClick={confirmDelete}>{t('delete')}</button>

            </div>
            {showView && <MessageDetails data={selectedData} setData={SetSelectedData} setShowView={SetShowView} />}
            {!showView && <MessagesListComponent selectedData={selectedData} setSelectedData={SetSelectedData} refetch={refetch} />
            }
        </>
    );
};
export default ContactsReasonComponent;
