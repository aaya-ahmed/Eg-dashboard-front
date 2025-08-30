export type product = {
    id?: number,
    name: string,
    nameEn: string,
    description: string,
    descriptionEn: string,
    discount: number,
    priceAfterDiscount: number,
    quantity: number,
    unitPrice: number,
    categoryId: number,
    categoryName: string,
    createdDate: string,
    attachments: any[]
}