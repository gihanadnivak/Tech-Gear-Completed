import { React, useEffect, useState } from 'react'
import axios from 'axios'
import imagelock from '../../img/lock.png'
import './ordercss.css'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  function fetchOrders() {
    axios
      .get('/api/orders/')
      .then((res) => {
        setOrders(res.data)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  function downloadOrderReport() {
    axios
      .get('/api/orders/report')
      .then((res) => {
        window.open('data:text/csv;charset=utf-8,' + escape(res.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='h2'>Order Management</h1>
        <ReactHTMLTableToExcel
          id='test-table-xls-button'
          className='download-table-xls-button'
          table='ordtable-to-xls'
          filename='tablexls'
          sheet='tablexls'
          buttonText='Generate Orders Report'
        />
      </div>
      <div>
        <h1 className='col-md-6 col-lg-6'>All Orders</h1>
        <h7>Admin purpose only</h7>
        <img src={imagelock} alt='imagelock' width='50' />
        <br></br>
        <div>
          <table
            class='table table-striped table-hover mt-3'
            id='ordtable-to-xls'
          >
            <thead>
              <tr>
                <th scope='col'>Customer_Name</th>
                <th scope='col'>Phone_Number</th>
                <th scope='col'>E-mail</th>
                <th scope='col'>Order_Items</th>
                {/* <th scope='col'>NIC</th> */}
                <th scope='col'>Quantity</th>
                <th scope='col'>Order_Date</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row._id}>
                  <td>{row.Cname}</td>
                  <td>{row.phone}</td>
                  {/* <td>{order.nic}</td> */}
                  <td>{row.email}</td>
                  <td>{row.orderitems}</td>
                  <td>{row.quantity}</td>
                  <td>{row.orderdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
