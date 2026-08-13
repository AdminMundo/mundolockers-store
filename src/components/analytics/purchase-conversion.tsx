"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

export default function PurchaseConversion({
  orderId,
  value,
}: {
  orderId: string;
  value: number;
}) {
  useEffect(() => {
    if (!GOOGLE_ADS_ID || !CONVERSION_LABEL) return;

    const key = `ga_conversion_${orderId}`;
    if (sessionStorage.getItem(key)) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}`,
          value,
          currency: "CLP",
          transaction_id: orderId,
        });
        sessionStorage.setItem(key, "1");
        clearInterval(interval);
      } else if (attempts > 25) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [orderId, value]);

  return null;
}
