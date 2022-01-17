import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Button, Row, Col } from 'react-bootstrap'
import AddOrders from './AddOrders'
import FetchAllOrders from './FetchAllOrders'
import './del.css'
import Navbar from '../layout/Navbar'

const Orders = (props) => {
  const [add, showAdd] = useState(true)
  const [editOrder, setEditOrder] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  function getOrderDetails(order) {
    console.log(order)
    setEditOrder(order)
    setIsEdit(true)
  }

  return (
    // <Router>
    <Fragment>
      <Navbar />
      <div>
        {/* <Header/> */}

        <Row className='align-items-center'>
          <Col className='text-right'>
            <Button
              className='btn btn-sm  btn-dark knbtn-position'
              onClick={() => showAdd(!add)}
            >
              <i className='fas fa-plus'></i>{' '}
              {isEdit ? 'Edit Order' : 'Add New Order'}
            </Button>
          </Col>
        </Row>

        {/* <Route path="admin/add" exact component={AddOrder} /> */}
        {add ? (
          <FetchAllOrders
            add={add}
            addChange={showAdd}
            getOrder={getOrderDetails}
          />
        ) : (
          <AddOrders editOrder={editOrder} isEdit={isEdit} />
        )}
      </div>
    </Fragment>
    // </Router>
  )
}

Orders.propTypes = {}

export default Orders
