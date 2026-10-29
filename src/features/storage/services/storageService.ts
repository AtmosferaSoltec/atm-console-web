import type { Bucket, StorageSummary, StoredFile } from '../types/storage.types'

const BUCKETS: Bucket[] = [
  { id: 'b1', name: 'olympus-docs', systemName: 'Olympus', filesCount: 4820, sizeGb: 28.6, isPublic: false, createdAt: '14 ene 2026' },
  { id: 'b2', name: 'lavendimia-media', systemName: 'Lavendimia', filesCount: 3104, sizeGb: 18.9, isPublic: false, createdAt: '14 ene 2026' },
  { id: 'b3', name: 'nubefact-pdfs', systemName: 'Facturación', filesCount: 2210, sizeGb: 9.4, isPublic: false, createdAt: '02 feb 2026' },
  { id: 'b4', name: 'avatars', systemName: 'Autenticación', filesCount: 640, sizeGb: 7.3, isPublic: true, createdAt: '21 feb 2026' },
]

const FILES: StoredFile[] = [
  { id: 'f1', name: 'guia-remision-T001-97.pdf', bucketName: 'nubefact-pdfs', kind: 'pdf', size: '184 KB', uploadedAt: 'hace 4 min' },
  { id: 'f2', name: 'producto-camisa-azul.webp', bucketName: 'lavendimia-media', kind: 'image', size: '312 KB', uploadedAt: 'hace 18 min' },
  { id: 'f3', name: 'contrato-agro-norte.docx', bucketName: 'olympus-docs', kind: 'document', size: '1.2 MB', uploadedAt: 'hace 1 h' },
  { id: 'f4', name: 'entrega-evidencia-0412.mp4', bucketName: 'olympus-docs', kind: 'video', size: '24.8 MB', uploadedAt: 'hace 3 h' },
  { id: 'f5', name: 'maria-quispe.png', bucketName: 'avatars', kind: 'image', size: '96 KB', uploadedAt: 'ayer' },
  { id: 'f6', name: 'respaldo-clientes.csv', bucketName: 'olympus-docs', kind: 'other', size: '3.4 MB', uploadedAt: 'ayer' },
]

const SUMMARY: StorageSummary = { usedGb: 64.2, limitGb: 100, filesCount: 10774, bucketsCount: 4 }

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getBuckets(): Bucket[] {
  return BUCKETS
}

export function getFiles(): StoredFile[] {
  return FILES
}

export function getStorageSummary(): StorageSummary {
  return SUMMARY
}
