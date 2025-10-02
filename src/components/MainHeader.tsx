
import Button from '@/components/button'

export default function MainHeader (): React.ReactNode {
  return (
    <header className='flex items-center justify-between px-6 py-4 shadow-sm sticky top-0 z-20 bg-[var(--color-background)]'>
      <div className='flex items-center gap-2'>
        <img src='/logo.png' alt='Logo' className='w-10 h-10' />
        <span className='font-bold text-lg tracking-wide'>My Monster</span>
      </div>
      <nav className='hidden sm:flex gap-6 text-md'>
        <a href='#hero' className='hover:text-aqua-forest-500 transition'>Accueil</a>
        <a href='#benefits' className='hover:text-aqua-forest-500 transition'>Bénéfices</a>
        <a href='#monsters' className='hover:text-aqua-forest-500 transition'>Monstres</a>
        <a href='#actions' className='hover:text-aqua-forest-500 transition'>Actions</a>
        <a href='#newsletter' className='hover:text-aqua-forest-500 transition'>Newsletter</a>
      </nav>
      <a href='/signup' className='ml-4'>
        <Button size='md' variant='primary'>Créer mon personnage</Button>
      </a>
    </header>
  )
}
