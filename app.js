import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, addDoc, updateDoc,
  deleteDoc, onSnapshot, query, orderBy, serverTimestamp, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const configReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_") &&
  firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("PASTE_");
let app, auth, db, storage, currentUser = null, isAdmin = false;
let products = [], offers = [], cart = [], userProfile = null, unsubscribe = [];
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN",{maximumFractionDigits:2});
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toast = msg => { $("toast").textContent=msg; $("toast").classList.remove("hidden"); setTimeout(()=> $("toast").classList.add("hidden"),3000); };
const say = (id,msg) => { if($(id)) $(id).textContent=msg; };
const show = (id,on=true) => $(id).classList.toggle("hidden",!on);
const dateText = t => t?.toDate ? t.toDate().toLocaleString("mr-IN") : "आत्ताच";
function stopListeners(){ unsubscribe.forEach(fn=>fn()); unsubscribe=[]; }
function subscribe(col, cb, sortField=null) {
  const q = sortField ? query(collection(db,col),orderBy(sortField,"desc")) : collection(db,col);
  return onSnapshot(q, snap=>cb(snap.docs.map(d=>({id:d.id,...d.data()}))), err=>console.error(col,err));
}
function initFirebase(){
  if(!configReady){ toast("आधी firebase-config.js मध्ये Firebase ची माहिती भरा."); return false; }
  app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app);
  return true;
}
function switchView(view){
  document.querySelectorAll(".view").forEach(el=>el.classList.add("hidden"));
  $("view-"+view)?.classList.remove("hidden");
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  if(view==="orders") renderCustomerOrders();
  if(view==="admin" && isAdmin) renderAdmin();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
$("openAuthBtn").onclick=()=>show("authPanel");
$("closeAuthBtn").onclick=()=>show("authPanel",false);
$("cartToggleBtn").onclick=()=>show("cartDrawer");
$("closeCartBtn").onclick=()=>show("cartDrawer",false);
$("productSearch").addEventListener("input",renderProducts);
$("adminProductSearch").addEventListener("input",renderAdminProducts);
$("logoutBtn").onclick=$("logoutQuickBtn").onclick=async()=>{if(auth) await signOut(auth);show("authPanel",false);};
$("registerBtn").onclick=async()=>{
  if(!auth) return toast("Firebase सेटअप पूर्ण करा.");
  const name=$("authName").value.trim(), phone=$("authPhone").value.trim(), email=$("authEmail").value.trim(), password=$("authPassword").value;
  if(!name||!phone||!email||password.length<6) return say("authMessage","नाव, फोन, Email आणि किमान 6 अक्षरांचा Password भरा.");
  try{
    const cred=await createUserWithEmailAndPassword(auth,email,password);
    await updateProfile(cred.user,{displayName:name});
    await setDoc(doc(db,"users",cred.user.uid),{name,phone,email,role:"customer",createdAt:serverTimestamp()});
    say("authMessage","खाते तयार झाले. स्वागत आहे!");
  }catch(e){say("authMessage",friendlyError(e));}
};
$("loginBtn").onclick=async()=>{
  try{await signInWithEmailAndPassword(auth,$("authEmail").value.trim(),$("authPassword").value);say("authMessage","Login यशस्वी.");}
  catch(e){say("authMessage",friendlyError(e));}
};
function friendlyError(e){return ({ "auth/email-already-in-use":"हा Email आधी वापरला आहे.","auth/invalid-credential":"Email किंवा Password तपासा.","auth/weak-password":"Password किमान 6 अक्षरांचा ठेवा.","auth/invalid-email":"Email योग्य नाही."})[e.code]||e.message||"काहीतरी चूक झाली.";}
onSnapshot; // keep Firestore listener API referenced for bundler-free browser module.
function setUserUI(){
  const signed=!!currentUser;
  show("openAuthBtn",!signed); show("welcomeBar",signed); show("logoutBtn",signed);
  show("adminTab",isAdmin);
  $("welcomeText").textContent=signed?`नमस्कार, ${userProfile?.name||currentUser.displayName||currentUser.email}`:"";
}
async function loadProfile(user){
  const snap=await getDoc(doc(db,"users",user.uid));
  userProfile=snap.exists()?snap.data():{name:user.displayName||"",email:user.email||"",role:"customer"};
  // Admin privilege is derived from the protected Firestore user record, never from form input.
  isAdmin=userProfile.role==="admin";
  setUserUI();
  if(isAdmin) renderAdmin();
}
function renderProducts(){
  const term=$("productSearch").value.trim().toLowerCase();
  const list=products.filter(p=>p.available!==false && Number(p.stock||0)>0 &&
    (p.name||"").toLowerCase().includes(term) || (p.available!==false && Number(p.stock||0)>0 && (p.category||"").toLowerCase().includes(term));
  $("productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card">
    <img src="${esc(p.photoUrl||"https://placehold.co/320x220?text=Grocery")}" alt="${esc(p.name)}" loading="lazy">
    <div class="product-info"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.category||"किराणा")}</p>
    <div class="price">${money(p.price)}</div><p class="muted small">उपलब्ध: ${Number(p.stock||0)}</p>
    <button data-add="${p.id}">Cart मध्ये जोडा</button></div></article>`).join(""):'<div class="empty">सध्या उपलब्ध Products नाहीत.</div>';
  $("productGrid").querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
}
function addToCart(id){
  const p=products.find(x=>x.id===id); if(!p) return;
  const existing=cart.find(x=>x.productId===id && !x.custom);
  if(existing){if(existing.quantity>=Number(p.stock||0)) return toast("इतका Stock उपलब्ध नाही.");existing.quantity++;}
  else cart.push({productId:id,name:p.name,price:Number(p.price),quantity:1,custom:false,photoUrl:p.photoUrl||""});
  renderCart(); toast("वस्तू Cart मध्ये जोडली.");
}
$("addCustomBtn").onclick=()=>{
  const name=$("customName").value.trim(), quantity=$("customQty").value.trim();
  if(!name||!quantity) return toast("वस्तूचे नाव आणि प्रमाण भरा.");
  cart.push({name,quantityText:quantity,quantity:1,custom:true,price:0});
  $("customName").value="";$("customQty").value="";renderCart();show("cartDrawer");
};
function renderCart(){
  $("cartCount").textContent=cart.reduce((n,x)=>n+(x.custom?0:x.quantity),0);
  $("cartTotal").textContent=money(cart.reduce((n,x)=>n+(x.custom?0:x.price*x.quantity),0));
  $("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="row-card"><div class="grow"><h4>${esc(x.name)}</h4><p>${x.custom?`Custom request • ${esc(x.quantityText)}`:`${money(x.price)} × ${x.quantity} = ${money(x.price*x.quantity)}`}</p></div><div class="actions"><button class="danger" data-remove="${i}">काढा</button>${!x.custom?`<button data-minus="${i}">−</button><button data-plus="${i}">+</button>`:""}</div></div>`).join(""):'<div class="empty">Cart रिकामा आहे.</div>';
  $("cartItems").querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);renderCart();});
  $("cartItems").querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>{const x=cart[+b.dataset.minus];x.quantity--;if(x.quantity<=0)cart.splice(+b.dataset.minus,1);renderCart();});
  $("cartItems").querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>{const x=cart[+b.dataset.plus],p=products.find(p=>p.id===x.productId);if(x.quantity>=Number(p?.stock||0))return toast("इतका Stock उपलब्ध नाही.");x.quantity++;renderCart();});
}
$("placeOrderBtn").onclick=async()=>{
  if(!currentUser) return toast("ऑर्डर देण्यासाठी आधी Login कर.");
  if(!cart.length) return toast("Cart रिकामा आहे.");
  const lines=cart.map(x=>({...x,quantity:Number(x.quantity||1)}));
  const total=lines.reduce((n,x)=>n+(x.custom?0:x.price*x.quantity),0);
  try{
    await addDoc(collection(db,"orders"),{userId:currentUser.uid,customerName:userProfile?.name||currentUser.displayName||"",customerPhone:userProfile?.phone||"",items:lines,total,paymentMethod:"Cash / UPI at store",pickupStatus:"Pending",note:$("orderNote").value.trim(),createdAt:serverTimestamp()});
    cart=[];renderCart();$("orderNote").value="";say("cartMessage","ऑर्डर पाठवली! Admin किंमत/उपलब्धता तपासून संपर्क करेल.");toast("Pickup order पाठवली.");
  }catch(e){say("cartMessage",friendlyError(e));}
};
function renderCustomerOrders(){
  if(!currentUser){$("ordersList").innerHTML='<div class="empty">ऑर्डर्स पाहण्यासाठी Login कर.</div>';return;}
  const q=query(collection(db,"orders"),where("userId","==",currentUser.uid));
  const unsub=onSnapshot(q,snap=>{
    const arr=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    $("ordersList").innerHTML=arr.length?arr.map(o=>`<article class="order-card"><div class="section-title"><strong>ऑर्डर #${esc(o.id.slice(0,7))}</strong><span class="pill">${esc(o.pickupStatus||"Pending")}</span></div><p class="muted">${dateText(o.createdAt)}</p><ul>${(o.items||[]).map(i=>`<li>${esc(i.name)} — ${i.custom?esc(i.quantityText):`${i.quantity} × ${money(i.price)}`}</li>`).join("")}</ul><strong>निश्चित किंमत: ${money(o.total)}</strong><p class="muted">Pickup only • Cash / UPI at store</p></article>`).join(""):'<div class="empty">अजून ऑर्डर नाही.</div>';
  },e=>console.error(e)); unsubscribe.push(unsub);
}
function renderOffers(){
  $("offersList").innerHTML=offers.filter(o=>o.active!==false).length?offers.filter(o=>o.active!==false).map(o=>`<article class="offer-card"><span class="pill">ऑफर</span><h3>${esc(o.title)}</h3><p>${esc(o.body)}</p>${o.endDate?`<p class="muted">शेवटची तारीख: ${esc(o.endDate)}</p>`:""}<p class="muted small">${dateText(o.createdAt)}</p></article>`).join(""):'<div class="empty">सध्या ऑफर उपलब्ध नाही.</div>';
  $("offerBadge").classList.toggle("hidden",!offers.some(o=>o.active!==false));
}
$("sendFeedbackBtn").onclick=async()=>{
  if(!currentUser)return say("feedbackMessage","Feedback पाठवण्यासाठी Login कर.");
  const text=$("feedbackText").value.trim();if(!text)return say("feedbackMessage","अभिप्राय लिही.");
  try{await addDoc(collection(db,"feedback"),{userId:currentUser.uid,customerName:userProfile?.name||"",rating:Number($("feedbackRating").value),text,createdAt:serverTimestamp()});$("feedbackText").value="";say("feedbackMessage","Feedback पाठवला. धन्यवाद!");}
  catch(e){say("feedbackMessage",friendlyError(e));}
};
function renderAdmin(){
  if(!isAdmin)return;
  $("customerCount").textContent="…";$("adminProductCount").textContent=products.length;
  renderAdminProducts();renderAdminOrders();renderAdminFeedback();renderAdminOffers();renderCustomRequests();
  getDocs(collection(db,"users")).then(s=> $("customerCount").textContent=s.docs.filter(d=>d.data().role!=="admin").length).catch(()=> $("customerCount").textContent="—");
  getDocs(collection(db,"orders")).then(s=> $("adminOrderCount").textContent=s.size).catch(()=>{});
  getDocs(collection(db,"feedback")).then(s=> $("adminFeedbackCount").textContent=s.size).catch(()=>{});
  getDoc(doc(db,"settings","store")).then(s=>{if(s.exists()){const d=s.data();$("settingStoreName").value=d.name||"";$("settingStoreAddress").value=d.address||"";$("settingStorePhone").value=d.phone||"";$("settingMaps").value=d.mapsUrl||"";}}).catch(()=>{});
}
function renderAdminProducts(){
  if(!isAdmin)return;
  const term=$("adminProductSearch").value.toLowerCase();
  const list=products.filter(p=>(p.name||"").toLowerCase().includes(term));
  $("adminProductsList").innerHTML=list.length?list.map(p=>`<div class="row-card"><img src="${esc(p.photoUrl||"https://placehold.co/100?text=Item")}" alt=""><div class="grow"><h4>${esc(p.name)}</h4><p>${money(p.price)} • Stock: ${Number(p.stock||0)} • ${p.available===false?"लपवले":"उपलब्ध"}</p><div class="actions"><button data-edit="${p.id}">Edit</button><button class="secondary" data-toggle="${p.id}">${p.available===false?"उपलब्ध करा":"लपवा"}</button><button class="danger" data-delete="${p.id}">Delete</button></div></div></div>`).join(""):'<div class="empty">Products नाहीत.</div>';
  $("adminProductsList").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editProduct(b.dataset.edit));
  $("adminProductsList").querySelectorAll("[data-toggle]").forEach(b=>b.onclick=async()=>{const p=products.find(x=>x.id===b.dataset.toggle);await updateDoc(doc(db,"products",p.id),{available:p.available===false});});
  $("adminProductsList").querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(confirm("हा Product delete करायचा?"))await deleteDoc(doc(db,"products",b.dataset.delete));});
}
function editProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  $("editProductId").value=p.id;$("productName").value=p.name||"";$("productCategory").value=p.category||"";$("productPrice").value=p.price??"";$("productStock").value=p.stock??"";$("productAvailable").checked=p.available!==false;
  $("productFormTitle").textContent="Product Edit करा";$("saveProductBtn").textContent="बदल सेव्ह करा";show("cancelProductEditBtn");window.scrollTo({top:$("productFormTitle").getBoundingClientRect().top+scrollY-20,behavior:"smooth"});
}
$("cancelProductEditBtn").onclick=resetProductForm;
function resetProductForm(){["editProductId","productName","productCategory","productPrice","productStock"].forEach(id=>$(id).value="");$("productPhoto").value="";$("productAvailable").checked=true;$("productFormTitle").textContent="Product जोडा";$("saveProductBtn").textContent="Product सेव्ह करा";show("cancelProductEditBtn",false);}
$("saveProductBtn").onclick=async()=>{
  if(!isAdmin)return;
  const id=$("editProductId").value,name=$("productName").value.trim(),category=$("productCategory").value.trim(),price=Number($("productPrice").value),stock=Number($("productStock").value),file=$("productPhoto").files[0];
  if(!name||!Number.isFinite(price)||price<0||!Number.isFinite(stock)||stock<0)return say("productMessage","नाव, योग्य किंमत आणि Stock भरा.");
  try{
    const data={name,category,price,stock,available:$("productAvailable").checked,updatedAt:serverTimestamp()};
    if(file){if(file.size>5*1024*1024)return say("productMessage","फोटो 5 MB पेक्षा कमी ठेवा.");const storageRef=ref(storage,`products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`);await uploadBytes(storageRef,file);data.photoUrl=await getDownloadURL(storageRef);data.photoPath=storageRef.fullPath;}
    if(id)await updateDoc(doc(db,"products",id),data);else await addDoc(collection(db,"products"),{...data,createdAt:serverTimestamp()});
    resetProductForm();say("productMessage","Product सेव्ह झाला.");
  }catch(e){say("productMessage",friendlyError(e));}
};
$("saveSettingsBtn").onclick=async()=>{
  if(!isAdmin)return;
  try{await setDoc(doc(db,"settings","store"),{name:$("settingStoreName").value.trim(),address:$("settingStoreAddress").value.trim(),phone:$("settingStorePhone").value.trim(),mapsUrl:$("settingMaps").value.trim(),updatedAt:serverTimestamp()},{merge:true});say("settingsMessage","दुकानाची माहिती सेव्ह झाली.");}
  catch(e){say("settingsMessage",friendlyError(e));}
};
$("publishOfferBtn").onclick=async()=>{
  if(!isAdmin)return;
  const title=$("offerTitle").value.trim(),body=$("offerBody").value.trim();
  if(!title||!body)return say("offerMessage","Offer चे शीर्षक आणि मजकूर भरा.");
  try{await addDoc(collection(db,"offers"),{title,body,endDate:$("offerEndDate").value||"",active:true,createdAt:serverTimestamp(),createdBy:currentUser.uid});$("offerTitle").value="";$("offerBody").value="";$("offerEndDate").value="";say("offerMessage","Offer Publish झाली.");}
  catch(e){say("offerMessage",friendlyError(e));}
};
function renderAdminOffers(){
  if(!isAdmin)return;
  $("adminOffersList").innerHTML=offers.length?offers.map(o=>`<div class="row-card"><div class="grow"><h4>${esc(o.title)}</h4><p>${esc(o.body)}</p><p class="muted">${o.active===false?"बंद":"चालू"}</p></div><div class="actions"><button data-offer-toggle="${o.id}">${o.active===false?"चालू करा":"बंद करा"}</button></div></div>`).join(""):'<div class="empty">अजून Offers नाहीत.</div>';
  $("adminOffersList").querySelectorAll("[data-offer-toggle]").forEach(b=>b.onclick=async()=>{const o=offers.find(x=>x.id===b.dataset.offerToggle);await updateDoc(doc(db,"offers",o.id),{active:o.active===false});});
}
function renderAdminOrders(){
  if(!isAdmin)return;
  getDocs(query(collection(db,"orders"),orderBy("createdAt","desc"))).then(s=>{
    const arr=s.docs.map(d=>({id:d.id,...d.data()}));
    $("adminOrdersList").innerHTML=arr.length?arr.map(o=>`<div class="row-card"><div class="grow"><h4>${esc(o.customerName||"ग्राहक")} • ${esc(o.customerPhone||"फोन नाही")}</h4><p class="muted">${dateText(o.createdAt)} • ${money(o.total)}</p><ul>${(o.items||[]).map(i=>`<li>${esc(i.name)} — ${i.custom?esc(i.quantityText):`${i.quantity} × ${money(i.price)}`}</li>`).join("")}</ul><p>Pickup Status: <strong>${esc(o.pickupStatus||"Pending")}</strong></p><p class="muted">${esc(o.note||"")}</p><div class="actions"><button data-status="${o.id}" data-value="Accepted">Accept</button><button data-status="${o.id}" data-value="Ready for Pickup">Ready</button><button data-status="${o.id}" data-value="Picked Up">Picked Up</button><button class="danger" data-status="${o.id}" data-value="Cancelled">Cancel</button></div></div></div>`).join(""):'<div class="empty">अजून Orders नाहीत.</div>';
    $("adminOrdersList").querySelectorAll("[data-status]").forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,"orders",b.dataset.status),{pickupStatus:b.dataset.value,updatedAt:serverTimestamp()});});
  }).catch(e=>console.error(e));
}
function renderCustomRequests(){
  if(!isAdmin)return;
  getDocs(query(collection(db,"orders"),orderBy("createdAt","desc"))).then(s=>{
    const arr=s.docs.map(d=>({id:d.id,...d.data()})).filter(o=>(o.items||[]).some(i=>i.custom));
    $("customRequestsList").innerHTML=arr.length?arr.map(o=>`<div class="row-card"><div class="grow"><h4>${esc(o.customerName||"ग्राहक")} • ${esc(o.customerPhone||"")}</h4>${o.items.filter(i=>i.custom).map(i=>`<p><strong>${esc(i.name)}</strong> — ${esc(i.quantityText)} <span class="pill">किंमत मंजूर करायची</span></p>`).join("")}<p class="muted">ऑर्डर #${esc(o.id.slice(0,7))}</p></div></div>`).join(""):'<div class="empty">Custom Requests नाहीत.</div>';
  }).catch(()=>{});
}
function renderAdminFeedback(){
  if(!isAdmin)return;
  getDocs(query(collection(db,"feedback"),orderBy("createdAt","desc"))).then(s=>{
    const arr=s.docs.map(d=>({id:d.id,...d.data()}));
    $("adminFeedbackList").innerHTML=arr.length?arr.map(f=>`<article class="feedback-card"><strong>${esc(f.customerName||"ग्राहक")} • ${"★".repeat(Math.max(1,Math.min(5,Number(f.rating||1))))}</strong><p>${esc(f.text)}</p><p class="muted">${dateText(f.createdAt)}</p></article>`).join(""):'<div class="empty">Feedback नाही.</div>';
  }).catch(()=>{});
}
if(initFirebase()){
  onAuthStateChanged(auth,async user=>{
    stopListeners();currentUser=user;isAdmin=false;userProfile=null;
    if(user){try{await loadProfile(user);}catch(e){console.error(e);toast("Profile वाचता आला नाही.");}}
    else setUserUI();
    unsubscribe.push(subscribe("products",arr=>{products=arr;renderProducts();if(isAdmin)renderAdminProducts();}));
    unsubscribe.push(subscribe("offers",arr=>{offers=arr;renderOffers();if(isAdmin)renderAdminOffers();}));
    unsubscribe.push(onSnapshot(doc(db,"settings","store"),snap=>{
      if(snap.exists()){const s=snap.data();$("storeName").textContent=s.name||"माझे किराणा दुकान";$("storeAddress").textContent=s.address||"दुकानाचा पत्ता सेट केलेला नाही";$("storePhone").textContent=s.phone||"";}
    }));
    renderCart();
  });
} else {
  $("productGrid").innerHTML='<div class="empty">Firebase जोडण्यासाठी firebase-config.js मधील माहिती भरा. सेटअपसाठी README.md वाचा.</div>';
}
