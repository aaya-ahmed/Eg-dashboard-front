"use client";

import {useState} from "react";
import {Notification} from "@shared/notification";
interface Options<T> {
  serviceFunc: (...args: any[]) => Promise<T>;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);

  const execute = async <T,>(
    {serviceFunc, successMessage, errorMessage}: Options<T>,
    ...args:any[]
  ): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await serviceFunc(...args);
      if(successMessage)
      Notification({title: successMessage, type: "success"});
      return result;
    } catch (err) {
        if(errorMessage)
      Notification({title: errorMessage, type: "error"});
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {execute, loading};
}
