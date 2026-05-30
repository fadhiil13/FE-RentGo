'use client'

import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
          {...props}
        />
        {error && <p className="error-msg">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
export default FormInput