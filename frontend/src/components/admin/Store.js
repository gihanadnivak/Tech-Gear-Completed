import React, { useState } from 'react'
import { Spin, Tabs, message, Form } from 'antd'

import Product from './store/Products'
import AllProducts from './store/AllProducts'

class Store extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '2',
      loading: false,
      productDetails: {},
      appProducts: [],
      images: [],
    }
  }

  onTabChange = (activeKey) => {
    this.setState({ activeKey })
  }

  showProductDetails = (productID) => {
    this.setState({ activeKey: '1', loading: true, productDetails: {} })
    fetch('/api/store/get-product-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productID }),
    })
      .then((response) => {
        this.setState({ loading: false })
        if (response.status !== 200) {
          throw new Error(response.statusText.toString())
        }
        return response.json()
      })
      .then((data) => {
        this.setState({ productDetails: data })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  showAllProducts = () => {
    this.setState({ activeKey: '2' })
    this.getAllProducts()
  }

  getAllProducts = () => {
    this.setState({ loading: true, allProducts: [] })
    fetch('/api/store/get-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        this.setState({ loading: false })
        if (response.status !== 200) {
          throw new Error(response.statusText.toString())
        }
        return response.json()
      })
      .then((data) => {
        this.setState({ allProducts: data })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  deleteProduct = (productID) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      this.setState({ loading: true })
      fetch('/api/store/delete-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productID }),
      })
        .then((response) => {
          this.setState({ loading: false })
          if (response.status !== 200) {
            throw new Error(response.statusText.toString())
          }
          return response.json()
        })
        .then((data) => {
          message.success({
            content: 'Product deleted successfully..!',
            style: {
              marginTop: '90vh',
            },
          })
          this.getAllProducts()
        })
        .catch(() => {
          message.error({
            content: 'Error deleting the product..!',
            style: {
              marginTop: '90vh',
            },
          })
          this.setState({ loading: false })
        })
    }
  }

  componentDidMount() {
    this.getAllProducts()
  }

  render() {
    return (
      <div>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='h2'>Store Management</h1>
        </div>

        <Tabs activeKey={this.state.activeKey} onChange={this.onTabChange}>
          <Tabs.TabPane tab='Add Product' key='1'>
            <Spin
              size='large'
              tip='Loading...'
              spinning={this.state.loading}
              style={{ minHeight: '200px' }}
            >
              <Product
                changeTab={this.showAllProducts}
                productDetails={this.state.productDetails}
                form={this.state.form}
              />
            </Spin>
          </Tabs.TabPane>

          <Tabs.TabPane tab='View Products' key='2'>
            <Spin
              size='large'
              tip='Loading...'
              spinning={this.state.loading}
              style={{ minHeight: '200px' }}
            >
              <AllProducts
                changeTab={this.showProductDetails}
                products={this.state.allProducts}
                deteleProduct={this.deleteProduct}
              />
            </Spin>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Store
