import type { ComponentPropsWithRef, ReactNode } from 'react'

type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'children'> & {
  label: ReactNode
}

export default function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="checkbox">
      <input {...props} type="checkbox" className={['checkbox__input', className].filter(Boolean).join(' ')} />
      {label}
    </label>
  )
}
