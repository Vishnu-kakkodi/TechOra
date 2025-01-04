import { OrderDocument } from "../../type/order.type";



export interface IOrderService{
    getOrderById(orderId: string): Promise<OrderDocument>
    createOrder(orderId: string, userId: string, orderItems: Array<{ courseId: string, price: number }>, total: number): Promise<OrderDocument>
    updatePayment(orderId: string, userId: string): Promise<OrderDocument | null>
    orderList(userId: string, page: number, limit: number, search: string, status: string, sort: string): Promise<{orders: OrderDocument[] | null; total: number}>
    orderDetail(orderId: string): Promise<OrderDocument | null>
}