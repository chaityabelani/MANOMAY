import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

const OrderConfirmation: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Order Confirmed | Manomay</title>
        <meta name="description" content="Your order has been confirmed" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-custom py-16">
        <div className="max-w-md mx-auto text-center">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your order and will begin processing it right away.
            You will receive a confirmation email shortly.
          </p>
          <p className="text-gray-600 mb-8">
            Your estimated delivery time is 30-45 minutes.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation 