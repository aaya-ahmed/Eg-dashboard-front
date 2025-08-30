import React, { useEffect, useState } from "react";
import styles from "@styles/dashboard/OrderDetails.module.scss";
import OrdersService from "../../../../services/orders.service";
import { order, OrderStatusList, PaymentMethodList, PaymentStatusList } from "./model";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
const service = new OrdersService();
export default function OrderDetails({ id,setId,setShowView }: { id: number ,setId: (data: number) => void,setShowView:(data: boolean) => void}) {
    const [data, setData] = useState<order>();
    const t=useTranslations('order')
    useEffect(() => {
        (async () => {
            const data = await service.GetById(id);
            setData(data.data);
        })();
    }, [])
        if (!data) return <Loader/>;
    
  return (
    <div className="orderDetails">
      <div className="header">
        <h2>{t("OrderDetails")}</h2>
        <button
          type="button"
          className="return-btn"
          onClick={() => {
            setId(0);
            setShowView(false);
          }}
        >
          {t("Back")}
        </button>
      </div>

      <p className="orderId">
        {t("Order")} {data?.id ?? 0}
      </p>

      <div className="infoGrid">
        <div className="card">
          <h4>{t("OrderInfo")}</h4>
          <p>
            <strong>{t("OrderDate")}:</strong> {data?.createdDate}
          </p>
          <p>
            <strong>{t("DeliveryDate")}:</strong> {data?.delivaryDate}
          </p>
          <p>
            <strong>{t("Status")}:</strong>{" "}
            {data && data?.status > -1 && OrderStatusList[data?.status]}
          </p>
          <p>
            <strong>{t("PaymentStatus")}:</strong>{" "}
            {data && data?.paymentStatus > -1 && PaymentStatusList[data?.paymentStatus]}
          </p>
          <p>
            <strong>{t("PaymentMethod")}:</strong>{" "}
            {data && data?.paymentMethod > -1 && PaymentMethodList[data?.paymentMethod]}
          </p>
        </div>

        <div className="card">
          <h4>{t("Customer")}</h4>
          <p>
            <strong>{t("Name")}:</strong> {data?.user.firstName}{" "}
            {data?.user.lastName}
          </p>
          <p>
            <strong>{t("Email")}:</strong> {data?.user.email ?? ""}
          </p>
          <p>
            <strong>{t("PhoneNumber")}:</strong>{" "}
            {data?.user.phoneNumber ?? ""}
          </p>
        </div>

        <div className="card">
          <h4>{t("Address")}</h4>
          <p>
            <strong>{t("ShippingAddress")}:</strong>
            <br />
            -{t("Country")} {data?.user.addresses[0].country} <br />
            -{t("City")} {data?.user.addresses[0].city} <br />
            {data?.user.addresses[0].streetNumber}-
            {data?.user.addresses[0].street} {t("Street")}
            <br />
            -{t("Building")} {data?.user.addresses[0].building} <br />
            -{t("Floor")} {data?.user.addresses[0].floor} <br />
            -{t("Apartment")} {data?.user.addresses[0].apartmentNumber}
          </p>
        </div>
      </div>

      <div className="itemsList">
        {data?.items.map((item) => (
          <div key={item.id} className="item">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.productUrl}`}
              alt={item?.displayProductName ?? ""}
            />
            <div>
              <p className="itemName">{item.productName}</p>
              <p>
                {t("Quantity")}: {item.quantity}
              </p>
            </div>
            <p className="price">{item.oldPrice}</p>
            <del className="price">{item.discount}</del>
            <p className="price">{item.price}</p>
          </div>
        ))}
      </div>

      <div className="summary">
        <p>
          <span>{t("Subtotal")}</span> <span>{data?.totalPrice}</span>
        </p>
        <p>
          <span>{t("ShippingCharge")}</span>{" "}
          <span>{data?.shippingCharge}</span>
        </p>
        <p>
          <span>{t("Discount")}</span> <span>{data?.totalDiscount}</span>
        </p>
        <hr />
        <p className="total">
          <span>{t("Total")}</span>{" "}
          <span>
            {(data?.totalPrice ?? 0) -
              (data?.totalDiscount ?? 0) +
              (data?.shippingCharge ?? 0)}
          </span>
        </p>
      </div>
    </div>
  );
}
