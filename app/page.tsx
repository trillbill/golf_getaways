'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDownIcon, ChevronUpIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import SearchBar from './locations'  // Import the SearchBar component

interface GolfCourse {
  id: number;
  name: string;
  location: string;
  price: { min: number; max: number };
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
  const [maxPrice, setMaxPrice] = useState(1000) // Default value set to 750
  const [location, setLocation] = useState('')
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<'lowToHigh' | 'highToLow'>('lowToHigh');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    handleSearch({ preventDefault: () => {}, currentTarget: null } as unknown as React.FormEvent); // Trigger search on page load
  }, []); // Empty dependency array to run once on mount

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

  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max) {
      return `$${price.min}/person`;
    } else {
      return `$${price.min} - $${price.max}/person`;
    }
  };

  const sortCourses = (courses: GolfCourse[]) => {
    return courses.sort((a, b) => {
      const priceA = a.price.min;
      const priceB = b.price.min;

      if (sortOrder === 'lowToHigh') {
        return priceA - priceB; // Sort ascending
      } else {
        return priceB - priceA; // Sort descending
      }
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
                background: `linear-gradient(to right, #1a4d2e 0%, #1a4d2e ${(maxPrice - 100) / (2000 - 100) * 100}%, #d3d3d3 ${(maxPrice - 100) / (2000 - 100) * 100}%, #d3d3d3 100%)`, // Updated calculation
                pointerEvents: 'none'
              }}
            ></div>
            <input
              type="range"
              id="price-range"
              min="100" // Minimum value set to 100
              max="2000" // Updated maximum value to 2000
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

        {/* Centered Email Icon Button */}
        <div className="flex justify-center mt-2">
          <a href="mailto:support@golfgetaways.io" className="inline-flex items-center border border-white bg-black text-white p-2 rounded-md">
            <EnvelopeIcon className="w-6 h-6 mr-2" /> {/* Increased icon size */}
            Contact Us
          </a>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {sortCourses(searchResults).length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Search Results ({searchResults.length})</h2>
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center bg-gray-800 text-white rounded-md p-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setSortOrder('lowToHigh');
                        setIsDropdownOpen(false); // Close dropdown after selection
                      }}
                      className="block w-full text-left text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      Price: Low to High
                    </button>
                    <button 
                      onClick={() => {
                        setSortOrder('highToLow');
                        setIsDropdownOpen(false); // Close dropdown after selection
                      }}
                      className="block w-full text-left text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      Price: High to Low
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-6">
            {sortCourses(searchResults).map((course) => (
              <li key={course.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <a href={course.website} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <Image 
                        src={course.imageUrl} 
                        alt={course.name} 
                        width={180} // Set a fixed width
                        height={120} 
                        className="w-full h-auto rounded-md object-cover mb-4 sm:w-[180px] sm:h-[120px] sm:mb-0 sm:ml-4 order-1 sm:order-2" // Updated for responsive sizing
                      />
                      <div className="flex-1 order-2 sm:order-1">
                        <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                        <p className="text-gray-400 mb-2">{course.location}</p>
                        <p className="text-xl font-bold text-green-500 mb-4">
                          {formatPrice(course.price)} <span className="text-sm text-white font-normal">(party of {course.partySize})</span>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">{course.numberOfRounds} Rounds</span>
                          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">{course.numberOfNights} Nights</span>
                          {course.perks.map((perk, index) => (
                            <span key={index} className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">{perk}</span>
                          ))}
                        </div>
                      </div>
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
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    <h4 className="font-semibold mb-2">Included Courses:</h4>
                    <ul className="space-y-2">
                      {course.courses.map((courseDetail, index) => (
                        <li key={index} className="bg-gray-700 p-3 rounded-md">
                          <h5 className="font-medium">{courseDetail.name}</h5>
                          <p className="text-sm text-gray-400">
                            Par: {courseDetail.par} | Length: {courseDetail.length} yards | 
                            Rating: {courseDetail.rating} | Slope: {courseDetail.slope} | 
                            Holes: {courseDetail.holes}
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
      {/* Contact Section */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold">Contact Us</h2>
        <p className="text-gray-400">
          <a href="mailto:support@golfgetaways.io" className="text-white">{`support@golfgetaways.io`}</a>
        </p>
      </div>

      <div style={{ color: 'white', fontSize: '0.8em', textAlign: 'center', marginTop: '20px' }}>
        <h3 className="font-bold">Privacy Policy</h3>
        <p>Your privacy is important to us. This privacy policy explains how we handle your information when you visit our website.</p>
        <ul className="list-disc list-inside">
          <li>We do not collect any personal user data. The only data collected may be through your browser, such as cookie data.</li>
          <li>We do not use personal information since we do not collect any.</li>
        </ul>
        <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
        <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@golfgetaways.io" className="text-white">support@golfgetaways.io</a>.</p>

        <h3 className="font-bold mt-4">Terms and Conditions</h3>
        <p>Welcome to golfgetaways.io. By accessing or using our website, you agree to be bound by these Terms and Conditions.</p>
        <ul className="list-disc list-inside">
          <li>You agree to use the site only for lawful purposes and in a way that does not infringe on the rights of others.</li>
          <li>All content on this site, including text, graphics, and logos, is the property of golfgetaways.io and is protected by copyright laws.</li>
          <li>In no event shall golfgetaways.io be liable for any damages arising from the use of this site.</li>
        </ul>
        <p>We may revise these Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms on this page.</p>
        <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@golfgetaways.io" className="text-white">support@golfgetaways.io</a>.</p>
      </div>
    </main>
  )
}