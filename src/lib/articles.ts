import fs from 'fs'
import path from 'path'
import articlesData from '../../data/articles.json'

export interface PdfArticle {
  id: string
  title: string
  pdfUrl: string
  previewSrc: string
  fileName: string
  sortOrder: number
}

export interface ArticlesPageContent {
  hero: {
    title: string
    subtitle: string
  }
  section: {
    eyebrow: string
    title: string
    description: string
  }
}

const PDF_DIR = path.join(process.cwd(), 'public', 'pdfs')
const PREVIEW_DIR = path.join(PDF_DIR, 'previews')

function slugify(fileName: string) {
  const stem = fileName.replace(/\.pdf$/i, '')
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'pdf'
}

function cleanTitle(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/^\d+\./, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function sortKey(fileName: string) {
  const match = fileName.match(/^(\d+)\./)
  return match ? Number.parseInt(match[1], 10) : 9999
}

export function getPdfArticles(): PdfArticle[] {
  if (!fs.existsSync(PDF_DIR)) return []

  const files = fs
    .readdirSync(PDF_DIR)
    .filter((name) => name.toLowerCase().endsWith('.pdf') && !name.startsWith('.'))

  return files
    .map((fileName) => {
      const slug = slugify(fileName)
      const previewFile = path.join(PREVIEW_DIR, `${slug}.jpg`)
      const previewSrc = fs.existsSync(previewFile)
        ? `/pdfs/previews/${slug}.jpg`
        : '/images/pdf-preview-placeholder.svg'

      return {
        id: slug,
        title: cleanTitle(fileName),
        pdfUrl: `/pdfs/${encodeURIComponent(fileName)}`,
        previewSrc,
        fileName,
        sortOrder: sortKey(fileName),
      }
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getArticlesPageContent(): ArticlesPageContent {
  return {
    hero: articlesData.hero,
    section: articlesData.section,
  }
}
