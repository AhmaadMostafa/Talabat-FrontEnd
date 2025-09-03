import clsx from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={clsx('animate-spin rounded-full border-t-2 border-primary-600', {
      'h-4 w-4 border-2': size === 'sm',
      'h-8 w-8 border-2': size === 'md',
      'h-12 w-12 border-4': size === 'lg',
    }, className)}>
      <div className="sr-only">Loading...</div>
    </div>
  )
}