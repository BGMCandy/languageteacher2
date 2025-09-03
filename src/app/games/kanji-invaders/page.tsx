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
  target: string // pronunciation or meaning to match
  isCorrect: boolean // whether this is the correct answer for current player kanji
  isHit: boolean // whether this enemy has been hit
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
  const [gameMode, setGameMode] = useState<'pronunciation' | 'meaning'>('pronunciation')
  const [showInstructions, setShowInstructions] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(false)
  
  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastEnemySpawnRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch kanji data
  useEffect(() => {
    const fetchKanji = async () => {
      try {
        const supabase = createClientBrowser()
        const { data, error } = await supabase
          .from('japanese_kanji')
          .select('*')
          .limit(50)
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
    if (!player.kanji) return

    // 70% chance to spawn correct answer, 30% chance for wrong answer
    const isCorrect = Math.random() < 0.7
    
    let target: string
    if (isCorrect) {
      // Spawn correct pronunciation/meaning for current player kanji
      if (gameMode === 'pronunciation') {
        // Pick a random pronunciation from the comma-separated list
        const pronunciations = player.kanji.reading.split('、').filter(p => p.trim())
        target = pronunciations[Math.floor(Math.random() * pronunciations.length)] || player.kanji.reading
      } else {
        target = player.kanji.name
      }
    } else {
      // Spawn wrong pronunciation/meaning from random kanji
      const randomKanji = getRandomKanji()
      if (!randomKanji) return
      if (gameMode === 'pronunciation') {
        // Pick a random pronunciation from the comma-separated list
        const pronunciations = randomKanji.reading.split('、').filter(p => p.trim())
        target = pronunciations[Math.floor(Math.random() * pronunciations.length)] || randomKanji.reading
      } else {
        target = randomKanji.name
      }
    }

    const enemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (GAME_WIDTH - 50),
      y: 0, // Start at the TOP of the game area, not outside it
      kanji: player.kanji, // Keep reference to player kanji for collision logic
      speed: ENEMY_SPEED + (gameState.level * 0.1),
      target,
      isCorrect,
      isHit: false
    }

    setEnemies(prev => [...prev, enemy])
  }, [player.kanji, getRandomKanji, gameMode, gameState.level])



  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.paused || loading) return

    const gameLoop = () => {
      const now = Date.now()
      
      // Spawn enemies more frequently
      if (now - lastEnemySpawnRef.current > 1500 - (gameState.level * 100)) {
        spawnEnemy()
        lastEnemySpawnRef.current = now
      }
      
      // Debug: Check if game loop is running
      console.log(`Game loop running`)
      
      // Move enemies and check collisions in one update
      setEnemies(prev => {
        let shouldChangeKanji = false
        
        // First move all enemies down with faster speed
        const movedEnemies = prev.map(enemy => {
          const newY = enemy.y + (ENEMY_SPEED + (gameState.level * 1))
          return {
            ...enemy,
            y: newY
          }
        })
        
        // Then check collisions on moved enemies
        const newEnemies = movedEnemies.map(enemy => {
          if (enemy.isHit) return enemy // Skip already hit enemies
          
          const distance = Math.sqrt(
            Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)
          )
          
          if (distance < 40) {
            // Check if the falling target matches any of the player kanji's pronunciations/meanings
            let isActuallyCorrect = false
            
            if (gameMode === 'pronunciation') {
              // Check if the falling pronunciation matches any of the player kanji's pronunciations
              const playerPronunciations = player.kanji.reading.split('、').map(p => p.trim())
              isActuallyCorrect = playerPronunciations.includes(enemy.target)
            } else {
              // Check if the falling meaning matches the player kanji's meaning
              isActuallyCorrect = player.kanji.name === enemy.target
            }
            
            if (isActuallyCorrect) {
              // Correct match - collect it and increase score
              setGameState(prev => ({
                ...prev,
                score: prev.score + 10
              }))
            } else {
              // Wrong match - lose life
              setGameState(prev => ({
                ...prev,
                lives: prev.lives - 1
              }))
            }
            
            shouldChangeKanji = true
            
            // Mark as hit instead of removing immediately
            return { ...enemy, isHit: true }
          }
          
          return enemy
        }).filter(enemy => {
          // Only remove enemies that are WAY off screen
          return enemy.y < GAME_HEIGHT + 2000
        })
        
        // Change player kanji only once per collision check
        if (shouldChangeKanji) {
          const newKanji = getRandomKanji()
          if (newKanji) {
            setPlayer(prev => ({ ...prev, kanji: newKanji }))
          }
        }
        
        return newEnemies
      })
      
      // Check game over
      if (gameState.lives <= 0) {
        setGameState(prev => ({ ...prev, gameOver: true }))
        // Stop background music
        if (audioRef.current) {
          audioRef.current.pause()
          setMusicPlaying(false)
        }
        return
      }
      
      // Level up
      if (gameState.score > 0 && gameState.score % 100 === 0) {
        setGameState(prev => ({ ...prev, level: prev.level + 1 }))
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.gameOver, gameState.paused, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track pressed keys for smooth movement
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.paused) {
        if (e.key === ' ') {
          if (gameState.gameOver) {
            // Start new game
            setGameState({
              score: 0,
              lives: 3,
              level: 1,
              gameOver: false,
              paused: false
            })
            setEnemies([])
            setPlayer({
              x: GAME_WIDTH / 2,
              y: GAME_HEIGHT - 60,
              kanji: { letter: '人', name: 'person', reading: 'jin', sound_equiv: 'jin', level: '1' }
            })
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setMusicPlaying(true)
              }).catch((error) => {
                console.log('Audio play failed:', error)
              })
            }
          } else {
            setGameState(prev => ({ ...prev, paused: !prev.paused }))
          }
        }
        return
      }
      
      if (e.key === ' ') {
        // Change player kanji
        const newKanji = getRandomKanji()
        if (newKanji) {
          setPlayer(prev => ({ ...prev, kanji: newKanji }))
        }
        return
      }
      
      setPressedKeys(prev => new Set(prev).add(e.key))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(e.key)
        return newSet
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, getRandomKanji])

  // Handle continuous movement based on pressed keys
  useEffect(() => {
    if (gameState.gameOver || gameState.paused || pressedKeys.size === 0) return

    const movePlayer = () => {
      setPlayer(prev => {
        let newX = prev.x
        let newY = prev.y

        if (pressedKeys.has('ArrowLeft')) {
          newX = Math.max(0, newX - PLAYER_SPEED)
        }
        if (pressedKeys.has('ArrowRight')) {
          newX = Math.min(GAME_WIDTH - 40, newX + PLAYER_SPEED)
        }
        if (pressedKeys.has('ArrowUp')) {
          newY = Math.max(0, newY - PLAYER_SPEED)
        }
        if (pressedKeys.has('ArrowDown')) {
          newY = Math.min(GAME_HEIGHT - 40, newY + PLAYER_SPEED)
        }

        return { ...prev, x: newX, y: newY }
      })
    }

    const interval = setInterval(movePlayer, 16) // ~60fps
    return () => clearInterval(interval)
  }, [pressedKeys, gameState.gameOver, gameState.paused])

  // Toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause()
        setMusicPlaying(false)
      } else {
        audioRef.current.currentTime = 0
        audioRef.current.play().then(() => {
          setMusicPlaying(true)
        }).catch((error) => {
          console.log('Audio play failed:', error)
        })
      }
    }
  }

  // Start new game
  const startNewGame = () => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      paused: false
    })
    setEnemies([])
    setPlayer({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 60,
      kanji: getRandomKanji() || { letter: '人', name: 'person', reading: 'jin', sound_equiv: 'jin', level: '1' }
    })
    setShowInstructions(false)
    
    // Start background music
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().then(() => {
        setMusicPlaying(true)
      }).catch((error) => {
        console.log('Audio autoplay blocked:', error)
        console.log('User needs to interact with the page first')
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Kanji Data...</div>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white p-8 max-w-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Kanji Invaders</h1>
          <div className="space-y-4 text-sm">
            <p><strong>Objective:</strong> Control your kanji and match it with approaching enemies!</p>
            <p><strong>Controls:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Arrow keys to move</li>
              <li>Spacebar to change your kanji</li>
            </ul>
            <p><strong>Game Mode:</strong></p>
            <div className="flex gap-4">
              <button
                onClick={() => setGameMode('pronunciation')}
                className={`px-4 py-2 rounded ${gameMode === 'pronunciation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Pronunciation
              </button>
              <button
                onClick={() => setGameMode('meaning')}
                className={`px-4 py-2 rounded ${gameMode === 'meaning' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Meaning
              </button>
            </div>
            <p className="text-xs text-gray-600">
              {gameMode === 'pronunciation' 
                ? 'Match your kanji\'s reading with the enemy\'s target reading'
                : 'Match your kanji\'s meaning with the enemy\'s target meaning'
              }
            </p>
            <button
              onClick={startNewGame}
              className="w-full bg-green-500 text-white py-2 rounded font-bold"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://media.languageteacher.io/kanji_master.mp3"
      />
      {/* Game UI */}
      <div className="mb-4 text-white flex gap-8 items-center">
        <div>Score: {gameState.score}</div>
        <div>Lives: {gameState.lives}</div>
        <div>Level: {gameState.level}</div>
        <div>Mode: {gameMode}</div>
        <button
          onClick={toggleMusic}
          className={`px-3 py-1 rounded text-sm font-bold ${
            musicPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {musicPlaying ? '🔇 Music' : '🎵 Music'}
        </button>
      </div>

      {/* Game Canvas */}
      <div 
        className="relative border-2 border-white bg-gray-900"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Player */}
        <div
          className="absolute bg-green-500 text-white text-2xl font-bold flex items-center justify-center rounded"
          style={{
            left: player.x,
            top: player.y,
            width: 40,
            height: 40
          }}
        >
          {player.kanji.letter}
        </div>

        {/* Enemies */}
        {enemies.map(enemy => {
          let bgColor = 'bg-purple-500' // Default color for falling objects
          
          if (enemy.isHit) {
            // Show result color when hit
            if (gameMode === 'pronunciation') {
              const playerPronunciations = player.kanji.reading.split('、').map(p => p.trim())
              bgColor = playerPronunciations.includes(enemy.target) ? 'bg-green-500' : 'bg-red-500'
            } else {
              bgColor = player.kanji.name === enemy.target ? 'bg-green-500' : 'bg-red-500'
            }
          } else {
            // Use orange/purple for falling objects
            bgColor = enemy.isCorrect ? 'bg-orange-500' : 'bg-purple-500'
          }
          
          return (
            <div
              key={enemy.id}
              className={`absolute text-white text-sm font-bold flex items-center justify-center rounded-lg shadow-lg transition-all duration-200 ${
                enemy.isHit ? 'scale-110' : 'scale-100'
              } ${bgColor}`}
              style={{
                left: enemy.x,
                top: enemy.y,
                width: 50,
                height: 40,
                minWidth: 50
              }}
            >
              {enemy.target}
            </div>
          )
        })}

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Final Score: {gameState.score}</p>
              <button
                onClick={startNewGame}
                className="bg-green-500 text-white px-6 py-2 rounded font-bold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-white text-sm text-center">
        <p>Use arrow keys to move your kanji</p>
        <p>Collect correct {gameMode === 'pronunciation' ? 'pronunciations' : 'meanings'} and avoid wrong ones!</p>
        <p>Your kanji changes after each collision</p>
        <p>Current kanji: {player.kanji.letter} ({gameMode === 'pronunciation' ? player.kanji.reading : player.kanji.name})</p>
      </div>
    </div>
  )
}
