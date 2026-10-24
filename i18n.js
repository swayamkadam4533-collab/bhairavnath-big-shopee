/* Basic multilingual interface: Marathi, Hindi, English. Product names and user-written offers remain as entered. */
(() => {
  const dictionaries = {
    mr: {
      language:"भाषा", loginRegister:"Login / Register", pickupTag:"फक्त दुकानातून घेणे • Delivery नाही",
      "माझ्या ऑर्डर्स":"माझ्या ऑर्डर्स", "ऑफर्स आणि सूचना":"ऑफर्स आणि सूचना", "Feedback / अभिप्राय":"Feedback / अभिप्राय",
      "किराणा Products":"किराणा वस्तू", "Admin ने उपलब्ध केलेल्या वस्तू व त्यांचे दर.":"Admin ने उपलब्ध केलेल्या वस्तू व त्यांचे दर.",
      "वस्तू शोधा...":"वस्तू शोधा...", "यादीत नसलेली वस्तू मागवा":"यादीत नसलेली वस्तू मागवा",
      "वस्तूचे नाव":"वस्तूचे नाव", "प्रमाण / Quantity":"प्रमाण / Quantity", "माझ्या Cart मध्ये जोडा":"माझ्या Cart मध्ये जोडा",
      "तुझ्या खात्यातील ऑर्डर्स इथे दिसतील.":"तुझ्या खात्यातील ऑर्डर्स इथे दिसतील.",
      "ऑर्डर्स पाहण्यासाठी Login कर.":"ऑर्डर्स पाहण्यासाठी Login कर.", "सध्या ऑफर उपलब्ध नाही.":"सध्या ऑफर उपलब्ध नाही.",
      "तुझ्या अनुभवाबद्दल सांग. Feedback Admin ला दिसेल.":"तुझ्या अनुभवाबद्दल सांग. Feedback Admin ला दिसेल.",
      "दुकानाची माहिती":"दुकानाची माहिती", "दुकानाचे नाव":"दुकानाचे नाव", "पत्ता":"पत्ता",
      "मोबाईल नंबर":"मोबाईल नंबर", "दुकानाची माहिती सेव्ह करा":"दुकानाची माहिती सेव्ह करा",
      "Product जोडा":"Product जोडा", "किंमत (₹)":"किंमत (₹)", "Stock / प्रमाण":"Stock / प्रमाण",
      "Product फोटो":"Product फोटो", "ग्राहकांना उपलब्ध दाखवा":"ग्राहकांना उपलब्ध दाखवा",
      "Product सेव्ह करा":"Product सेव्ह करा", "Products व्यवस्थापन":"Products व्यवस्थापन",
      "ऑर्डर्स आणि Pickup Status":"ऑर्डर्स आणि Pickup Status", "Offer तयार करा":"Offer तयार करा",
      "Offer चे शीर्षक":"Offer चे शीर्षक", "Offer चा मजकूर":"Offer चा मजकूर",
      "Offer Publish करा":"Offer Publish करा", "ग्राहक Feedback":"ग्राहक Feedback",
      "तुझा Cart":"तुझा Cart", "एकूण (निश्चित किंमती)":"एकूण (निश्चित किंमती)",
      "Pickup Order कन्फर्म करा":"Pickup Order कन्फर्म करा",
      footerNote:"फक्त दुकानातून ऑर्डर घ्या • दुकानात Cash / UPI पेमेंट"
    },
    hi: {
      language:"भाषा", loginRegister:"लॉगिन / रजिस्टर", pickupTag:"केवल दुकान से पिकअप • डिलीवरी नहीं",
      "माझ्या ऑर्डर्स":"मेरे ऑर्डर", "ऑफर्स आणि सूचना":"ऑफर और सूचनाएँ", "Feedback / अभिप्राय":"प्रतिक्रिया",
      "किराणा Products":"किराना सामान", "Admin ने उपलब्ध केलेल्या वस्तू व त्यांचे दर.":"एडमिन द्वारा उपलब्ध सामान और उनकी कीमतें।",
      "वस्तू शोधा...":"सामान खोजें...", "यादीत नसलेली वस्तू मागवा":"सूची में नहीं है तो सामान माँगें",
      "वस्तूचे नाव":"सामान का नाम", "प्रमाण / Quantity":"मात्रा", "माझ्या Cart मध्ये जोडा":"कार्ट में जोड़ें",
      "तुझ्या खात्यातील ऑर्डर्स इथे दिसतील.":"आपके खाते के ऑर्डर यहाँ दिखेंगे।",
      "ऑर्डर्स पाहण्यासाठी Login कर.":"ऑर्डर देखने के लिए लॉगिन करें।", "सध्या ऑफर उपलब्ध नाही.":"अभी कोई ऑफर उपलब्ध नहीं है।",
      "तुझ्या अनुभवाबद्दल सांग. Feedback Admin ला दिसेल.":"अपना अनुभव बताएँ। प्रतिक्रिया एडमिन को दिखेगी।",
      "दुकानाची माहिती":"दुकान की जानकारी", "दुकानाचे नाव":"दुकान का नाम", "पत्ता":"पता",
      "मोबाईल नंबर":"मोबाइल नंबर", "दुकानाची माहिती सेव्ह करा":"दुकान की जानकारी सेव करें",
      "Product जोडा":"सामान जोड़ें", "किंमत (₹)":"कीमत (₹)", "Stock / प्रमाण":"स्टॉक / मात्रा",
      "Product फोटो":"सामान की फोटो", "ग्राहकांना उपलब्ध दाखवा":"ग्राहकों को उपलब्ध दिखाएँ",
      "Product सेव्ह करा":"सामान सेव करें", "Products व्यवस्थापन":"सामान प्रबंधन",
      "ऑर्डर्स आणि Pickup Status":"ऑर्डर और पिकअप स्थिति", "Offer तयार करा":"ऑफर बनाएँ",
      "Offer चे शीर्षक":"ऑफर का शीर्षक", "Offer चा मजकूर":"ऑफर का विवरण",
      "Offer Publish करा":"ऑफर प्रकाशित करें", "ग्राहक Feedback":"ग्राहक प्रतिक्रिया",
      "तुझा Cart":"आपका कार्ट", "एकूण (निश्चित किंमती)":"कुल (पुष्ट कीमतें)",
      "Pickup Order कन्फर्म करा":"पिकअप ऑर्डर पक्का करें",
      footerNote:"केवल दुकान से पिकअप • दुकान पर Cash / UPI भुगतान"
    },
    en: {
      language:"Language", loginRegister:"Login / Register", pickupTag:"STORE PICKUP ONLY • NO DELIVERY",
      "माझ्या ऑर्डर्स":"My Orders", "ऑफर्स आणि सूचना":"Offers & Updates", "Feedback / अभिप्राय":"Feedback",
      "किराणा Products":"Grocery Products", "Admin ने उपलब्ध केलेल्या वस्तू व त्यांचे दर.":"Products and prices set by the admin.",
      "वस्तू शोधा...":"Search products...", "यादीत नसलेली वस्तू मागवा":"Request an unlisted product",
      "वस्तूचे नाव":"Product name", "प्रमाण / Quantity":"Quantity", "माझ्या Cart मध्ये जोडा":"Add to Cart",
      "तुझ्या खात्यातील ऑर्डर्स इथे दिसतील.":"Your orders will appear here.",
      "ऑर्डर्स पाहण्यासाठी Login कर.":"Log in to view orders.", "सध्या ऑफर उपलब्ध नाही.":"No offers available right now.",
      "तुझ्या अनुभवाबद्दल सांग. Feedback Admin ला दिसेल.":"Share your experience. The admin can see your feedback.",
      "दुकानाची माहिती":"Store Information", "दुकानाचे नाव":"Store name", "पत्ता":"Address",
      "मोबाईल नंबर":"Phone number", "दुकानाची माहिती सेव्ह करा":"Save store information",
      "Product जोडा":"Add Product", "किंमत (₹)":"Price (₹)", "Stock / प्रमाण":"Stock / Quantity",
      "Product फोटो":"Product photo", "ग्राहकांना उपलब्ध दाखवा":"Show as available to customers",
      "Product सेव्ह करा":"Save Product", "Products व्यवस्थापन":"Manage Products",
      "ऑर्डर्स आणि Pickup Status":"Orders & Pickup Status", "Offer तयार करा":"Create Offer",
      "Offer चे शीर्षक":"Offer title", "Offer चा मजकूर":"Offer details",
      "Offer Publish करा":"Publish Offer", "ग्राहक Feedback":"Customer Feedback",
      "तुझा Cart":"Your Cart", "एकूण (निश्चित किंमती)":"Total (confirmed prices)",
      "Pickup Order कन्फर्म करा":"Confirm Pickup Order",
      footerNote:"Store pickup only • Pay by Cash / UPI at the store"
    }
  };
  const original = new WeakMap();
  function translate(lang) {
    const dict = dictionaries[lang] || dictionaries.mr;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (key === "language" || key === "pickupTag" || key === "loginRegister" || key === "footerNote") {
        el.textContent = dict[key] || dictionaries.mr[key] || el.textContent;
      }
    });
    // Translate exact standalone labels/headings/buttons without replacing their child controls.
    const all = document.querySelectorAll("h2,h3,p,label,button,option,.empty,.muted,.pickup-note");
    all.forEach(el => {
      if (el.id === "storeName" || el.id === "storeAddress" || el.id === "storePhone" ||
          el.closest("#productGrid") || el.closest("#cartItems") || el.closest("#ordersList") ||
          el.closest("#offersList") || el.closest("#adminProductsList") || el.closest("#adminOrdersList") ||
          el.closest("#customRequestsList") || el.closest("#adminOffersList") || el.closest("#adminFeedbackList")) return;
      if (!original.has(el)) original.set(el, el.childElementCount ? null : el.textContent.trim());
      const base = original.get(el);
      if (base && dict[base]) el.textContent = dict[base];
    });
    document.querySelectorAll("[placeholder]").forEach(el => {
      if (!original.has(el)) original.set(el, el.getAttribute("placeholder"));
      const base = original.get(el);
      const map = {
        "तुझे पूर्ण नाव": {hi:"आपका पूरा नाम",en:"Full name"},
        "मोबाईल नंबर": {hi:"मोबाइल नंबर",en:"Phone number"},
        "किमान 6 अक्षरे": {hi:"कम से कम 6 अक्षर",en:"At least 6 characters"},
        "वस्तू शोधा...": {hi:"सामान खोजें...",en:"Search products..."},
        "उदा. 1 किलो किंवा 2 पाकिटे": {hi:"जैसे 1 किलो या 2 पैकेट",en:"e.g. 1 kg or 2 packets"},
        "पूर्ण पत्ता": {hi:"पूरा पता",en:"Full address"},
        "दुकानाचा नंबर": {hi:"दुकान का नंबर",en:"Store phone number"},
        "दुकानाचे नाव": {hi:"दुकान का नाम",en:"Store name"},
        "उदा. तूर डाळ 1 किलो": {hi:"जैसे अरहर दाल 1 किलो",en:"e.g. Toor dal 1 kg"}
      };
      if (map[base] && map[base][lang]) el.setAttribute("placeholder", map[base][lang]);
      else if (lang === "mr") el.setAttribute("placeholder", base);
    });
    const authTitle = document.querySelector("#authPanel .panel-head h2");
    if (authTitle) authTitle.textContent = ({mr:"Customer Login / Register",hi:"ग्राहक लॉगिन / रजिस्टर",en:"Customer Login / Register"})[lang];
    const cartTitle = document.querySelector("#cartDrawer .panel-head h2");
    if (cartTitle) cartTitle.textContent = ({mr:"तुझा Cart",hi:"आपका कार्ट",en:"Your Cart"})[lang];
  }
  window.BHAIRAVNATH_I18N = { translate };
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("languageSelect");
    if (select) {
      select.addEventListener("change", () => translate(select.value));
      translate(select.value);
    }
  });
})();