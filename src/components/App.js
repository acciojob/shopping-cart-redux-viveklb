
import React, { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./../styles/App.css";
import {
  addToCart, applyDiscount, clearDiscount, COUPONS, decreaseQuantity,
  increaseQuantity, PRODUCTS, removeFromCart, store, toggleWishlist,
} from "./../store";

const money = (amount) => `$${amount.toFixed(2)}`;

function Storefront() {
  const dispatch = useDispatch();
  const { cart, wishlist, discount } = useSelector((state) => state);
  const [activeView, setActiveView] = useState("shop");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const visibleProducts = activeView === "wishlist" ? PRODUCTS.filter((product) => wishlist.includes(product.id)) : PRODUCTS;
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discountAmount = discount ? subtotal * discount.percent / 100 : 0;
  const total = subtotal - discountAmount;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCouponSubmit = (event) => {
    event.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      dispatch(applyDiscount(code, COUPONS[code]));
      setCouponMessage(`${code} applied. You saved ${COUPONS[code]}%.`);
      setCouponCode("");
    } else {
      setCouponMessage("That code isn't valid. Try WELCOME15 or SAVE10.");
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(clearDiscount());
    setCouponMessage("");
  };

  return (
    <div className="storefront">
      <div className="announcement">Thoughtful things for everyday living <span>Free shipping over $75</span></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Morrow home">morrow<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeView === "shop" ? "nav-link active" : "nav-link"} onClick={() => setActiveView("shop")}>Shop all</button>
          <button className={activeView === "wishlist" ? "nav-link active" : "nav-link"} onClick={() => setActiveView("wishlist")}>Wishlist <span className="nav-count">{wishlist.length}</span></button>
        </nav>
        <button className="bag-link" onClick={() => document.getElementById("cart-panel").scrollIntoView({ behavior: "smooth", block: "start" })}>
          Your bag <span className="bag-count">{itemCount}</span>
        </button>
      </header>

      <main id="top" className="page-shell">
        <section className="collection-intro">
          <div>
            <p className="eyebrow">THE EVERYDAY EDIT · 01—06</p>
            <h1>{activeView === "wishlist" ? "Kept close." : "Make room for"}<br />{activeView === "wishlist" ? "Your favourites." : <em>the little things.</em>}</h1>
            <p className="intro-copy">Considered objects, made to be lived with.<br className="desktop-break" /> A slower kind of lovely, for every corner.</p>
          </div>
          <div className="intro-stamp" aria-hidden="true"><span>made for</span><strong>the<br />everyday</strong><i>✳</i></div>
        </section>

        <div className="content-layout">
          <section className="catalog" aria-label={activeView === "wishlist" ? "Wishlist products" : "Shop products"}>
            <div className="section-heading">
              <h2>{activeView === "wishlist" ? "Your wishlist" : "Pieces to keep"}</h2>
              <span>{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
            </div>
            {visibleProducts.length > 0 ? (
              <div className="product-grid">
                {visibleProducts.map((product, index) => {
                  const isSaved = wishlist.includes(product.id);
                  return (
                    <article className="product-card" key={product.id} data-testid="product-card" style={{ "--card-index": index }}>
                      <div className="product-image-wrap">
                        <img src={product.image} alt={product.imageAlt} className="product-image" />
                        <button className={isSaved ? "save-button saved" : "save-button"} onClick={() => dispatch(toggleWishlist(product.id))} aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={isSaved} data-testid={`wishlist-${product.id}`}>{isSaved ? "Saved" : "Save"}</button>
                      </div>
                      <div className="product-meta"><span>{product.category}</span><span>{product.color}</span></div>
                      <div className="product-title-row"><h3>{product.name}</h3><span className="product-price">{money(product.price)}</span></div>
                      <button className="add-button" onClick={() => dispatch(addToCart(product))} data-testid={`add-to-cart-${product.id}`}>Add to cart <span aria-hidden="true">+</span></button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-wishlist">
                <span className="empty-mark" aria-hidden="true">♡</span>
                <h3>A little space for something lovely.</h3>
                <p>Your saved pieces will find a home here.</p>
                <button className="text-button" onClick={() => setActiveView("shop")}>Explore the collection <span aria-hidden="true">→</span></button>
              </div>
            )}
          </section>

          <aside className="cart-panel" id="cart-panel" aria-label="Shopping cart">
            <div className="cart-heading"><div><p className="eyebrow">THE GOOD THINGS</p><h2>Your bag <span>({itemCount})</span></h2></div><span className="cart-flower" aria-hidden="true">✳</span></div>
            {cart.length ? (
              <div className="cart-items">
                {cart.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id} data-testid="cart-item">
                    <img src={product.image} alt="" className="cart-thumb" />
                    <div className="cart-item-info">
                      <h3>{product.name}</h3><span className="cart-item-category">{product.category}</span>
                      <div className="quantity-control" aria-label={`${product.name} quantity`}>
                        <button aria-label={`Decrease quantity of ${product.name}`} onClick={() => dispatch(decreaseQuantity(product.id))} data-testid={`decrease-${product.id}`}>−</button>
                        <span aria-live="polite">{quantity}</span>
                        <button aria-label={`Increase quantity of ${product.name}`} onClick={() => dispatch(increaseQuantity(product.id))} data-testid={`increase-${product.id}`}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-end"><span>{money(product.price * quantity)}</span><button className="remove-button" aria-label={`Remove ${product.name} from cart`} onClick={() => dispatch(removeFromCart(product.id))} data-testid={`remove-${product.id}`}>Remove</button></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-cart"><span aria-hidden="true">01</span><p>Your bag is waiting<br />for a little something.</p><small>Good things start with one.</small></div>
            )}

            <div className="coupon-area">
              <form className="coupon-form" onSubmit={handleCouponSubmit}>
                <label htmlFor="coupon-code">A little thank-you</label>
                <div className="coupon-input-row"><input id="coupon-code" data-testid="coupon-input" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter a code" aria-label="Coupon code" /><button type="submit" data-testid="apply-coupon">Apply</button></div>
              </form>
              {couponMessage && <p className={discount ? "coupon-message success" : "coupon-message"} role="status">{couponMessage}</p>}
              {discount && <p className="active-coupon">{discount.code} · {discount.percent}% off <button onClick={handleRemoveDiscount}>Remove</button></p>}
              <p className="coupon-hint">Try <button onClick={() => setCouponCode("WELCOME15")}>WELCOME15</button> or <button onClick={() => setCouponCode("SAVE10")}>SAVE10</button></p>
            </div>

            <div className="order-summary">
              <div><span>Subtotal</span><span data-testid="cart-subtotal">{money(subtotal)}</span></div>
              {discount && <div className="discount-line"><span>Discount ({discount.percent}%)</span><span data-testid="cart-discount">−{money(discountAmount)}</span></div>}
              <div><span>Shipping</span><span>On us</span></div>
              <div className="total-line"><strong>Total</strong><strong data-testid="cart-total">{money(total)}</strong></div>
            </div>
            <button className="checkout-button" disabled={!cart.length}>{cart.length ? "Continue to checkout" : "Your bag is empty"}<span aria-hidden="true">→</span></button>
            <p className="secure-note"><span aria-hidden="true">✳</span> Packed with care, always.</p>
          </aside>
        </div>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top">morrow<span>.</span></a><p>Made for the everyday.</p><span>Good things, kept simple.</span></footer>
    </div>
  );
}

const App = () => <Provider store={store}><Storefront /></Provider>;

export default App;
