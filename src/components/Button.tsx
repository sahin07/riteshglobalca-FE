'use client'
import React from 'react'
import clsx from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }[size]
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-400',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black'
  }[variant]

  return <button className={clsx(base, sizes, variants, className)} {...props} />
}
