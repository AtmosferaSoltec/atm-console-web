import { LoaderCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { QrFrameProps } from '../types/connect.types'

const QR_SIZE = 232

export function QrFrame({ value }: QrFrameProps) {
  return (
    <div className="relative mx-auto w-fit rounded-3xl bg-white p-5 shadow-pop ring-1 ring-slate-200/70">
      {/* Corner marks */}
      <span className="absolute top-2.5 left-2.5 size-6 rounded-tl-xl border-t-[3px] border-l-[3px] border-brand-500" />
      <span className="absolute top-2.5 right-2.5 size-6 rounded-tr-xl border-t-[3px] border-r-[3px] border-brand-500" />
      <span className="absolute bottom-2.5 left-2.5 size-6 rounded-bl-xl border-b-[3px] border-l-[3px] border-brand-500" />
      <span className="absolute right-2.5 bottom-2.5 size-6 rounded-br-xl border-r-[3px] border-b-[3px] border-brand-500" />

      <div className="relative overflow-hidden rounded-xl" style={{ width: QR_SIZE, height: QR_SIZE }}>
        {value ? (
          <>
            <QRCodeSVG value={value} size={QR_SIZE} level="M" marginSize={0} fgColor="#0f172a" />
            <div className="absolute inset-x-0 top-0 h-full">
              <div className="h-10 animate-scan bg-gradient-to-b from-transparent via-brand-400/30 to-brand-400/0" />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400">
            <LoaderCircle className="size-8 animate-spin" />
            <span className="text-xs">Generando tu código…</span>
          </div>
        )}
      </div>
    </div>
  )
}
