
import Button from '@/components/button'

export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='flex flex-col items-center justify-center text-center py-16 gap-6 bg-aqua-forest-50'>
      <h1 className='text-4xl sm:text-5xl font-extrabold text-aqua-forest-700 mb-2'>Adopte ton monstre, chouchoute-le !</h1>
      <div className='flex justify-center gap-4 mb-2'>
        {/* SVG simple pour remplacer l'animation */}
        <svg width='96' height='96' viewBox='0 0 96 96' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='48' cy='48' r='46' fill='#92c39a' stroke='#428751' strokeWidth='4' />
          <ellipse cx='36' cy='50' rx='6' ry='8' fill='#fff' />
          <ellipse cx='60' cy='50' rx='6' ry='8' fill='#fff' />
          <circle cx='36' cy='52' r='2' fill='#171717' />
          <circle cx='60' cy='52' r='2' fill='#171717' />
          <path d='M40 66 Q48 72 56 66' stroke='#171717' strokeWidth='2' fill='none' strokeLinecap='round' />
        </svg>
      </div>
      <p className='text-lg sm:text-xl max-w-2xl text-aqua-forest-900'>Découvre My Monster, le jeu où tu prends soin d’un adorable petit monstre virtuel. Nourris-le, joue avec lui, fais-le évoluer et partage des moments uniques !</p>
      <a href='/signup'>
        <Button size='lg' variant='primary'>Je m’inscris</Button>
      </a>
    </section>
  )
}
