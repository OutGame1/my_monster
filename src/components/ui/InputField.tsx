import { ReactNode } from 'react'

interface InputFieldProps {
  type: string
  name: string
  label: string
  value: string
  onChangeText: (value: string) => void
  required?: boolean
  placeholder?: string
}

export default function InputField ({
  type,
  name,
  label,
  value,
  onChangeText,
  required = false,
  placeholder
}: InputFieldProps): ReactNode {
  return (
    <div className='relative'>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 mb-1'
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        required={required}
        placeholder={placeholder}
        className='w-full px-4 py-3 rounded-lg border border-gray-200
                 focus:border-tolopea-500 focus:ring-2 focus:ring-tolopea-200
                 transition-all duration-200 bg-white/50 backdrop-blur-sm
                 text-gray-900 placeholder-gray-400'
      />
    </div>
  )
}
