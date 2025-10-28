import React from 'react'
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Pet Service Platform</h1> <br/>
      <Link href="/users/login">Login</Link>
      <br />
      <Link href="/users/register">Sign Up</Link>
      <br/>
      <Link href="/users/business">Registration Form</Link>

    </div>

  )
}

export default Home;