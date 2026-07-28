import siteData from "../data/site.json";

const configuredNumber =
  import.meta.env.PUBLIC_WHATSAPP_NUMBER?.trim() || siteData.whatsappNumber.trim();

export const whatsappNumber = configuredNumber;
export const hasWhatsApp = /^\d{12,13}$/.test(configuredNumber);

export function createWhatsAppUrl(message: string, number = configuredNumber) {
  if (!/^\d{12,13}$/.test(number)) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message.trim())}`;
}

export const messages = {
  project: siteData.messages.project,
  jewelry: siteData.messages.jewelry,
  portfolio: siteData.messages.portfolio,
} as const;
