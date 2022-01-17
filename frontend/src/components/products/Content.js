import React, { Fragment } from 'react'

import { Card, Pagination } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'

class Content extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='row m-2'>
        {this.props.products.map((product) => (
          <ProductTile
            productName={product.brand + ' ' + product.model}
            rating={Math.floor(Math.random() * 5) + 1}
            noOfRatings={Math.floor(Math.random() * 1000) + 1}
            price={product.price}
            available={product.available}
            image={product.images[0]}
          />
        ))}
      </div>
    )
  }
}

export function ProductTile(props) {
  const { productName, rating, noOfRatings, price, available, image } = props

  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<StarFilled style={{ color: 'gold' }} />)
    } else {
      stars.push(<StarOutlined style={{ color: 'gold' }} />)
    }
  }

  return (
    <Card
      size='small'
      className='col-md-4 m-1'
      hoverable
      style={{ width: '250px' }}
      cover={
        <img
          alt='image'
          src={image}
          style={{ height: '150px', objectFit: 'cover' }}
        />
      }
    >
      <h6 className='mb-1'>{productName}</h6>
      <div className='row d-flex flex-row mb-2'>
        <div className='col-5'>{stars}</div>
        <div className='text-info col mx-0 px-0' style={{ marginTop: '3px' }}>
          {noOfRatings} Ratings
        </div>
      </div>
      <h6 className='text-secondary'>Rs.{price}/=</h6>
      <p className='text-danger mb-0'>
        {available < 20 ? <span>Only {available} left in stock</span> : <></>}
      </p>
    </Card>
  )
}

export default Content
