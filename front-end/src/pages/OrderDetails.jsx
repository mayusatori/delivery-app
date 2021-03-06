/* eslint-disable prefer-destructuring */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getSaleById, updateStatus } from '../services/calls';
import useLocalStorage from '../hooks/useLocalStorage';
import Table from '../components/Table';
import './styles/ordersDetails.css';
import Loading from '../components/Loading';

const fetchOrderDetails = async (id, token) => {
  const response = await getSaleById(id, token);
  return response.data;
};

export default function OrderDetails() {
  let fakeId;
  const DATA_ID_DETAILS = 'customer_order_details';
  const { realAndFakeId } = useParams();
  const id = realAndFakeId.split('&')[0];
  fakeId = realAndFakeId.split('&')[1];
  if (fakeId === undefined) { fakeId = ''; }
  const [user] = useLocalStorage('user', {});
  const columns = [
    'Item', 'Descrição', 'Quantidade', 'Valor Unitário', 'Sub-total'];
  const { data, isLoading, isError, refetch } = useQuery(
    'orderDetails', () => fetchOrderDetails(id, user.token),
  );

  const newSaleDate = data && new Date(data.saleDate);
  const NUMBER_DATE = 9;
  const day = data && (newSaleDate.getDate() <= NUMBER_DATE
    ? `0${newSaleDate.getDate()}` : newSaleDate.getDate());
  const month = data && (newSaleDate.getMonth() <= NUMBER_DATE
    ? `0${newSaleDate.getMonth() + 1}` : (newSaleDate.getMonth() + 1));
  const year = data && newSaleDate.getFullYear();

  const handleStatus = async () => {
    const status = {
      status: 'Entregue',
    };

    await updateStatus(id, status, user.token);
    refetch();
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Deu ruim</div>;

  console.log(data);

  return (
    <div
      className="c-order-details"
    >
      <h1 className="order-details__page-title">Detalhe do Pedido</h1>
      <main className="main-order-details">
        <div
          className="order-details__header"
        >
          <p
            data-testid={ `${DATA_ID_DETAILS}__element-order-details-label-order-id` }
            className="order-details__order-id"
          >
            {`PEDIDO ${fakeId}`}
          </p>
          <p
            data-testid={ `${DATA_ID_DETAILS}__element-order-details-label-seller-name` }
          >
            P. Vend: Fulana Pereira
          </p>
          <p
            data-testid={ `${DATA_ID_DETAILS}__element-order-details-label-order-date` }
            className="order-details__date"
          >
            {`${day}/${month}/${year}`}

          </p>
          <p
            data-testid={
              `${DATA_ID_DETAILS}__element-order-details-label-delivery-status`
            }
            className="order-details__status"
          >
            {data.status}

          </p>
          <button
            type="button"
            data-testid="customer_order_details__button-delivery-check"
            onClick={ handleStatus }
            className="order-details__shipped-btn"
            disabled={ data.status !== 'Em trânsito' }
          >
            MARCAR COMO ENTREGUE
          </button>
        </div>
        <Table
          columns={ columns }
          total={ data.totalPrice.toString().replace('.', ',') }
          items={ data.products }
          testIdNumber="customer_order_details__element-order-table-item-number-"
          testIdName="customer_order_details__element-order-table-name-"
          testIdQuantity="customer_order_details__element-order-table-quantity-"
          testIdUnitPrice="customer_order_details__element-order-table-unit-price-"
          testIdSubTotal="customer_order_details__element-order-table-sub-total-"
          testIdTotal="customer_order_details__element-order-total-price"
          thereIsButton={ false }
        />
      </main>
    </div>
  );
}
