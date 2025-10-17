'use client'

import { useState } from 'react'
import MonsterAvatar from '@/presentation/components/monster/MonsterAvatar'
import { MonsterVisualService } from '@/core/services/monster-visual.service'
import { MonsterType } from '@/db/models/monster.model'
import type { AnimationType } from '@/core/models/monster-visual.model'

export default function MonsterGeneratorTestPage () {
  const [name, setName] = useState('Pikachu')
  const [type, setType] = useState<MonsterType>(MonsterType.ELECTRIC)
  const [level, setLevel] = useState(50)
  const [attack, setAttack] = useState(70)
  const [defense, setDefense] = useState(50)
  const [speed, setSpeed] = useState(80)
  const [isShiny, setIsShiny] = useState(false)
  const [animation, setAnimation] = useState<AnimationType>('idle')
  const [bodyType, setBodyType] = useState<'small' | 'medium' | 'large' | 'giant'>('medium')

  const visualService = new MonsterVisualService()
  const visualProfile = visualService.generateVisualProfile(
    name,
    type,
    level,
    bodyType,
    attack,
    defense,
    speed,
    isShiny
  )

  const animations: AnimationType[] = [
    'idle',
    'happy',
    'attack',
    'hurt',
    'celebrate',
    'sleep',
    'hungry'
  ]

  const types = Object.values(MonsterType)

  return (
    <div className='min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-2 bg-gradient-to-r from-tolopea to-blood bg-clip-text text-transparent'>
          🧪 Générateur de Monstres - Test
        </h1>
        <p className='text-center text-gray-700 font-medium mb-8'>
          Ajustez les paramètres pour visualiser les différentes générations de monstres
        </p>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Zone de visualisation */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>Aperçu du Monstre</h2>

            <div className='flex justify-center items-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 mb-6'>
              <MonsterAvatar
                visualProfile={visualProfile}
                animation={animation}
                interactive
                size={300}
              />
            </div>

            {/* Info Profile */}
            <div className='bg-gray-50 rounded-lg p-4 space-y-2 text-sm'>
              <h3 className='font-bold text-gray-900 mb-2'>Profil Visuel Généré</h3>
              <div className='grid grid-cols-2 gap-2 text-gray-800'>
                <div>
                  <span className='font-semibold text-gray-900'>Forme:</span> {visualProfile.traits.bodyShape}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Taille:</span> {visualProfile.size}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Yeux:</span> {visualProfile.traits.eyeStyle}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Bouche:</span> {visualProfile.traits.mouthStyle}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Queue:</span> {visualProfile.traits.tailStyle}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Motif:</span> {visualProfile.traits.pattern}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Cornes:</span> {visualProfile.traits.hasHorns ? '✓' : '✗'}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Ailes:</span> {visualProfile.traits.hasWings ? '✓' : '✗'}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Pics:</span> {visualProfile.traits.hasSpikes ? '✓' : '✗'}
                </div>
                <div>
                  <span className='font-semibold text-gray-900'>Aura:</span> {visualProfile.traits.hasAura ? '✓' : '✗'}
                </div>
              </div>

              <div className='pt-2 border-t mt-3'>
                <span className='font-semibold text-gray-900'>Couleurs:</span>
                <div className='flex gap-2 mt-2'>
                  <div className='flex items-center gap-1'>
                    <div className='w-6 h-6 rounded border-2 border-gray-300' style={{ backgroundColor: visualProfile.colorPalette.primary }} />
                    <span className='text-xs text-gray-900 font-medium'>Primaire</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='w-6 h-6 rounded border-2 border-gray-300' style={{ backgroundColor: visualProfile.colorPalette.secondary }} />
                    <span className='text-xs text-gray-900 font-medium'>Secondaire</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='w-6 h-6 rounded border-2 border-gray-300' style={{ backgroundColor: visualProfile.colorPalette.accent }} />
                    <span className='text-xs text-gray-900 font-medium'>Accent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau de contrôle */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>Paramètres</h2>

            <div className='space-y-6'>
              {/* Nom */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Nom du Monstre
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tolopea focus:border-tolopea text-gray-900 font-medium'
                  placeholder='Ex: Pikachu, Dracaufeu...'
                />
                <p className='text-xs text-gray-700 mt-1 font-medium'>
                  Le nom influence la génération procédurale du monstre
                </p>
              </div>

              {/* Type */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Type ({type})
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        type === t
                          ? 'bg-tolopea text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Taille du Corps
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {(['small', 'medium', 'large', 'giant'] as const).map((bt) => (
                    <button
                      key={bt}
                      onClick={() => setBodyType(bt)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        bodyType === bt
                          ? 'bg-blood text-white shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Niveau: <span className='text-tolopea'>{level}</span>
                </label>
                <input
                  type='range'
                  min='1'
                  max='100'
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tolopea'
                />
              </div>

              {/* Stats */}
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-2'>
                    Attaque: <span className='text-blood'>{attack}</span>
                  </label>
                  <input
                    type='range'
                    min='1'
                    max='100'
                    value={attack}
                    onChange={(e) => setAttack(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blood'
                  />
                  <p className='text-xs text-gray-700 mt-1 font-medium'>Influence la bouche et l&apos;aura</p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-2'>
                    Défense: <span className='text-aqua-forest'>{defense}</span>
                  </label>
                  <input
                    type='range'
                    min='1'
                    max='100'
                    value={defense}
                    onChange={(e) => setDefense(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-aqua-forest'
                  />
                  <p className='text-xs text-gray-700 mt-1 font-medium'>Influence les cornes et pics</p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-2'>
                    Vitesse: <span className='text-tolopea'>{speed}</span>
                  </label>
                  <input
                    type='range'
                    min='1'
                    max='100'
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tolopea'
                  />
                  <p className='text-xs text-gray-700 mt-1 font-medium'>Influence les yeux et ailes</p>
                </div>
              </div>

              {/* Shiny */}
              <div className='flex items-center justify-between bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border-2 border-yellow-300'>
                <div>
                  <label className='block text-sm font-semibold text-gray-900'>
                    ✨ Shiny (Chromatique)
                  </label>
                  <p className='text-xs text-gray-800 font-medium'>Variante de couleur rare</p>
                </div>
                <button
                  onClick={() => setIsShiny(!isShiny)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isShiny ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isShiny ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Animations */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Animation
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {animations.map((anim) => (
                    <button
                      key={anim}
                      onClick={() => setAnimation(anim)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        animation === anim
                          ? 'bg-gradient-to-r from-tolopea to-blood text-white shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton random */}
              <button
                onClick={() => {
                  const names = ['Pikachu', 'Dracaufeu', 'Léviator', 'Mewtwo', 'Salamèche', 'Bulbizarre', 'Carapuce']
                  setName(names[Math.floor(Math.random() * names.length)])
                  setType(types[Math.floor(Math.random() * types.length)])
                  setLevel(Math.floor(Math.random() * 100) + 1)
                  setAttack(Math.floor(Math.random() * 100) + 1)
                  setDefense(Math.floor(Math.random() * 100) + 1)
                  setSpeed(Math.floor(Math.random() * 100) + 1)
                  setIsShiny(Math.random() > 0.9)
                }}
                className='w-full bg-gradient-to-r from-tolopea to-blood text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all transform hover:scale-105'
              >
                🎲 Générer Aléatoirement
              </button>
            </div>
          </div>
        </div>

        {/* Galerie de variations */}
        <div className='mt-12 bg-white rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-bold mb-6 text-gray-900'>Variations du même nom</h2>
          <p className='text-gray-800 font-medium mb-6'>
            Voici comment le monstre &quot;{name}&quot; apparaît avec différents types
          </p>
          <div className='grid grid-cols-4 md:grid-cols-7 gap-4'>
            {types.map((t) => {
              const profile = visualService.generateVisualProfile(
                name,
                t,
                level,
                bodyType,
                attack,
                defense,
                speed,
                false
              )
              return (
                <div
                  key={t}
                  className='flex flex-col items-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-tolopea'
                  onClick={() => setType(t)}
                >
                  <MonsterAvatar
                    visualProfile={profile}
                    animation='idle'
                    size={80}
                  />
                  <span className='text-xs font-semibold mt-2 text-gray-900'>{t}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
