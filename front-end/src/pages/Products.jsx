import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../services/calls';
import ProductCard from '../components/ProductCard';
import useLocalStorage from '../hooks/useLocalStorage';
import queryClient from '../react-query/queryClient';
import './styles/products.css';
import { setInitialCart } from '../app/slices/cartSlice';

// coloquei aqui fora por causa do linter
const fetchProducts = async (user) => {
  const response = await getAllProducts(user.token);
  return response.data;
};

export default function Products() {
  const [user] = useLocalStorage('user');
  const [localStorageCart, setLocalStorageCart] = useLocalStorage('cart', false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    data: productList,
    isError: productsFetchFailed,
    isLoading: productsIsFetching,
  } = useQuery('products', () => fetchProducts(user));

  useEffect(() => {
    if(localStorageCart) {
      dispatch(setInitialCart(localStorageCart))
    }
  }, []);
  
  useEffect(() => {
    if(cart.items.length){
      setLocalStorageCart(cart);
    }
  }, [cart]);

  if (productsIsFetching) return <p>Estou carregando aaa</p>;
  if (productsFetchFailed) {
    queryClient.cancelQueries('products');
    localStorage.removeItem('user');
    // eslint-disable-next-line no-alert
    alert('You session is closed. Please, login again');
    return <Redirect to="/" />;
  }
  return (
    <main className="main-products-container">
      <div className="cards-container">
        {productList.map((product) => (
          <ProductCard
            key={ product.id }
            id={ product.id }
            name={ product.name }
            imagePath={ product.url_image }
            price={ product.price }
          />
        ))}
      </div>
      <button
        type="button"
        onClick={ () => history.push('checkout') }
        disabled={ cart.total === 0 }
        id="card-button"
        data-testid="customer_products__button-cart"
        className="kart-button"
      >
        Ver carrinho:
        <span
          data-testid="customer_products__checkout-bottom-value"
        >
          { ` R$: ${cart.total.toFixed(2).toString().replace('.', ',')}` }
        </span>
      </button>
    </main>
  );
}
