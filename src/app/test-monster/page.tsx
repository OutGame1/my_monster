'use client'

import { ReactNode, useState } from 'react'
import { generateMonsterTraits } from '@/monster/generator'
import { type AnimationState, type BodyShape, type ArmType, type LegType, type EyeType, type MouthType, type MonsterTraits } from '@/monster/types'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import Card from '@/components/ui/Card'

const SAMPLE_NAMES = ['Fluffy', 'Sparkle', 'Shadow', 'Bubbles', 'Thunder', 'Cookie']

const ANIMATIONS: Array<{ state: AnimationState, label: string, emoji: string }> = [
  { state: 'idle', label: 'Calme', emoji: '😐' },
  { state: 'happy', label: 'Joyeux', emoji: '😄' },
  { state: 'eating', label: 'Manger', emoji: '🍔' },
  { state: 'playing', label: 'Jouer', emoji: '🎮' },
  { state: 'sleeping', label: 'Dormir', emoji: '😴' },
  { state: 'sad', label: 'Triste', emoji: '😢' }
]

const BODY_SHAPES: BodyShape[] = ['round', 'pear', 'tall']
const ARM_TYPES: ArmType[] = ['short', 'long', 'tiny']
const LEG_TYPES: LegType[] = ['stumpy', 'long', 'feet']
const EYE_TYPES: EyeType[] = ['dot', 'round', 'star']
const MOUTH_TYPES: MouthType[] = ['smile', 'neutral', 'open']

export default function TestMonsterPage (): ReactNode {
  const [selectedName, setSelectedName] = useState('Fluffy')
  const [customName, setCustomName] = useState('')
  const [animation, setAnimation] = useState<AnimationState>('idle')
  const [manualMode, setManualMode] = useState(false)

  // Manual trait selection
  const [manualBody, setManualBody] = useState<BodyShape>('round')
  const [manualArms, setManualArms] = useState<ArmType>('short')
  const [manualLegs, setManualLegs] = useState<LegType>('stumpy')
  const [manualEyes, setManualEyes] = useState<EyeType>('round')
  const [manualMouth, setManualMouth] = useState<MouthType>('smile')

  const displayName = customName.trim() !== '' ? customName : selectedName
  const generatedTraits = generateMonsterTraits(displayName)

  const traits: MonsterTraits = manualMode
    ? {
        bodyShape: manualBody,
        armType: manualArms,
        legType: manualLegs,
        eyeType: manualEyes,
        mouthType: manualMouth,
        primaryColor: generatedTraits.primaryColor,
        secondaryColor: generatedTraits.secondaryColor,
        outlineColor: generatedTraits.outlineColor,
        size: generatedTraits.size
      }
    : generatedTraits

  return (
    <div className='min-h-screen bg-gradient-to-b from-tolopea-50 to-white p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-center text-3xl font-bold text-tolopea-900'>
          Générateur de Monstres
        </h1>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Monster Display */}
          <Card className='flex flex-col items-center justify-center'>
            <h2 className='mb-4 text-xl font-semibold text-tolopea-800'>{displayName}</h2>
            <MonsterAvatar
              traits={traits}
              animation={animation}
              size={280}
            />
            <div className='mt-4 text-center text-sm text-gray-600'>
              <p>Corps: <strong>{traits.bodyShape}</strong></p>
              <p>Bras: <strong>{traits.armType}</strong></p>
              <p>Jambes: <strong>{traits.legType}</strong></p>
              <p>Yeux: <strong>{traits.eyeType}</strong></p>
              <p>Bouche: <strong>{traits.mouthType}</strong></p>
              <p>Taille: <strong>{traits.size}%</strong></p>
            </div>
          </Card>

          {/* Controls */}
          <div className='flex flex-col gap-6'>
            {/* Mode Toggle */}
            <Card>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-tolopea-800'>Mode de création</h3>
                <button
                  onClick={() => setManualMode(!manualMode)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    manualMode
                      ? 'bg-blood-500 text-white hover:bg-blood-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {manualMode ? '✏️ Manuel' : '🎲 Aléatoire'}
                </button>
              </div>
            </Card>

            {manualMode
              ? (
                <>
                  {/* Manual Body Parts Selection */}
                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Corps</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      {BODY_SHAPES.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setManualBody(shape)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            manualBody === shape
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Bras</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      {ARM_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setManualArms(type)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            manualArms === type
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Jambes</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      {LEG_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setManualLegs(type)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            manualLegs === type
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Yeux</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      {EYE_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setManualEyes(type)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            manualEyes === type
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Bouche</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      {MOUTH_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setManualMouth(type)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            manualMouth === type
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
                )
              : (
                <>
                  {/* Random Name Selection */}
                  <Card>
                    <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Choisir un nom</h3>
                    <div className='mb-4 grid grid-cols-3 gap-2'>
                      {SAMPLE_NAMES.map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setSelectedName(name)
                            setCustomName('')
                          }}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                            selectedName === name && customName === ''
                              ? 'border-tolopea-500 bg-tolopea-50 text-tolopea-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-tolopea-300'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label htmlFor='custom-name' className='mb-2 block text-sm font-medium text-gray-700'>
                        Ou entrez un nom personnalisé
                      </label>
                      <input
                        id='custom-name'
                        type='text'
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder='Mon monstre...'
                        className='w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
                      />
                    </div>
                  </Card>
                </>
                )}

            <Card>
              <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Actions & Animations</h3>
              <div className='grid grid-cols-2 gap-3'>
                {ANIMATIONS.map(({ state, label, emoji }) => (
                  <button
                    key={state}
                    onClick={() => setAnimation(state)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                      animation === state
                        ? 'border-blood-500 bg-blood-50 text-blood-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blood-300'
                    }`}
                  >
                    <span className='mr-2'>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className='bg-tolopea-50'>
              <h3 className='mb-2 text-lg font-semibold text-tolopea-800'>💡 Comment ça marche ?</h3>
              <ul className='space-y-2 text-sm text-gray-700'>
                <li>• Chaque nom génère un monstre unique et cohérent</li>
                <li>• Le même nom produira toujours le même monstre</li>
                <li>• Les actions changent l&apos;animation et l&apos;expression</li>
                <li>• Les traits (forme, yeux, bouche) sont aléatoires mais reproductibles</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
