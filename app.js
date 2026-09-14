const CONFIG=window.MASE_DAY_CONFIG||{};
const DEFAULT_PRODUCTS=[
{id:"sunny-01",name:"Here Comes the Sun",price:8,type:"digital",color:"#f9a7c4",description:"A warm, happy printable for any cozy corner.",image:""},
{id:"bloom-02",name:"Bloom Anyway",price:9,type:"digital",color:"#b9dcb3",description:"Soft florals and a little reminder to keep growing.",image:""},
{id:"daydream-03",name:"Pink Daydream",price:24,type:"physical",color:"#f7c2d5",description:"A dreamy art print, packed and shipped with care.",image:""},
{id:"golden-04",name:"Golden Hour",price:8,type:"digital",color:"#ffc87d",description:"Sunset warmth for your wall in an instant download.",image:""},
{id:"kind-05",name:"Be Kind to Your Mind",price:10,type:"digital",color:"#cabee8",description:"A sweet daily reminder in playful pink type.",image:""},
{id:"smile-06",name:"Smiley Sunshine",price:28,type:"physical",color:"#ffe16b",description:"A bright premium print that makes the room smile.",image:""}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
let products=load("maseday_products",DEFAULT_PRODUCTS),cart=load("maseday_cart",[]),filter="all";
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:CONFIG.CURRENCY||"USD"}).format(n);
const save=()=>{localStorage.setItem("maseday_products",JSON.stringify(products));localStorage.setItem("maseday_cart",JSON.stringify(cart))};
function renderProducts(){
 const shown=products.filter(p=>filter==="all"||p.type===filter);
 $("#productGrid").innerHTML=shown.map(p=>`<article class="product-card">
 <div class="product-art ${p.image?"has-image":""}" style="--card-color:${p.color};${p.image?`background-image:url('${escapeHtml(p.image)}')`:""}">
 <span class="type-pill">${p.type}</span>${p.image?"":`<div class="poster"><div><div class="poster-sun">☀</div><small>${escapeHtml(p.name)}</small></div></div>`}</div>
 <div class="product-info"><div class="product-top"><h3>${escapeHtml(p.name)}</h3><strong>${money(p.price)}</strong></div><p>${escapeHtml(p.description)}</p>
 <button class="add-button" data-add="${p.id}">add to bag</button></div></article>`).join("");
 $("#emptyState").classList.toggle("hidden",shown.length>0);
 $$("[data-add]").forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function addToCart(id){const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});save();renderCart();toast("Added to your sunny bag ☀")}
function cartProducts(){return cart.map(i=>({item:i,product:products.find(p=>p.id===i.id)})).filter(x=>x.product)}
function renderCart(){const rows=cartProducts();$("#cartCount").textContent=rows.reduce((a,x)=>a+x.item.qty,0);$("#cartItems").innerHTML=rows.length?rows.map(({item,product:p})=>`<div class="cart-item"><div class="cart-thumb" style="background:${p.color}">☀</div><div><h4>${escapeHtml(p.name)}</h4><p>${p.type} · qty ${item.qty}</p><button class="remove" data-remove="${p.id}">remove</button></div><strong>${money(p.price*item.qty)}</strong></div>`).join(""):`<div class="empty-cart">Your bag is waiting for sunshine.</div>`;const total=rows.reduce((a,x)=>a+x.product.price*x.item.qty,0);$("#cartTotal").textContent=$("#checkoutTotal").textContent=money(total);$("#cartFooter").classList.toggle("hidden",!rows.length);$$("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.id!==b.dataset.remove);save();renderCart()})}
function openThing(id){closeAll();$("#"+id).classList.add("open");$("#"+id).setAttribute("aria-hidden","false");$("#scrim").classList.add("show");document.body.style.overflow="hidden"}
function closeAll(){$$(".drawer,.modal").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});$("#scrim").classList.remove("show");document.body.style.overflow=""}
$$("[data-open]").forEach(b=>b.onclick=()=>{if(b.dataset.open==="accountModal")renderAccount();openThing(b.dataset.open)});$$("[data-close]").forEach(b=>b.onclick=closeAll);$("#scrim").onclick=closeAll;
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderProducts()});
function hasPhysical(){return cartProducts().some(x=>x.product.type==="physical")}
$("#checkoutButton").onclick=()=>{closeAll();$("#shippingFields").classList.toggle("hidden",!hasPhysical());$$("#shippingFields input").forEach(i=>i.required=hasPhysical()&&["shipName","address1","city","state","zip"].includes(i.id));openThing("checkoutModal")};
const sampleAddresses=["123 Sunshine Lane, Phoenix, AZ 85001","123 Sunnyvale Road, Surprise, AZ 85374","123 Sunflower Street, Scottsdale, AZ 85250"];
$("#address1").addEventListener("input",e=>{const q=e.target.value.toLowerCase();const hits=q.length>2?sampleAddresses.filter(a=>a.toLowerCase().includes(q)):[];$("#addressSuggestions").innerHTML=hits.map(a=>`<button type="button">${a}</button>`).join("");$("#addressSuggestions").classList.toggle("hidden",!hits.length);$$("#addressSuggestions button").forEach(b=>b.onclick=()=>{const parts=b.textContent.split(", ");$("#address1").value=parts[0];$("#city").value=parts[1];const sz=parts[2].split(" ");$("#state").value=sz[0];$("#zip").value=sz[1];$("#addressSuggestions").classList.add("hidden")})});
$("#checkoutForm").onsubmit=e=>{e.preventDefault();if(!CONFIG.STRIPE_PAYMENT_LINK){const orders=load("maseday_orders",[]);orders.unshift({id:"MD-"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString(),total:$("#checkoutTotal").textContent,status:"Demo order"});localStorage.setItem("maseday_orders",JSON.stringify(orders));toast("Demo order saved—add Stripe to take payment");closeAll();cart=[];save();renderCart();return}localStorage.setItem("maseday_checkout_email",$("#checkoutEmail").value);location.href=CONFIG.STRIPE_PAYMENT_LINK};
function parseJwt(token){try{return JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")))}catch{return null}}
function setUser(u){localStorage.setItem("maseday_user",JSON.stringify(u));renderAccount()}
window.handleGoogleCredential=r=>{const p=parseJwt(r.credential);if(p)setUser({name:p.name,email:p.email,picture:p.picture})};
function setupGoogle(){if(CONFIG.GOOGLE_CLIENT_ID&&window.google){$("#demoLogin").classList.add("hidden");$(".setup-note").classList.add("hidden");google.accounts.id.initialize({client_id:CONFIG.GOOGLE_CLIENT_ID,callback:handleGoogleCredential});google.accounts.id.renderButton($("#googleButton"),{theme:"outline",size:"large",width:350})}}
setTimeout(setupGoogle,900);
$("#demoLogin").onclick=()=>setUser({name:"Mase Day Friend",email:"demo@maseday.shop"});
function renderAccount(){const u=load("maseday_user",null);$("#signedOutView").classList.toggle("hidden",!!u);$("#signedInView").classList.toggle("hidden",!u);if(!u)return;$("#accountName").textContent=u.name;$("#accountEmail").textContent=u.email;$("#avatar").textContent=u.name[0].toUpperCase();const orders=load("maseday_orders",[]);$("#ordersList").innerHTML=orders.length?orders.map(o=>`<div class="order-card"><strong>${o.id}</strong> · ${o.date}<br>${o.total} · ${o.status}</div>`).join(""):"<p>No orders yet. Your first sunny find will appear here!</p>"}
$("#signOut").onclick=()=>{localStorage.removeItem("maseday_user");renderAccount()};
$("#adminShortcut").onclick=()=>openThing("adminModal");
$("#unlockAdmin").onclick=()=>{if($("#adminPin").value===String(CONFIG.ADMIN_PIN)){$("#adminLock").classList.add("hidden");$("#adminPanel").classList.remove("hidden");renderAdmin()}else toast("That PIN isn't right")};
function renderAdmin(){$("#adminProducts").innerHTML=products.map(p=>`<div class="admin-row"><span>${escapeHtml(p.name)} · ${money(p.price)}</span><span><button data-edit="${p.id}">edit</button> <button data-delete="${p.id}">delete</button></span></div>`).join("");$$("[data-edit]").forEach(b=>b.onclick=()=>editProduct(b.dataset.edit));$$("[data-delete]").forEach(b=>b.onclick=()=>{products=products.filter(p=>p.id!==b.dataset.delete);save();renderProducts();renderAdmin()})}
function editProduct(id){const p=products.find(x=>x.id===id);$("#editingId").value=p.id;$("#productName").value=p.name;$("#productPrice").value=p.price;$("#productDescription").value=p.description;$("#productType").value=p.type;$("#productColor").value=p.color;$("#productImage").value=p.image||""}
$("#productForm").onsubmit=e=>{e.preventDefault();const id=$("#editingId").value||"art-"+Date.now();const p={id,name:$("#productName").value,price:+$("#productPrice").value,type:$("#productType").value,color:$("#productColor").value,description:$("#productDescription").value,image:$("#productImage").value};const i=products.findIndex(x=>x.id===id);i>=0?products[i]=p:products.unshift(p);save();e.target.reset();$("#editingId").value="";$("#productColor").value="#f9a7c4";renderProducts();renderAdmin();toast("Listing saved locally")};
$("#resetProducts").onclick=()=>{products=structuredClone(DEFAULT_PRODUCTS);save();renderProducts();renderAdmin();toast("Sample products restored")};
function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2500)}
$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();renderAccount();