import React, { Fragment, useState, useEffect } from 'react'
import Navbar from './Navbar'
import Cart from './cart/Cart'
import Section from './productSection/Section'
import Slider from './Slider'
import Footer from './Footer'
import Boxes from './Boxes'
import Spinner from './Spinner'

// redux
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllProducts } from '../../actions/products'

const Landing = ({ products: { products, loading }, getAllProducts }) => {
  const categories = [...new Set(products.map((product) => product.category))]

  useEffect(() => {
    getAllProducts()
  }, [loading])

  return (
    <Fragment>
      <Navbar />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Slider />
          <Cart />

          {categories.map((category, index) => (
            <Section key={index} category={category} products={products} />
          ))}

          <Boxes />
        </>
      )}
      <Footer />
    </Fragment>
  )
}

Landing.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  products: state.products,
})

export default connect(mapStateToProps, { getAllProducts })(Landing)
