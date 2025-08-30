import { Box, LayoutDashboard, MessageCircle, Newspaper, ShoppingCart, Tag, ToolCase ,} from "lucide-react";
import { IRouter } from "./IRouter.type";

export const dashboardRouter: IRouter[] = [
    {
        path: 'landing-page',
        name: 'dashboard',
        nameAr: 'لوحة التحكم',
        protected: true,
        icon: LayoutDashboard,
    },
    {
        path: 'solutions',
        name: 'solutions',
        nameAr: 'الحلول',
        protected: true,
        icon: ToolCase,
    },
    {
        path: 'news',
        name: 'news',
        nameAr: 'الاخبار',
        protected: false,
        icon: Newspaper,
    },
    {
        path: 'messages',
        name: 'messages',
        nameAr: 'الرسائل',
        protected: false,
        icon: MessageCircle,
    },
    {
        path: 'category',
        name: 'category',
        nameAr: 'التصنيفات',
        protected: true,
        icon: Tag,
    },
    {
        path: 'products',
        name: 'products',
        nameAr: 'المنتجات',
        protected: true,
        icon: Box,
    },
    {
        path: 'orders',
        name: 'orders',
        nameAr: 'الطلبات',
        protected: false,
        icon: ShoppingCart,
    }
]

export const authRouter: IRouter[] = [
    {
        path: 'login',
        name: 'login',
        nameAr: 'تسجيل الدخول',
        protected: true
    }
]