const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');
const assetsPath = path.join(distPath, 'assets');

let html = fs.readFileSync(indexHtmlPath, 'utf8');

const files = fs.readdirSync(assetsPath);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (jsFile) {
    const jsContent = fs.readFileSync(path.join(assetsPath, jsFile), 'utf8');
    html = html.replace(new RegExp(`<script type="module" crossorigin src="/assets/${jsFile}"></script>`), `<script type="module">${jsContent}</script>`);
}

if (cssFile) {
    const cssContent = fs.readFileSync(path.join(assetsPath, cssFile), 'utf8');
    html = html.replace(new RegExp(`<link rel="stylesheet" crossorigin href="/assets/${cssFile}">`), `<style>${cssContent}</style>`);
}

const outputPath = path.join(__dirname, 'driver-versao', '03_FRONTEND_SISTEMA.html');
fs.writeFileSync(outputPath, html);
console.log('Successfully merged files into ' + outputPath);
