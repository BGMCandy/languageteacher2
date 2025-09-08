'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

interface GameState {
  score: number
  lives: number
  level: number
  gameOver: boolean
  paused: boolean
}

interface Enemy {
  id: string
  x: number
  y: number
  kanji: JapaneseKanji
  speed: number
  question: string
  correctAnswer: string
  options: string[]
}

interface Player {
  x: number
  y: number
  kanji: JapaneseKanji
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SPEED = 20 // Much faster movement
const ENEMY_SPEED = 15 // Much faster falling objects

export default function KanjiInvadersGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    paused: false
  })
  
  const [player, setPlayer] = useState<Player>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 60,
    kanji: { letter: '人', name: 'person', reading: 'jin', sound_equiv: 'jin', level: '1' }
  })
  
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [kanjiData, setKanjiData] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)
  const [gameMode] = useState<'pronunciation' | 'meaning'>('pronunciation')
  const [showInstructions, setShowInstructions] = useState(true)
  
  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastEnemySpawnRef = useRef<number>(0)

  // Fetch kanji data
  useEffect(() => {
    const fetchKanji = async () => {
      try {
        const supabase = createClientBrowser()
        const { data, error } = await supabase
          .from('japanese_kanji')
          .select('letter, name, reading, sound_equiv, level')
          .limit(20)
          .order('level')

        if (error) {
          console.error('Error fetching kanji:', error)
          return
        }

        setKanjiData(data || [])
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }

    fetchKanji()
  }, [])

  // Get random kanji
  const getRandomKanji = useCallback(() => {
    if (kanjiData.length === 0) return null
    return kanjiData[Math.floor(Math.random() * kanjiData.length)]
  }, [kanjiData])

  // Spawn enemy (pronunciation/meaning)
  const spawnEnemy = useCallback(() => {
    const kanji = getRandomKanji()
    if (!kanji) return

    const question = gameMode === 'pronunciation' ? kanji.reading : kanji.name
    const correctAnswer = gameMode === 'pronunciation' ? kanji.reading : kanji.name
    
    // Generate wrong options
    const wrongOptions = kanjiData
      .filter(k => k.letter !== kanji.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(k => gameMode === 'pronunciation' ? k.reading : k.name)
    
    const options = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random())

    const enemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (GAME_WIDTH - 100),
      y: -50,
      kanji,
      speed: ENEMY_SPEED + (gameState.level * 2),
      question,
      correctAnswer,
      options
    }

    setEnemies(prev => [...prev, enemy])
  }, [kanjiData, gameMode, getRandomKanji, gameState.level])

  // Handle answer selection
  const handleAnswer = useCallback((enemyId: string, selectedAnswer: string) => {
    const enemy = enemies.find(e => e.id === enemyId)
    if (!enemy) return

    if (selectedAnswer === enemy.correctAnswer) {
      // Correct answer
      setGameState(prev => ({ ...prev, score: prev.score + 10 }))
      setEnemies(prev => prev.filter(e => e.id !== enemyId))
    } else {
      // Wrong answer - lose life
      setGameState(prev => ({ ...prev, lives: prev.lives - 1 }))
      setEnemies(prev => prev.filter(e => e.id !== enemyId))
    }
  }, [enemies])

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.paused || loading) return

    const gameLoop = () => {
      // Move enemies down
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + enemy.speed
      })).filter(enemy => enemy.y < GAME_HEIGHT + 50))

      // Spawn new enemies
      const now = Date.now()
      if (now - lastEnemySpawnRef.current > 2000 - (gameState.level * 100)) {
        spawnEnemy()
        lastEnemySpawnRef.current = now
      }

      // Check for game over
      setGameState(prev => {
        if (prev.lives <= 0) {
          return { ...prev, gameOver: true }
        }
        return prev
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.gameOver, gameState.paused, loading, spawnEnemy, gameState.level, gameState.lives])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.paused) return

      switch (e.key) {
        case 'ArrowLeft':
          setPlayer(prev => ({ ...prev, x: Math.max(0, prev.x - PLAYER_SPEED) }))
          break
        case 'ArrowRight':
          setPlayer(prev => ({ ...prev, x: Math.min(GAME_WIDTH - 50, prev.x + PLAYER_SPEED) }))
          break
        case ' ':
          e.preventDefault()
          // Handle shooting or other actions
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.gameOver, gameState.paused])

  // Start game
  const startGame = () => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      paused: false
    })
    setEnemies([])
    setShowInstructions(false)
  }

  // Toggle pause
  const togglePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-6xl font-bold mb-8 font-fugaz">Kanji Invaders</h1>
          <div className="space-y-6 text-lg">
            <p>🎯 Learn Japanese Kanji while playing an exciting space shooter!</p>
            <p>Use arrow keys to move your ship and answer questions about falling Kanji.</p>
            <p>Choose the correct pronunciation or meaning to destroy enemies!</p>
            <div className="mt-8">
              <button
                onClick={startGame}
                className="bg-white text-black px-8 py-4 text-xl font-bold rounded hover:bg-gray-200 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Game UI */}
      <div className="mb-4 flex justify-between w-full max-w-4xl">
        <div className="text-2xl font-bold">
          Score: {gameState.score} | Lives: {gameState.lives} | Level: {gameState.level}
        </div>
        <div className="space-x-4">
          <button
            onClick={togglePause}
            className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
          >
            {gameState.paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded font-bold hover:bg-gray-500 transition-colors"
          >
            Instructions
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative border-2 border-white bg-gray-900" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {/* Player */}
        <div
          className="absolute bg-white text-black flex items-center justify-center text-2xl font-bold"
          style={{
            left: player.x,
            top: player.y,
            width: 50,
            height: 50
          }}
        >
          {player.kanji.letter}
        </div>

        {/* Enemies */}
        {enemies.map(enemy => (
          <div key={enemy.id} className="absolute">
            <div
              className="bg-red-500 text-white flex items-center justify-center text-xl font-bold border-2 border-red-300"
              style={{
                left: enemy.x,
                top: enemy.y,
                width: 80,
                height: 60
              }}
            >
              {enemy.kanji.letter}
            </div>
            <div
              className="absolute top-16 left-0 bg-gray-800 text-white p-2 rounded text-sm"
              style={{ width: 200 }}
            >
              <p className="font-bold mb-1">
                {gameMode === 'pronunciation' ? 'Reading:' : 'Meaning:'}
              </p>
              <div className="grid grid-cols-1 gap-1">
                {enemy.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(enemy.id, option)}
                    className="bg-gray-700 hover:bg-gray-600 p-1 rounded text-xs"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-2xl mb-6">Final Score: {gameState.score}</p>
            <button
              onClick={startGame}
              className="bg-white text-black px-8 py-4 text-xl font-bold rounded hover:bg-gray-200 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
