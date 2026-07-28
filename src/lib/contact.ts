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
  project:
    "Olá, ARTÍS! Conheci o Design Auricular Digital pelo site e quero entender como minha composição pode ficar.",
  jewelry:
    "Olá, ARTÍS! Vi a curadoria de joias no site e quero conversar sobre peças para a minha composição.",
  portfolio:
    "Olá, ARTÍS! Vi os projetos no site e quero criar um Design Auricular Digital personalizado.",
} as const;
