import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // pathnames: {
  //   '/': {
  //     en: '/',
  //     ar: '/الصفحه-الرئيسيه'
  //   },
  //   '/news': {
  //     en: '/news',
  //     en: '/news',
  //     ar: '/الاخبار'
  //   },
  //   '/news/:id': {
  //     en: '/news/:id',
  //     ar: '/الاخبار/:id'
  //   },
  //   '/works': {
  //     en: '/works',
  //     ar: '/اعمالنا'
  //   },
  //   '/communication': {
  //     en: '/communication',
  //     ar: '/تواصل-معانا'
  //   },
  //   '/services': {
  //     en: '/services',
  //     ar: '/خدماتنا'
  //   },
  //   '/inquiry': {
  //     en: '/inquiry',
  //     ar: '/سجل-اهتمامك'
  //   },
  //   '/work/:id/:name/:status': {
  //     en: '/work/:id/:name/:status',
  //     ar: '/المشروع/:id/:name/:status'
  //   },
  //   '/landing-page': {
  //     en: '/landing-page',
  //     ar: '/لوحة-التحكم'
  //   },
  //   '/solutions': {
  //     en: '/solutions',
  //     ar: '/الحلول'
  //   },
  //   '/category': {
  //     en: '/category',
  //     ar: '/التصنيفات'
  //   },
  //   '/products': {
  //     en: '/products',
  //     ar: '/المنتجات'
  //   },
  //   '/orders': {
  //     en: '/orders',
  //     ar: '/الطلبات'
  //   },
  //   '/news': {
  //     en: '/news',
  //     ar: '/الاخبار'
  //   },
  //   '/contact-reasons': {
  //     en: '/contact-reasons',
  //     ar: '/اسباب-التواصل'
  //   },
  //   '/messages': {
  //     en: '/messages',
  //     ar: '/الرسائل'
  //   },
  //   '/login': {
  //     en: '/login',
  //     ar: '/تسجيل-الدخول'
  //   }
  // }
});

