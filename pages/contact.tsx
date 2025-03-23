import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'

const Contact: NextPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1500)
  }

  return (
    <div>
      <Head>
        <title>Contact Us | Manomay</title>
        <meta name="description" content="Get in touch with Manomay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="text-primary text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold">Address</h3>
                    <p className="text-gray-600">123 Food Street, Foodville, FD 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiPhone className="text-primary text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMail className="text-primary text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-600">info@manomay.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiClock className="text-primary text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold">Hours</h3>
                    <p className="text-gray-600">Mon-Sun: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Message Sent!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for contacting us. We've received your message and will get back to you shortly.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary w-full py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact 