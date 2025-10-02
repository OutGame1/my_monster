import { ReactNode } from 'react'
import AuthFormContent from '@/components/forms/AuthFormContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SignInPage (): ReactNode {
  return (
    <>
      <AuthFormContent />
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}
