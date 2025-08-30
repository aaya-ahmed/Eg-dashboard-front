import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

const supportedLangs = ["en", "ar"];
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default async function LangLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!supportedLangs.includes(locale)) {
        notFound();
    }
    let messages;
    try {
        messages = (await import(`../../localization/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }
    return (
        <>
            <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
                <body>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        {children}
                        <ToastContainer
                            position={locale === "ar" ? "top-left" : "top-right"}
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </NextIntlClientProvider>
                </body>
            </html>
        </>
    )
}
