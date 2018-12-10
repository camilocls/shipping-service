import React from 'react'
import { NavBar, Logo } from '@/components'
import './style.scss'

const Home = () => (
  <div className="container view view-home">
    <Logo />
    <NavBar />
    <div className="view-body">
      <h2 className="view__title">Welcome!</h2>
      <p className="view__description">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam,
        beatae? Nesciunt ut eveniet id doloribus dolore harum aperiam
        aspernatur, cupiditate delectus ea voluptatem, doloremque blanditiis
        laudantium explicabo possimus, inventore ab?
      </p>
    </div>
  </div>
)

export default Home
