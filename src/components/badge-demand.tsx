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
    color: 'from-slate-400 to-slate-500',
    bgColor: 'bg-slate-500',
    lightBg: 'bg-slate-50',
    textColor: 'text-slate-700',
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
    inline-flex items-center gap-1.5 rounded-lg font-medium
    transition-all duration-200 border
    ${sizeClasses[size]}
  `

  let variantClasses = ''
  
  if (variant === 'outline') {
    variantClasses = `
      bg-white border-current
      ${config.textColor} 
      hover:bg-slate-50
    `
  } else if (variant === 'secondary') {
    variantClasses = `
      ${config.lightBg} ${config.textColor} border-transparent
      hover:bg-slate-100
    `
  } else {
    // Medical status colors for default variant
    if (status === 'PENDING') {
      variantClasses = 'bg-amber-50 text-amber-700 border-amber-200'
    } else if (status === 'IN_PROGRESS') {
      variantClasses = 'bg-blue-50 text-blue-700 border-blue-200'
    } else if (status === 'RESOLVED') {
      variantClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    } else if (priority === 'URGENT') {
      variantClasses = 'bg-red-50 text-red-700 border-red-200'
    } else if (priority === 'HIGH') {
      variantClasses = 'bg-orange-50 text-orange-700 border-orange-200'
    } else if (priority === 'MEDIUM') {
      variantClasses = 'bg-yellow-50 text-yellow-700 border-yellow-200'
    } else if (priority === 'LOW') {
      variantClasses = 'bg-green-50 text-green-700 border-green-200'
    } else {
      variantClasses = 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses}
        ${className}
        ${animated && config.pulse ? 'animate-pulse' : ''}
      `}
      {...props}
    >
      {/* Icon */}
      <span className="text-current opacity-80">
        {config.icon}
      </span>
      
      {/* Text */}
      <span className="font-medium">
        {children || config.label}
      </span>
    </span>
  )
}