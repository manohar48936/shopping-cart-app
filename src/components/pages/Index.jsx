import React, { useEffect, useState } from 'react'
import productsData from '../../data/products.json' // Assuming you have a products.json file with product data
function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSortOption, setFilterSortOption] = useState('all');

    useEffect(() => {
        const handleSearchQuery = (e) => {
            setSearchQuery(e.detail.toLowerCase());
        };

        window.addEventListener('searchQueryChanged', handleSearchQuery);
        return () => window.removeEventListener('searchQueryChanged', handleSearchQuery);
    }, []);

    const handleFilterSort = () => {
        let filtered = [...productsData];

        if (filterSortOption === 'New' || filterSortOption === 'Sale') {
            filtered = filtered.filter(product => product.tag === filterSortOption);
        }
        if (filterSortOption === 'Low') {
            filtered.sort((a, b) =>
                parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
        }

        if (filterSortOption === 'high') {
            filtered.sort((a, b) =>
                parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
        }


        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(searchQuery)
            );
        }
        return filtered;
    };
    const displayProducts = handleFilterSort();
    const addToCart = (product) => {
        const existing = JSON.parse(localStorage.getItem('cart')) || [];
        const alreadyCart = existing.find(p => p.id === product.id);

        if (!alreadyCart) {
            const updatedProduct = { ...product, quantity: 1 };
            const updatedCart = [...existing, updatedProduct];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };


    return (
        <>
            <div className="shop-container">
                <div className="row">
                    <h1 className="text-white py-4 fw-semibold">Products</h1>

                    <div className="container my-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex gap-2">
                                showing <strong>{displayProducts.length}</strong> Product{displayProducts.length !== 1 && 's'} for "
                                {filterSortOption === 'all' ? 'All' : filterSortOption.charAt(0).toUpperCase() + filterSortOption.slice(1)}"
                            </div>
                            <div>
                                <select>
                                    <div className='form-select py-2 fs-6'
                                        style={{ minWidth: '260px', backgroundColor: '#f5f5f5', border: '0px' }}
                                        onClick={(e) => setFilterSortOption(e.target.value)}>
                                        <option value="all">All Products</option>
                                        <option value="New">New Products</option>
                                        <option value="Sale">Sale Products</option>
                                        <option value="low">Price: Low to High</option>
                                        <option value="high">Price: High to Low</option>
                                    </div>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {displayProducts.length === 0 ? (
                            <div className="col-12">
                                <div className="alert alert-danger text-center">
                                    No Product found Matching your search
                                </div>
                            </div>
                        ) : (
                            displayProducts.map(product => (
                                <div className="col-md-3 mb-4" key={product.id}>
                                    <div className="product-item text-center position-relative">
                                        <div className="product-image w-100 position-relative overflow-hidden">
                                            <img src={product.image} className="img-fluid" alt="" />
                                            <img src={product.secondImage} className='img-fluid' alt="" />
                                            <div className="product-icons gap-3">  
                                                <div className='product-icon' onClick={() => addToCart(product)}>
                                                    <i className="bi bi cart3"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index