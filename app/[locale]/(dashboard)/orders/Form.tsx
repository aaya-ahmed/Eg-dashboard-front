import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notification } from "@shared/notification";
import OrdersService from "../../../../services/orders.service";
import { order, OrderStatusList, PaymentMethodList, PaymentStatusList } from "./model";
import FormContainer from "../Components/formContainer";
import styles from "@styles/dashboard/OrderDetails.module.scss";
import { Loader } from "@shared/loader/loader";
import { useTranslations } from "next-intl";

const service = new OrdersService();
const OrderFormComponent = ({ id, setId, setShowForm ,setRefetch}: { id: number, setId: (data: number) => void, setShowForm: (data: any) => void,setRefetch:(value:boolean)=>void }) => {
    const t = useTranslations("order");
    const [isLoading, setIsLoading] = useState<boolean>();
    const [order, setOrder] = useState<order>();

    const {
        handleSubmit,
        formState: { errors, isValid },
        register,
        setValue,
        getValues
    } = useForm({
        mode: 'all', defaultValues: {
            paymentMethod: 0,
            paymentStatus: 0,
            status: 0,
            deliveryDate: ''

        }
    });
    useEffect(() => {
        (async () => {
            const data = await service.GetById(id);
            setOrder(data.data);
            setValue('paymentMethod', data?.data?.paymentMethod ?? 0);
            setValue('paymentStatus', data?.data?.paymentStatus ?? 0)
            setValue('status', data?.data?.status ?? 0)
            setValue('deliveryDate', data?.data?.delivaryDate ?? null)
        })();
    }, []);

    const submit = (e: any) => {
        setIsLoading(true)
        if (id) {
            service
                .Put({
                    ...order,
                    ...getValues()
                })
                .then(() => {
                    setId(0);
                    setShowForm(false);
                    setIsLoading(false);
                    setRefetch(false)
                    setTimeout(()=>setRefetch(true),200)
                    Notification({
                        title: t("notifications.success"),
                        type: "success"
                    });
                })
                .catch(() => {
                    setIsLoading(false);
                    Notification({
                        title: t("notifications.error"),
                        type: "error"
                    });
                });
        }
    }
    if (!order) return <Loader />;
    return (
        <FormContainer header={id ? t("updateOrder") : ""} isAdd={!!id}>
            <button
                type="button"
                onClick={() => {
                    setShowForm(false);
                    setId(0);
                }}
                className="return-btn"
            >
                {t("back")}
            </button>
            <>
                <form onSubmit={handleSubmit(submit)} className={styles.updateForm}>
                    <div className="input-group">
                        <div className="input-field">
                            <label>
                                {t("paymentMethod")}:
                                <select {...register("paymentMethod")}>
                                    {PaymentMethodList.map((p, i) => (
                                        <option value={i} key={i}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="input-field">
                            <label>
                                {t("paymentStatus")}:
                                <select {...register("paymentStatus")}>
                                    {PaymentStatusList.map((p, i) => (
                                        <option value={i} key={i}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <label>
                                {t("status")}:
                                <select {...register("status")}>
                                    {OrderStatusList.map((p, i) => (
                                        <option value={i} key={i}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="input-field">
                            <label>
                                {t("deliveryDate")}:
                                <input type="date" {...register("deliveryDate")} />
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="btn-group">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <input
                                type="submit"
                                className="sumit-form"
                                value={t("save")}
                                disabled={!isValid}
                            />
                        )}
                    </div>
                </form>

                <div className={styles.orderDetails}>
                    <div className={styles.header}>
                        <h2>{t("title")}</h2>
                    </div>
                    <p className={styles.orderId}>
                        {t("order")} {order?.id ?? 0}
                    </p>

                    <div className={styles.infoGrid}>
                        <div className={styles.card}>
                            <h4>{t("orderInfo")}</h4>
                            <p>
                                <strong>{t("orderDate")}:</strong>{" "}
                                {order?.createdDate}
                            </p>
                        </div>

                        <div className={styles.card}>
                            <h4>{t("customer")}</h4>
                            <p>
                                <strong>{t("name")}:</strong>{" "}
                                {order?.user.firstName} {order?.user.lastName}
                            </p>
                            <p>
                                <strong>{t("email")}:</strong>{" "}
                                {order?.user.email ?? ""}
                            </p>
                            <p>
                                <strong>{t("phone")}:</strong>{" "}
                                {order?.user.phoneNumber ?? ""}
                            </p>
                        </div>

                        <div className={styles.card}>
                            <h4>{t("address")}</h4>
                            <p>
                                <strong>{t("shippingAddress")}:</strong>
                                <br />
                                -{t("country")} {order?.user.addresses[0].country}
                                <br />
                                -{t("city")} {order?.user.addresses[0].city}
                                <br />
                                {order?.user.addresses[0].streetNumber}-
                                {order?.user.addresses[0].street} st
                                <br />
                                -{t("building")} {order?.user.addresses[0].building}
                                <br />
                                -{t("floor")} {order?.user.addresses[0].floor}
                                <br />
                                -{t("apartment")}{" "}
                                {order?.user.addresses[0].apartmentNumber}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className={styles.itemsList}>
                        {order?.items.map((item, idx) => (
                            <div className={styles.item} key={idx}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.productUrl}`}
                                    alt={item?.displayProductName ?? ""}
                                />
                                <div>
                                    <p className={styles.itemName}>{item.productName}</p>
                                    <p>
                                        {t("quantity")}: {item.quantity}
                                    </p>
                                </div>
                                <p className={styles.price}>{item.oldPrice}</p>
                                <del className={styles.price}>{item.discount}</del>
                                <p className={styles.price}>{item.price}</p>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className={styles.summary}>
                        <p>
                            <span>{t("subtotal")}</span>{" "}
                            <span>{order?.totalPrice}</span>
                        </p>
                        <p>
                            <span>{t("shippingCharge")}</span>{" "}
                            <span>{order?.shippingCharge}</span>
                        </p>
                        <p>
                            <span>{t("discount")}</span>{" "}
                            <span>{order?.totalDiscount}</span>
                        </p>
                        <hr />
                        <p className={styles.total}>
                            <span>{t("total")}</span>{" "}
                            <span>
                                {(order?.totalPrice ?? 0) -
                                    (order?.totalDiscount ?? 0) +
                                    (order?.shippingCharge ?? 0)}
                            </span>
                        </p>
                    </div>
                </div>
            </>
        </FormContainer>
    );

}
export default OrderFormComponent;