# BHAIRAVNATH BIG SHOPEE — Store Pickup Web App

ही मोबाइल-फ्रेंडली starter web app आहे. यात ग्राहक Login/Register, Products, Cart, custom product request, Store Pickup orders, Cash/UPI at store, offers, feedback आणि owner admin dashboard यांचा प्रारंभिक कोड आहे.

## महत्त्वाचे
- Delivery नाही; फक्त दुकानातून Pickup.
- Firebase config स्वतःच्या Firebase Web App मधून घ्यावी.
- Firestore आणि Storage Rules publish केल्याशिवाय app वापरू नका.
- `users/{uid}.role = "admin"` फक्त Firebase Console मधून हाताने सेट करा. सार्वजनिक Register फॉर्ममधून admin बनू शकत नाही.
- पहिला user तयार करून Firebase Console > Firestore Database > users > त्या user च्या document मध्ये `role` field चे value `admin` करा. ग्राहकांचे role `customer` असावे.
- सार्वजनिक वेबसाइटसाठी Admin account तयार करण्यापूर्वी rules तपासा. ग्राहकांची वैयक्तिक माहिती किंवा पासवर्ड GitHub मध्ये कधीही ठेवू नका.
- Firebase Storage availability/pricing तुमच्या project आणि billing eligibility वर अवलंबून असू शकते.
- ही starter implementation आहे; production वापरापूर्वी testing आणि security review आवश्यक आहे.

## Setup — Android मोबाईलवरून
1. GitHub मध्ये `kirana-store` नावाची repository तयार करा.
2. या ZIP मधील फाइल्स repository मध्ये upload करा.
3. Firebase Console: https://console.firebase.google.com/ येथे project तयार करा.
4. Project settings > Your apps > Web app मध्ये Web app नोंदवा आणि config values `firebase-config.js` मध्ये भरा.
5. Authentication > Sign-in method मध्ये Email/Password सक्षम करा.
6. Firestore Database तयार करा आणि `firestore.rules` चे नियम Rules tab मध्ये publish करा.
7. Storage सुरू करता येत असल्यास `storage.rules` चे नियम Storage > Rules मध्ये publish करा.
8. पहिला account वेबसाइटवर Register करा. Firebase Console > Firestore > `users` collection मध्ये त्या UID च्या document मध्ये `role` string `admin` सेट करा.
9. GitHub repository > Settings > Pages मध्ये उपलब्ध असल्यास Deploy from branch (`main`, root) निवडा. Firebase config भरणे आवश्यक आहे.
10. साइट उघडून Customer आणि Admin दोन्ही बाजूंची चाचणी करा.

## फाइल्स
- `index.html` — ग्राहक व Admin UI
- `styles.css` — responsive design
- `app.js` — Firebase Authentication / Firestore / Storage logic
- `firebase-config.js` — Firebase web configuration placeholder
- `firestore.rules` — database security rules
- `storage.rules` — product image upload rules

## सध्याच्या starter version च्या मर्यादा
- ग्राहकांची नोंदणी Email/Password ने होते; phone number profile मध्ये घेतला जातो, SMS OTP नाही.
- Custom product requests ऑर्डरमध्ये येतात; त्यांची किंमत Admin मंजूर करून बिलात जोडण्याची पूर्ण workflow अजून नाही.
- Notifications वेबसाइटच्या Offers tab मध्ये दिसतात; फोनच्या native push notifications नाहीत.
- Order totals browser कडून पाठवले जातात; production मध्ये server-side/Cloud Functions price validation आणि stock deduction लागू करणे आवश्यक.
- Products 500+ ठेवण्यासाठी collection-based design वापरले आहे; वास्तविक quota storage, reads/writes आणि traffic वर अवलंबून आहे.
- Admin role change फक्त Firebase Console मधून करणे; दोन admins हवेत तर फक्त दोन विश्वासू user documents मध्ये role=`admin` सेट करा.


## भाषा निवड
वेबसाइटच्या वरच्या भागात Marathi / Hindi / English भाषा निवडण्याचा पर्याय आहे. हा प्राथमिक UI अनुवाद आहे; ग्राहकांनी लिहिलेली Product नावे, Offers आणि काही Firebase मधून येणारा मजकूर मूळ भाषेतच राहू शकतो.
