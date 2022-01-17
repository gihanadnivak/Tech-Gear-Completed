import React, {Fragment} from 'react';
import {Button, Table} from "antd";

import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const AllProducts = (props) => {

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: images => (<img src={images && images[0]} alt="Product" style={{width: '50px', height: '50px', overflow: 'hidden', objectFit: 'cover'}} />)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: category => (category.substring(0,1).toUpperCase() + category.substring(1))
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand'
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model'
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: weight => (<span>{weight.value} {weight.unit}</span>)
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: dimesions => (<span>{dimesions.width}x{dimesions.height}x{dimesions.length} {dimesions.unit}</span>)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      width: '175px',
      render: (text, record) => (
        <Fragment>
          <button className='btn btn-primary mx-1' onClick={() => editProduct(record._id)}>Edit</button>
          <button className='btn btn-danger' onClick={() => deleteProduct(record._id)}>Delete</button>
        </Fragment>
      )
    }
  ];

  const deleteProduct = (productID) => {
    props.deteleProduct(productID);
  }

  const editProduct = (productID) => {
    props.changeTab(productID);
  }

  return (
    <Fragment>
      <Table columns={columns} dataSource={props.products} />
    </Fragment>
  );

}

export default AllProducts;
