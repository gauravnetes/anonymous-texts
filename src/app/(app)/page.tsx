
'use client'
import React from 'react'

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { CardHeader } from '@/components/ui/card'

const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="text-center mb-8 md:mb-16 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Whisper<span className="text-purple-600">Verse</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Where secrets find their voice, and identities fade into the shadows
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
            Start Sharing Anonymously
          </button>
          <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-medium transition-colors">
            How It Works
          </button>
        </div>
      </section>

      {/* Carousel section */}

    <Carousel
    plugins={[Autoplay({delay: 2000})]}
    className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message, index) => (
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader className='text-4xl'>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-purple-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Total Anonymity</h3>
          <p className="text-gray-600">Your identity remains encrypted, even we don't know who you are</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-purple-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Channels</h3>
          <p className="text-gray-600">Military-grade encryption for all your messages and interactions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-purple-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
          <p className="text-gray-600">Messages disappear like shadows after being read</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Embrace the Shadows?</h2>
          <p className="text-gray-600 mb-8">Join thousands who've already discovered the freedom of anonymous expression</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all">
            Create Your Anonymous Profile
          </button>
        </div>
      </section>
    </main>

    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Whisper<span className="text-purple-600">Verse</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Where anonymity meets authentic expression
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">How It Works</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Success Stories</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Security</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">support@whisperverse.com</li>
              <li className="text-gray-500 text-sm">24/7 Help Center</li>
              <li className="text-gray-500 text-sm">PO Box 1234</li>
              <li className="text-gray-500 text-sm">Digital Lane, Anon City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WhisperVerse. All rights reserved.
            <span className="block md:inline mt-2 md:mt-0">Messages disappear like morning mist</span>
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Home