
import Button from '@/components/button'

export default function NewsletterSection (): React.ReactNode {
  return (
    <section id='newsletter' className='py-16 px-4 bg-blood-50 text-blood-900 flex flex-col items-center'>
      <h2 className='text-3xl font-bold mb-4'>Abonne-toi à la newsletter</h2>
      <p className='mb-6'>Reçois des astuces, des nouveautés et profite de <span className='font-bold text-blood-600'>10% de réduction</span> sur ton premier achat in-app !</p>
      <form className='flex flex-col sm:flex-row gap-4 w-full max-w-md'>
        <input type='email' required placeholder='Ton email' className='flex-1 px-4 py-2 rounded border border-blood-200 focus:outline-none focus:ring-2 focus:ring-blood-400' />
        <Button size='md' variant='primary'>Je m’abonne</Button>
      </form>
    </section>
  )
}
