import { useState } from 'react'
import { usePreviewUrl } from '@/features/storage'
import { cn } from '@/utils/cn'
import type { CompanyAvatarProps } from '../types/pulsoSetup.types'

function Monogram({ name, color, className }: Omit<CompanyAvatarProps, 'logoFileId'>) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-lg font-semibold text-white', className)} style={{ backgroundColor: color }}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}

function LogoImage({ logoFileId, name, color, className }: CompanyAvatarProps) {
  const { url } = usePreviewUrl(logoFileId)
  const [failed, setFailed] = useState(false)
  // While the signed URL loads, or if the image fails, the monogram keeps the layout steady.
  if (!url || failed) return <Monogram name={name} color={color} className={className} />
  return (
    <span className={cn('flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white', className)}>
      <img src={url} alt={`Logo de ${name}`} onError={() => setFailed(true)} className="size-full object-contain p-0.5" />
    </span>
  )
}

/** The company's logo, or its initial on the brand colour when it has none or it cannot be shown. */
export function CompanyAvatar({ logoFileId, name, color, className }: CompanyAvatarProps) {
  return logoFileId ? <LogoImage key={logoFileId} logoFileId={logoFileId} name={name} color={color} className={className} /> : <Monogram name={name} color={color} className={className} />
}
