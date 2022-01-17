import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './del.css'
import { Link } from 'react-router-dom'

import ReactHTMLTableToExcel from 'react-html-table-to-excel'

//add & get
const FetchAllDelivery = ({ add, addChange, getDelivery }) => {
  const [orders, setDeliverys] = useState([])
  // const classes = useStyles();
  useEffect(() => {
    const getDeliverys = () => {
      axios
        .get('/api/deliverys/')
        .then((res) => {
          console.log(res)
          setDeliverys(res.data)
        })
        .catch((err) => {
          alert(err.message)
        })
    }
    getDeliverys()
  }, [])

  console.log(orders.length)

  //Delete
  function deleteDelivery(deliveryId) {
    console.log(deliveryId)
    axios
      .delete('/api/deliverys/delete/' + deliveryId)
      .then((res) => {
        alert('Delivery deleted Successfully!!!')
        console.log(res)
        //setOrders(res.data)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  //edit
  function editDelivery(delivery) {
    console.log(delivery)
    addChange(!add)
    getDelivery(delivery)
  }

  //Search
  function HandleChange(searchText) {
    setDeliverys([])
    if (searchText === '') {
      searchText = '*'
    }

    axios
      .get('/api/deliverys/search/' + searchText)
      .then((res) => {
        console.log(searchText)
        console.log(res.data)

        if (res.data.length > 0) {
          setDeliverys(res.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //Genarate Report
  function downloadDeliveryReport() {
    axios
      .get('/api/deliverys/report')
      .then((res) => {
        window.open('data:text/csv;charset=utf-8,' + escape(res.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <h1 className='col-md-6 col-lg-6'>All Delivery</h1>
      <div>
        <br></br>
        <label class='form-check-label' for='inlineCheckbox2'>
          <b>Search Delivery</b>
        </label>
        <input
          type='text'
          className='search'
          onChange={(event) => {
            HandleChange(event.target.value)
          }}
        ></input>
      </div>

      <div className='container text-end'>
        <ReactHTMLTableToExcel
          id='test-table-xls-button'
          className='download-table-xls-button'
          table='deltable-to-xls'
          filename='tablexls'
          sheet='tablexls'
          buttonText='Generate Delivery Report'
        />
      </div>
      <br></br>
      <div>
        <table
          class='table table-striped table-hover mt-5'
          id='deltable-to-xls'
        >
          <thead>
            <tr>
              <th scope='col'>Destination</th>
              <th scope='col'>Payment_state</th>
              <th scope='col'>Delivery_type</th>
              <th scope='col'>Delivery_date</th>
              {/* <th scope='col'>NIC</th> */}
              <th scope='col'>Deliver's_name</th>
              <th scope='col'>Delivery_state</th>
              <th scope='col'>Actions</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row._id}>
                <td>{row.destination}</td>
                <td>{row.pstate}</td>
                {/* <td>{delivery.nic}</td> */}
                <td>{row.dtype}</td>
                <td>{row.ddate}</td>
                <td>{row.dname}</td>
                <td>{row.dstate}</td>

                <td>
                  <span
                    className='btn btn-success'
                    onClick={() => editDelivery(row)}
                  >
                    <i className='fas fa-edit'></i>&nbsp;Edit
                  </span>
                  &nbsp;
                  {/* <Link to='#' className='btn btn-warning'>
                      <i className='fas fa-edit'></i>&nbsp;Edit
                    </Link>
                    &nbsp; */}
                  <Link
                    to='#'
                    className='btn btn-danger'
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you wish to delete this Delivery ?'
                        )
                      )
                        deleteDelivery(row._id)
                    }}
                  >
                    <i className='far fa-trash-alt'></i>&nbsp;Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>   
            <TableCell align="right"><b>Destination</b></TableCell>
            <TableCell align="right"><b>Payment_state</b></TableCell>
            <TableCell align="right"><b>Delivery_type</b></TableCell>
            <TableCell align="right"><b>Delivery_date</b></TableCell>
            <TableCell align="right"><b>Deliver's_name</b></TableCell>
            <TableCell align="right"><b>Delivery_state</b></TableCell>
            <TableCell align="right"><b>Action</b></TableCell>   
            <TableCell align="right"></TableCell>       
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow key={row._id}>
              
              <TableCell align="right">{row.destination}</TableCell>
              <TableCell align="right">{row.pstate}</TableCell>
              <TableCell align="right">{row.dtype}</TableCell>
              <TableCell align="right">{row.ddate}</TableCell>
              <TableCell align="right">{row.dname}</TableCell>
              <TableCell align="right">{row.dstate}</TableCell>
              <TableCell align="right"> <Button variant="contained" color="primary" onClick={()=>editDelivery(row)}>Edit</Button>
              </TableCell>
              <TableCell align="right"> <Button variant="contained" style={{color:"red"}} onClick={()=> deleteDelivery(row._id)}>Delete</Button>
              </TableCell>             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> */}
    </div>
  )
}

export default FetchAllDelivery
