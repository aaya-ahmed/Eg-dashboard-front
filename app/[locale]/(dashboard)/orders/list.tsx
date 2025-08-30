import { useGetPagedData } from "../../../../hooks/getpageddata";
import { TableWithFilterComponent } from "@shared/tableWithFilter/tablewithfilter";
import ProductService from "../../../../services/products.service";
import { filter } from "@shared/model/filter";
import OrdersService from "../../../../services/orders.service";
import { order, OrderStatusList, PaymentMethodList, PaymentStatusList } from "./model";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
const Service = new OrdersService();
type NewsListListProp = {
    selectedData: order | null
    setSelectedData: (data: order) => void;
    refetch:boolean
};
const initialFilter: filter = {
    filtring: [{
        Name: "Status",
        Op: '==',
        type: 'Number',
        Value: 0
    }],
    page: 0,
    itemPerPage: 10
}
const OrderListComponent = ({ selectedData, setSelectedData,refetch }: NewsListListProp) => {
    const t = useTranslations('order');
    const { handleSubmit, register } = useForm({
        defaultValues: {
            filtering: [
                {
                    Name: "Status",
                    Op: '==',
                    type: 'Number',
                    Value: ''
                },
                {
                    Name: 'PaymentMethod',
                    Op: '==',
                    type: 'Number',
                    Value: ''
                },
                {
                    Name: 'paymentStatus',
                    Op: '==',
                    type: 'Number',
                    Value: ''
                }
            ],
            page: 0,
            itemPerPage: 10
        }
    })
    const { listData, isLoading, setFilter, filter } =
        useGetPagedData(Service, refetch, initialFilter);
    const onSubmit = (e: any) => {
        console.log(e)
        setFilter(e)
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} style={{padding:'10px'}}>
                <div className="input-group">
                    <div className="input-field">
                        <label htmlFor="status">{t('status')}:</label>
                        <select
                            id="status"
                            {...register(`filtering.0.Value`)}
                        >
                            <option value="">{t('all')}</option>
                            {OrderStatusList.map((status, index) => (
                                <option key={status} value={index}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-field">
                        <div>
                            <label htmlFor="paymentMethod">{t('paymentMethod')}:</label>
                            <select
                                id="paymentMethod"
                                {...register(`filtering.1.Value`)}

                            >
                                <option value="">{t('all')}</option>
                                {PaymentMethodList.map((method, index) => (
                                    <option key={method} value={index}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-field">
                        <div>
                            <label htmlFor="paymentStatus">{t("paymentStatus")}</label>
                            <select
                                id="paymentStatus"
                                {...register(`filtering.2.Value`)}

                            >
                                <option value="">{t('all')}</option>
                                {PaymentStatusList.map((method, index) => (
                                    <option key={method} value={index}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                        <input type="submit" value={t('search')} className="submit-form" />
                </div>
            </form>
            <TableWithFilterComponent
                selectedRow={selectedData}
                setSelectedRow={setSelectedData}
                isLoading={isLoading}
                Data={listData}
                columns={[
                    { id: 'user.firstName', name: t('user'), type: 'string' },
                    { id: 'status', name: t('status'), type: 'number', value: OrderStatusList },
                    { id: 'paymentMethod', name: t('paymentMethod'), type: 'number', value: PaymentMethodList },
                    { id: 'paymentStatus', name: t('paymentStatus'), type: 'number', value: PaymentStatusList },
                    { id: 'totalPrice', name: t('totalPrice'), type: 'number' },
                    { id: 'totalDiscount', name: t('totalDiscount'), type: 'number' },
                    { id: 'createdDate', name: t('createdDate'), type: 'date' }


                ]}
                setFilter={setFilter}
                filter={filter}
            />
        </>
    );
};
export default OrderListComponent;