import { Building2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { usePreviewUrl } from '../hooks/useStorage'
import type { CompanyLogoProps } from '../types/storage.types'

function LogoFrame({ children }: { children?: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-400">
      {children ?? <Building2 className="size-5" />}
    </span>
  )
}

function LogoImage({ fileId, name }: CompanyLogoProps) {
  const { url } = usePreviewUrl(fileId)
  const [failed, setFailed] = useState(false)
  // While the signed URL is loading, or if it cannot be shown, the placeholder keeps the row from jumping.
  if (!url || failed) return <LogoFrame />
  return (
    <LogoFrame>
      <img src={url} alt={`Logo de ${name}`} onError={() => setFailed(true)} className="size-full object-contain p-0.5" />
    </LogoFrame>
  )
}

/** Small square logo of a company, or a placeholder when it has none. */
export function CompanyLogo({ fileId, name }: CompanyLogoProps) {
  return fileId ? <LogoImage key={fileId} fileId={fileId} name={name} /> : <LogoFrame />
}
