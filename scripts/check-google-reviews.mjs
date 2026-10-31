import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const compiled = ts.transpileModule(readFileSync('lib/customer-reviews.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const dataModule = { exports: {} }
new Function('module', 'exports', compiled)(dataModule, dataModule.exports)
const reviews = dataModule.exports.customerReviews
const expected = [
  ['Ayoub Bhalli', 'Excellente expérience avec AB FAST CAR à Marrakech ! Service professionnel, équipe accueillante et réactive. Réservation simple, communication claire et très bon accompagnement. Je recommande vivement AB FAST CAR pour la location de voitures à Marrakech ! 🚗✨', 'fr'],
  ['Driss Rachdi', 'أحسن اجونس', 'ar'],
  ['Meryama Belomari', 'Meilleure agence', 'fr'],
  ['Hamza Boughazi', 'Great service', 'en'],
]

test('preserves the four supplied names, full comments, original languages and owner response', () => {
  assert.deepEqual(reviews.map(r => [r.authorName, r.text, r.language]), expected)
  assert.deepEqual(reviews[3].ownerResponse, { text: 'Thank you', language: 'en' })
  assert(reviews.slice(0, 3).every(r => !r.ownerResponse))
})

test('contains only supplied information and Google avatar URLs, with no invented ratings or dates', () => {
  assert.equal(new Set(reviews.map(r => r.id)).size, 4)
  for (const review of reviews) {
    assert.equal(new URL(review.avatarUrl).origin, 'https://lh3.googleusercontent.com')
    assert(review.avatarUrl.endsWith('=w36-h36-p-rp-mo-br100'))
    assert.deepEqual(Object.keys(review).sort(), ['id', 'authorName', 'avatarUrl', 'text', 'language', ...(review.ownerResponse ? ['ownerResponse'] : [])].sort())
  }
})

test('French, English, Dutch, Arabic and prepared Spanish interface labels have matching keys', () => {
  const read = file => JSON.parse(readFileSync(file, 'utf8'))
  const source = read('messages/en.json').reviews
  for (const catalogue of [...['fr', 'nl', 'ar'].map(locale => read(`messages/${locale}.json`).reviews), read('messages/reviews/es.json')]) {
    assert.deepEqual(Object.keys(catalogue).sort(), Object.keys(source).sort())
    for (const key of Object.keys(source)) assert.deepEqual(catalogue[key].match(/\{\w+\}/g), source[key].match(/\{\w+\}/g))
  }
  assert.equal(read('messages/fr.json').reviews.subtitle, 'Découvrez les expériences authentiques de nos clients chez AB FAST CAR à Marrakech.')
})

// Optional audit directly against the user's original supplied brief.
const sourcePath = process.argv.find(arg => arg.startsWith('--source='))?.slice(9)
if (sourcePath) test('every name, avatar and exact comment is present verbatim in the supplied source brief', () => {
  const source = readFileSync(sourcePath, 'utf8')
  for (const review of reviews) for (const value of [review.authorName, review.avatarUrl, review.text]) assert(source.includes(value), value)
})
