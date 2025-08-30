import React, {  useState } from "react";
import styles from "@styles/dashboard/Messages.module.scss";
import { Loader } from "lucide-react";
import { Message } from "./Messages.types";
import { useTranslations } from "next-intl";
export default function MessageDetails({ data, setData, setShowView }: { data: Message|null, setData: (data: Message|null) => void, setShowView: (data: boolean) => void }) {

    const t = useTranslations('messages');
    if (!data) return <Loader />;


  return (
    <div className={styles.messageDetails}>
      <div className={styles.header}>
        <h2>{t('title')}</h2>
        <button
          type="button"
          onClick={() => {
            setData(null);
            setShowView(false);
          }}
        >
          {t('back')}
        </button>
      </div>
      <div className={styles.summary}>
        <p>
          <span>{t('name')}</span> <span>{data?.name}</span>
        </p>
        <p>
          <span>{t('phone')}</span> <span>{data?.phoneNumber}</span>
        </p>
        <p>
          <span>{t('email')}</span> <span>{data?.email}</span>
        </p>
        <hr />
        <p>
          <span>{t('description')}</span> <span>{data?.description}</span>
        </p>
      </div>
    </div>
  );
}
