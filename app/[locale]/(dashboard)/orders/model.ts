export type order = {
    id?: number,
    createdDate: string,
    totalDiscount: number,
    totalPrice: number,
    items: orderItem[],
    user: user,
    status: OrderStatus,
    delivaryDate: string,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus
    shippingCharge: number

}
export type user = {
    id: number,
    firstName: string,
    lastName: string,
    email?: string,
    phoneNumber: string,
    phoneNumber2?: string,
    addresses: address[],
    createdDate: string,

}
export type orderItem = {
    id: number,
    displayProductName: string,
    createdDate: string,
    name: string,
    nameEn: string,
    discount: number,
    price: number,
    quantity: number,
    oldPrice: number,
    productId: number,
    productName: string,
    productNameEn: string,
    productUrl: string,
    orderId: number
}
enum OrderStatus {
    Pending, OutOfDeivery, Delivered, NotReceived, Returned
}
enum PaymentMethod {
    CashOnDelivery, CreditOnDelivery
}
enum PaymentStatus {
    Paid, Upaid
}
export const OrderStatusList =[
    'Pending', 'Out Of Deivery', 'Delivered', 'Not Received', 'Returned'
]
export const PaymentMethodList= [
    'Cash On Delivery', 'Credit On Delivery'
]
export const PaymentStatusList= [
    'Paid', 'Upaid'
]
export type address = {
    id: number,
    createdDate: string,
    country: string,
    city: string,
    street: string,
    streetNumber: number,
    building: string,
    floor: number,
    apartmentNumber: number,
    userId: number,
}