'use client'
import { useState } from 'react'
import { Trash2, UserPlus, Users, X } from 'lucide-react'

const symbols = ['🍗', '🐔', '🍽']

function getMatchingSet() {
  const emoji = symbols[Math.floor(Math.random() * symbols.length)]
  return [emoji, emoji, emoji]
}

function getRandomNonMatchingSet() {
  let set = []
  while (true) {
    set = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ]
    if (!(set[0] === set[1] && set[1] === set[2])) break
  }
  return set
}

function getUniqueRandomIndexes(length: number, count: number): number[] {
  const indexes = new Set<number>()
  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * length))
  }
  return Array.from(indexes)
}

export default function MandhiChestPicker() {
  const [nameInput, setNameInput] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [error, setError] = useState('')
  const [winners, setWinners] = useState<string[]>([])
  const [spinning, setSpinning] = useState(false)
  const [results, setResults] = useState<string[][]>([])
  const [numWinners, setNumWinners] = useState(1)
  const [showWinnerPopup, setShowWinnerPopup] = useState(false)

  const resetGame = () => {
    setNames([])
    setError('')
    setWinners([])
    setResults([])
    setShowWinnerPopup(false)
    setNameInput('')
    setNumWinners(1)
  }

  const addName = () => {
    const trimmedName = nameInput.trim()
    if (trimmedName && !names.includes(trimmedName)) {
      setNames([...names, trimmedName])
      setNameInput('')
      setError('')
      setResults([])
      setWinners([])
    } else if (names.includes(trimmedName)) {
      setError('Name already exists!')
      setTimeout(() => setError(''), 3000)
    }
  }

  const removeName = (nameToRemove: string) => {
    const updated = names.filter(name => name !== nameToRemove)
    setNames(updated)
    setResults([])
    setWinners([])
  }

  const clearAll = () => {
    setNames([])
    setError('')
    setWinners([])
    setResults([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addName()
    }
  }

  const runSpin = () => {
    if (names.length === 0 || spinning || numWinners <= 0) return

    const count = Math.min(numWinners, names.length)

    setSpinning(true)
    setWinners([])
    setShowWinnerPopup(false)
    const newResults: string[][] = names.map(() => ['❓', '❓', '❓'])
    setResults(newResults)

    setTimeout(() => {
      const winnerIndexes = getUniqueRandomIndexes(names.length, count)

      const finalResults = names.map((_, index) =>
        winnerIndexes.includes(index) ? getMatchingSet() : getRandomNonMatchingSet()
      )

      const selectedWinners = winnerIndexes.map(i => names[i])

      setResults(finalResults)
      setWinners(selectedWinners)
      setSpinning(false)
      
      // Show popup after a short delay
      setTimeout(() => {
        setShowWinnerPopup(true)
      }, 500)
    }, 1500)
  }

  const closePopup = () => {
    setShowWinnerPopup(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-center">
            🍗 Chick N Spin 🍗
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Who gets the chicken chest-piece of mandhi
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="Chicken mandi.jpeg"
                  alt="Mandhi Chicken"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 italic">
                  Tender, juicy chicken pieces waiting for the lucky winner!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Add Names */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Add Participants</h2>
              </div>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter participant name..."
                  className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <button
                  onClick={addName}
                  disabled={!nameInput.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" /> Add
                </button>
              </div>

              {/* Chestpiece Count */}
              <div className="flex items-center gap-2 mb-4">
                <label className="font-medium text-gray-700">No. of Chestpieces:</label>
                <input
                  type="number"
                  min="1"
                  max={names.length || 1}
                  value={numWinners}
                  onChange={(e) => setNumWinners(Number(e.target.value))}
                  className="w-20 border-2 border-gray-200 p-2 rounded-lg text-center focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Run Button */}
              <div className="text-center">
                <button
                  onClick={runSpin}
                  disabled={names.length === 0 || spinning}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:scale-105 disabled:opacity-50"
                >
                  🎰 Run Spin
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mt-4 rounded-xl text-center">
                  ⚠ {error}
                </div>
              )}
            </div>

            {/* Participants & Symbols */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>
              {names.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  No participants yet. Add some names above!
                </p>
              ) : (
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {names.map((name, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                      <span className="font-medium text-gray-800">{name}</span>
                      <span className="text-3xl">
                        {results[idx] ? results[idx].join(' ') : '❓ ❓ ❓'}
                      </span>
                      <button onClick={() => removeName(name)} className="text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Winners */}
            {winners.length > 0 && (
              <div className="hidden">
                🏆 <b>Winner{winners.length > 1 ? 's' : ''}:</b> {winners.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Winner Popup Modal */}
      {showWinnerPopup && winners.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Bursting flairs */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length: 12}).map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '2s'
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '💥', '🎆'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
          
          {/* Winner box */}
          <div className="bg-white rounded-3xl border-4 border-orange-400 p-8 text-center">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              {winners.length > 1 ? 'Winners!' : 'Winner!'}
            </h2>
            
            {winners.map((winner, index) => (
              <div 
                key={index}
                className="text-4xl font-bold text-orange-700 mb-2"
              >
                {winner}
              </div>
            ))}
            
            <div className="text-lg text-gray-600 mt-4 mb-6">
              Gets the juicy chest piece! 🍗
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                🔄 Play Again
              </button>
              <button
                onClick={closePopup}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Awesome! 🎊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}