'use client'

import { useState } from 'react'
import Image from 'next/image'
import { preloadStyle } from 'next/dist/server/app-render/entry-base';

interface GolfCourse {
  id: number;
  name: string;
  location: string;
  price: number;
  partySize: number;
  website: string;
  imageUrl: string;
  description: string;
}

export default function Home() {
  const [maxPrice, setMaxPrice] = useState(500) // Default value set to 500
  const [location, setLocation] = useState('')
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const searchParams = { maxPrice, location, partySize: "any" }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
    try {
      const response = await fetch(`${apiUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error('Error during search:', error)
      setError('An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <div className="mb-8">
        <Image
          src="/homepage-logo.png"
          alt="Golf Getaways"
          width={300}
          height={100}
          priority
        />
      </div>
      <form onSubmit={handleSearch} className="w-full max-w-md space-y-6">
        <div>
          <div className="h-6">
            <label htmlFor="price-range" className="block text-sm font-medium">
              Max Price Per Person: ${maxPrice}
            </label>
          </div>
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full" 
              style={{
                background: `linear-gradient(to right, #1a4d2e 0%, #1a4d2e ${maxPrice / 10}%, #d3d3d3 ${maxPrice / 10}%, #d3d3d3 100%)`,
                pointerEvents: 'none'
              }}
            ></div>
            <input
              type="range"
              id="price-range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full appearance-none bg-transparent cursor-pointer relative z-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="Anywhere"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1a4d2e] text-white p-2 rounded-md hover:bg-[#143d24] transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Golf Getaways'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {searchResults.length > 0 && (
        <div className="mt-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {searchResults.map((course) => (
              <li key={course.id}>
                <a 
                  href={course.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                      <p className="text-gray-300 mb-2">{course.location}</p>
                      <p className="mb-2">Price: ${course.price} per person</p>
                      <p className="mb-2">Party Size: {course.partySize}</p>
                      <p className="text-sm text-gray-400">{course.description}</p>
                    </div>
                    <div className="w-40 h-40 relative flex-shrink-0">
                      <Image
                        src={course.imageUrl}
                        alt={course.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}