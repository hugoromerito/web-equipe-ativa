'use client'
import React from 'react'
import { translateCategory, translatePriority, translateStatus } from '@/constants/demand-translations'

interface BadgeDemandProps {
  className?: string
  variant?: 'default' | 'secondary' | 'outline'
  priority?: string
  status?: string
  category?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function BadgeDemand({
  className = '',
  variant = 'default',
  priority,
  status,
  category,
  children,
  size = 'md',
  animated = true,
  ...props
}: BadgeDemandProps) {
  let config = {
    label: children || '',
    icon: '📋',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    textColor: 'text-gray-700',
    pulse: false
  }

  if (priority) {
    config = { ...config, ...translatePriority(priority) }
  } else if (status) {
    config = { ...config, ...translateStatus(status) }
  } else if (category) {
    config = { ...config, ...translateCategory(category) }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full font-medium
    transition-all duration-300 transform hover:scale-105
    ${sizeClasses[size]}
  `

  let variantClasses = ''
  
  if (variant === 'outline') {
    variantClasses = `
      border-2 bg-white backdrop-blur-sm
      ${config.textColor} border-current
      hover:bg-gradient-to-r hover:${config.color} hover:text-white hover:border-transparent
      shadow-sm hover:shadow-md
    `
  } else if (variant === 'secondary') {
    variantClasses = `
      ${config.lightBg} ${config.textColor}
      hover:bg-gradient-to-r hover:${config.color} hover:text-white
      shadow-sm hover:shadow-md
    `
  } else {
    variantClasses = `
      bg-gradient-to-r ${config.color} text-white
      shadow-md hover:shadow-lg
      ${animated && config.pulse ? 'animate-pulse' : ''}
    `
  }

  const pulseEffect = animated && config.pulse && variant === 'default' ? 
    'before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-20 before:animate-ping' : ''

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses}
        ${pulseEffect}
        ${className}
        relative overflow-hidden
        hover:shadow-lg
      `}
      {...props}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-full" />
      
      {/* Icon */}
      <span className="relative z-10 text-current opacity-90">
        {config.icon}
      </span>
      
      {/* Text */}
      <span className="relative z-10 font-medium tracking-wide">
        {children || config.label}
      </span>
      
      {/* Shine effect */}
      {animated && (
        <div className="absolute inset-0 -skew-x-12 translate-x-full opacity-0 bg-gradient-to-r from-transparent via-white to-transparent hover:animate-shine hover:opacity-30 transition-opacity duration-700" />
      )}
    </span>
  )
}