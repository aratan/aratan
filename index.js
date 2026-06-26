const fs = require('fs').promises
const Parser = require('rss-parser')
const parser = new Parser()

const CHANNEL_ID = 'UCIehR0_0f5zzffcz93CmuXw'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const LATEST_VIDEO_PLACEHOLDER = '%{{latest_article}}%'

;(async () => {
  try {
    const markdownTemplate = await fs.readFile('./readme.tpl', { encoding: 'utf-8' })

    const { items } = await parser.parseURL(RSS_URL)

    if (!items || items.length === 0) {
      console.log('No se encontraron videos en el feed.')
      return
    }

    const latest = items[0]
    const videoId = latest.id?.replace('yt:video:', '') || ''
    const videoTitle = latest.title || 'Último video'
    const videoLink = latest.link || `https://www.youtube.com/watch?v=${videoId}`
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    const videoMarkdown = [
      `<a href="${videoLink}" target="_blank">`,
      `  <img src="${thumbnail}" width="480" alt="${videoTitle}" />`,
      `</a>`,
      ``,
      `📺 **[${videoTitle}](${videoLink})**`,
    ].join('\n')

    const newMarkdown = markdownTemplate.replace(LATEST_VIDEO_PLACEHOLDER, videoMarkdown)
    await fs.writeFile('./README.md', newMarkdown)

    console.log(`✅ README.md actualizado con: ${videoTitle}`)
  } catch (err) {
    console.error('Error al actualizar README:', err.message)
    process.exit(1)
  }
})()

/*  
  NOTA: Para detectar DIRECTOS en vivo / upcoming necesitarías 
  la YouTube Data API v3 con una API key. 
  Este script usa RSS (sin auth) y captura el último video publicado.
*/
