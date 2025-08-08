import React, { useState, useEffect } from 'react'; 
import { FaShoppingCart } from 'react-icons/fa';



function Nav() {
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
      setCartItems(cart);
    };

    updateCart();

    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCartCount(updated.length);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace('$', ''));
  }, 0).toFixed(2);

  return (
    <>
      <div className="px-5 ng-light">
        <nav className="navbar navbar-light justify-content-between px-5 w-100">
          <a href="#" className="navbar-brand fs-3 fw-bold">Home</a>

          <div className="product-search flex-grow-1 d-flex justify-content-center">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search for products"
              aria-label="Search for products"
              style={{ maxWidth: '500px', borderRadius: '20px' }}
            />
          </div>

          <div
            className="cart-icon position-relative" style={{ cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}
          >
            <i className="bi bi-bag fs-4"></i>
            <span className="cart-qount">{cartCount}</span>
          </div>
        </nav>
      </div>

      {/* Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom"> 
          <h5 className="mb-0">Your Cart</h5>
          <button className="btn btn-sm btn-outline-dark bg-dark text-white" onClick={() => setIsCartOpen(false)}>
            Close
          </button>
        </div>

        <div className="cart-body p-3">
          {cartItems.length === 0 ? (
            <p className="alert alert-danger">Your Cart Is Empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="d-flex mb-3 align-items-center">
                <img src={item.image} width={60} height={60} className="me-3 rounded" alt="" />
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.ProductName}</h6>
                  <p className="mb-1">Price: ${item.price}</p>
                </div>
                <button className="btn btn-sm bg-dark text-white" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer d-flex justify-content-between align-items-center p-3 border-top">
            <h6>Total: ${totalPrice}</h6>
            <button className="btn btn-dark w-100 mt-2">Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav;
