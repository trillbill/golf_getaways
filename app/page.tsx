'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [maxPrice, setMaxPrice] = useState(2500)
  const [partySize, setPartySize] = useState(1)
  const [location, setLocation] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = { maxPrice, partySize, location }
    
    try {
      const response = await fetch('/api/search', {
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
      // Handle error (e.g., show error message to user)
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
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="h-6">
              <label htmlFor="price-range" className="block text-sm font-medium">
                Max Price Per Person: ${maxPrice}
              </label>
            </div>
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full" 
                style={{
                  background: `linear-gradient(to right, #1a4d2e 0%, #1a4d2e ${maxPrice / 50}%, #d3d3d3 ${maxPrice / 50}%, #d3d3d3 100%)`,
                  pointerEvents: 'none'
                }}
              ></div>
              <input
                type="range"
                id="price-range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full appearance-none bg-transparent cursor-pointer relative z-10"
              />
            </div>
          </div>

          <div>
            <div className="h-6">
              <label htmlFor="party-size" className="block text-sm font-medium">
                Party Size
              </label>
            </div>
            <input
              type="number"
              id="party-size"
              value={partySize}
              onChange={(e) => setPartySize(Math.min(12, Math.max(1, Number(e.target.value))))}
              className="w-16 text-center border rounded-md text-black h-[30px]"
              min="1"
              max="12"
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
        >
          Search Golf Getaways
        </button>
      </form>
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <ul>
            {searchResults.map((result: any) => (
              <li key={result.id} className="mb-2">
                {result.name} - ${result.price} per person
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}