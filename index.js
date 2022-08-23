const fs = require('fs').promises
const { link } = require('fs/promises');
const { title } = require('process');
const Parser = require('rss-parser');
const parser = new Parser()

//https://www.youtube.com/feeds/videos.xml?channel_id=UCQhJflR7fN0f9t_1bYhwmMw

const LATEST_ARTICLE_PLACEHOLDER = '%{{latest_article}}%'

;(async () => {
    const markdownTemplate = await fs.readFile('./readme.tpl', {encoding: 'utf-8'})
    const {items} = await parser.parseURL('https://www.youtube.com/feeds/videos.xml?channel_id=UCQhJflR7fN0f9t_1bYhwmMw')
    const [{title,link}] = items
    const latestArticleMarkdown = `[${title}](${link})`
    //console.log(latestArticleMarkdown)
    const newMarkdown = markdownTemplate.replace(LATEST_ARTICLE_PLACEHOLDER, latestArticleMarkdown)
    console.log(newMarkdown)
    await fs.writeFile('./README.md', newMarkdown)
})()

fs.readFile('./readme.tpl', {encoding: 'utf-8'})
    .then(markdownTemplate =>{
        console.log(markdownTemplate)
    })