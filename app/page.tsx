'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import SearchBar from './locations'  // Import the SearchBar component

interface GolfCourse {
  id: number;
  name: string;
  location: string;
  price: number;
  partySize: number;
  website: string;
  imageUrl: string;
  description: string;
  numberOfRounds: number;
  numberOfNights: number;
  perks: string[];
  courses: Array<{
    name: string;
    par: number;
    length: number;
    rating: number;
    slope: number;
    holes: number;
  }>;
}

export default function Home() {
  const [maxPrice, setMaxPrice] = useState(750) // Default value set to 750
  const [location, setLocation] = useState('')
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

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

  const handleLocationSearch = (value: string) => {
    setLocation(value)
  }

  const toggleCardExpansion = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id)
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
                background: `linear-gradient(to right, #1a4d2e 0%, #1a4d2e ${maxPrice / 15}%, #d3d3d3 ${maxPrice / 15}%, #d3d3d3 100%)`,
                pointerEvents: 'none'
              }}
            ></div>
            <input
              type="range"
              id="price-range"
              min="0"
              max="1500"
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
          <SearchBar onSearch={handleLocationSearch} />
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
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Search Results ({searchResults.length})</h2>
          <ul className="space-y-6">
            {searchResults.map((course) => (
              <li key={course.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <a href={course.website} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                        <p className="text-gray-400 mb-2">{course.location}</p>
                        <p className="text-xl font-bold text-green-500 mb-4">
                          ${course.price}/person <span className="text-sm text-white font-normal">(party of {course.partySize})</span>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">{course.numberOfRounds} Rounds</span>
                          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">{course.numberOfNights} Nights</span>
                          {course.perks.map((perk, index) => (
                            <span key={index} className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">{perk}</span>
                          ))}
                        </div>
                      </div>
                      <Image src={course.imageUrl} alt={course.name} width={200} height={133} className="rounded-md object-cover" />
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCardExpansion(course.id);
                      }}
                      className="mt-4 flex items-center text-white hover:text-gray-300"
                    >
                      {expandedCard === course.id ? (
                        <>Less info <ChevronUpIcon className="w-4 h-4 ml-1" /></>
                      ) : (
                        <>More info <ChevronDownIcon className="w-4 h-4 ml-1" /></>
                      )}
                    </button>
                  </div>
                </a>
                {/* Expanded content remains outside the clickable area */}
                {expandedCard === course.id && (
                  <div className="px-6 pb-6">
                    <h4 className="font-semibold mb-2">Included Courses:</h4>
                    <ul className="space-y-2">
                      {course.courses.map((course, index) => (
                        <li key={index} className="bg-gray-700 p-3 rounded-md">
                          <h5 className="font-medium">{course.name}</h5>
                          <p className="text-sm text-gray-400">
                            Par: {course.par} | Length: {course.length} yards | 
                            Rating: {course.rating} | Slope: {course.slope} | 
                            Holes: {course.holes}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}