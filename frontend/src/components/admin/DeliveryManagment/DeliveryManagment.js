import React, { useState, Fragment } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import './del.css'
import AddDelivery from './AddDelivery'
import FetchAllDelivery from './FetchAllDelivery'

const DeliveryManagment = (props) => {
  const [add, showAdd] = useState(true)
  const [editDelivery, setEditDelivery] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  function getDeliveryDetails(delivery) {
    console.log(delivery)
    setEditDelivery(delivery)
    setIsEdit(true)
  }

  return (
    // <Router>
    <div>
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='h2'>Delivery Management</h1>
      </div>

      <Button
        id='kkbtn1'
        className='btn btn-secondary'
        onClick={() => showAdd(!add)}
      >
        <i className='fas fa-plus'></i>{' '}
        {isEdit ? 'Edit Delivery' : 'Add New Delivery'}
      </Button>

      {/* <Route path="admin/add" exact component={AddDelivery} /> */}
      {add ? (
        <FetchAllDelivery
          add={add}
          addChange={showAdd}
          getDelivery={getDeliveryDetails}
        />
      ) : (
        <AddDelivery editDelivery={editDelivery} isEdit={isEdit} />
      )}
    </div>
    // </Router>
  )
}

export default DeliveryManagment
