function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </label>
  )
}

export default InputField
