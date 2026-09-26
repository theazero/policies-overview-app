import type { ComponentPropsWithRef } from 'react'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'default' | 'primary'
}

export default function Button({ variant = 'default', type = 'button', className, ...props }: ButtonProps) {
  const classes = ['button', variant === 'primary' && 'button--primary', className]
    .filter(Boolean).join(' ')

  return <button {...props} type={type} className={classes} />
}
