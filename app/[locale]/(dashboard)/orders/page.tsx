"use client"
import { useState } from 'react';
import { order } from './model';
import OrderDetails from './View';
import OrderListComponent from './list';
import OrderFormComponent from './Form';
import { useTranslations } from 'next-intl';
const OrderComponent = () => {
    const [ShowForm, SetShowForm] = useState<boolean>(false);
    const [showView, SetShowView] = useState<boolean>(false);
    const t=useTranslations('operation')
    const [selectedData, SetSelectedData] = useState<order | null>(null)
    const [id, setId] = useState<number>(0)
    const [refetch, SetReftech] = useState<boolean>(true);

    return (
        <>
            <section >
                    {(!id&&!ShowForm ) && <div className={`btn-group`}>
                        <button className={`add-btn`} disabled={!selectedData} onClick={() => {SetShowView(true);setId(selectedData?.id??0)}}>{t('view')}</button>
                        <button className={`edit-btn`} disabled={!selectedData} onClick={() => SetShowForm(true)}>{t('edit')}</button>
                    </div>}

                    {showView && <OrderDetails id={id ?? 0} setId={setId} setShowView={SetShowView} />}
                    {ShowForm && <OrderFormComponent setRefetch={SetReftech} id={selectedData?.id ?? 0} setId={setId} setShowForm={SetShowForm}/>}
                    {(!showView&&!ShowForm )&& <OrderListComponent refetch={refetch} selectedData={selectedData} setSelectedData={SetSelectedData} />}

            </section>
        </>
    );
};
export default OrderComponent;
