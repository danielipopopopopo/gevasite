import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "devil": "DEVIL",
      "home": "Home",
      "shirts": "T-Shirts",
      "jackets": "Outerwear",
      "cart": "Bag",
      "checkout": "Checkout",
      "addToCart": "Add to Bag",
      "deliveryFee": "Shipping",
      "shekels": "₪",
      "shippingAddress": "Shipping",
      "email": "Email",
      "name": "Full Name",
      "phone": "Phone",
      "address": "Address",
      "placeOrder": "Pay Now",
      "orderSuccess": "Confirmed",
      "orderSentEmail": "The devil is in the details. Check your email.",
      "total": "Total",
      "emptyCart": "Your bag is empty",
      "deliveryPrice": "20",
      "language": "HE",
      "collection": "Drops",
      "hero_title": "DEVIL",
      "hero_subtitle": "SYNDICATE STREETWEAR / EST 2026",
      "explore": "Explore the Drop",
      "city": "City",
      "street": "Street",
      "houseNum": "House No.",
      "floor": "Floor",
      "apartment": "Apt. No."
    }
  },
  he: {
    translation: {
      "devil": "DEVIL",
      "home": "בית",
      "shirts": "חולצות",
      "jackets": "ז'קטים",
      "cart": "סל קניות",
      "checkout": "תשלום",
      "addToCart": "הוספה לסל",
      "deliveryFee": "משלוח",
      "shekels": "₪",
      "shippingAddress": "פרטי משלוח",
      "email": "אימייל",
      "name": "שם מלא",
      "phone": "טלפון",
      "address": "כתובת למשלוח",
      "placeOrder": "שלם עכשיו",
      "orderSuccess": "ההזמנה אושרה",
      "orderSentEmail": "הפרטים נשלחו למייל שלך. השטן נמצא בפרטים הקטנים.",
      "total": "סה״כ",
      "emptyCart": "הסל שלך ריק כרגע",
      "deliveryPrice": "20",
      "language": "EN",
      "collection": "קולקציה",
      "hero_title": "DEVIL",
      "hero_subtitle": "אופנת רחוב יוקרתית / 2026",
      "explore": "גלה את הקולקציה",
      "city": "עיר",
      "street": "רחוב",
      "houseNum": "מספר בית",
      "floor": "קומה",
      "apartment": "מספר דירה"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "he",
    fallbackLng: "he",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
