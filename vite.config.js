import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import beautifyPkg from 'js-beautify'
import viteCompression from 'vite-plugin-compression'

const { html } = beautifyPkg

const __dirname = resolve(fileURLToPath(import.meta.url), '..')

// Custom plugin for multi-page routing in dev mode
function multiPageDevPlugin() {
  return {
    name: 'multi-page-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Handle root path - redirect to index
        if (req.url === '/') {
          req.url = '/src/pages/index.html'
        }
        // Handle clean URLs for other pages
        else if (req.url === '/interactions') {
          req.url = '/src/pages/interactions.html'
        }
        else if (req.url === '/text') {
          req.url = '/src/pages/text.html'
        }
        else if (req.url === '/media') {
          req.url = '/src/pages/media.html'
        }
        else if (req.url === '/learning-blocks') {
          req.url = '/src/pages/learning-blocks.html'
        }
        else if (req.url === '/knowledge-check') {
          req.url = '/src/pages/knowledge-check.html'
        }
        else if (req.url === '/marker-reference') {
          req.url = '/src/pages/marker-reference.html'
        }
        else if (req.url === '/tables') {
          req.url = '/src/pages/tables.html'
        }
        next()
      })
    }
  }
}

// Custom plugin for HTML includes (replaces gulp-file-include)
function htmlIncludesPlugin() {
  return {
    name: 'html-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        return processIncludes(html, context.filename)
      }
    }
  }
}

// Custom plugin for partial processing (replaces gulp-partial-processor)
function partialProcessorPlugin() {
  return {
    name: 'partial-processor',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        return processPartials(html)
      }
    }
  }
}

// Process @@include() syntax
function processIncludes(content, filename) {
  const includeRegex = /@@include\('([^']+)'\)/g
  let match
  
  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1]
    const fullPath = resolve('src/partials', includePath)
    
    try {
      const includeContent = fs.readFileSync(fullPath, 'utf8')
      // Recursively process includes in the included content
      const processedContent = processIncludes(includeContent, fullPath)
      // Process the partial content to convert XML-like tags to HTML
      const finalContent = processPartials(processedContent)
      content = content.replace(match[0], finalContent)
    } catch (error) {
      console.warn(`Could not include file: ${includePath}`)
    }
  }
  
  return content
}

// Process XML-like tags in partials
function processPartials(content) {
  // Check if this is a partial with XML-like tags
  if (!content.includes('<heading>') && !content.includes('<blurb>') && !content.includes('<preview>')) {
    return content
  }

  // Extract the XML-like tags
  const headingMatch = content.match(/<heading>(.*?)<\/heading>/s)
  const blurbMatch = content.match(/<blurb>(.*?)<\/blurb>/s)
  const previewMatch = content.match(/<preview>(.*?)<\/preview>/s)
  const wordMatch = content.match(/<word>(.*?)<\/word>/s)
  const notesMatch = content.match(/<notes>(.*?)<\/notes>/s)

  const heading = headingMatch ? headingMatch[1].trim() : ''
  const blurb = blurbMatch ? blurbMatch[1].trim() : ''
  const preview = previewMatch ? previewMatch[1].trim() : ''
  const word = wordMatch ? wordMatch[1].trim() : ''
  const notes = notesMatch ? notesMatch[1].trim() : ''

  // Create the HTML structure
  let html = ''
  
  if (heading) {
    html += `<header><h2>${heading}</h2></header>\n`
  }
  
  if (blurb) {
    html += `<article class="blurb">${blurb}</article>\n`
  }
  
  if (preview) {
    html += `<article class="preview">${preview}</article>\n`
    
    // Generate the HTML section at build time
    const beautifiedPreview = beautify(preview)
    const escapedPreview = beautifiedPreview.split("<").join("&lt;")
    html += `<section class='html'><pre><code class='language-markup'>${escapedPreview}</code></pre></section>\n`
  }
  
  if (word) {
    html += `<article class="word">${word}</article>\n`
  }
  
  if (notes) {
    html += `<article class="notes">${notes}</article>\n`
  }

  // Wrap in a section with proper ID
  const safeId = heading ? heading.toLowerCase().replace(/\W+/g, '-') : 'unknown'
  return `<section class="element" id="${safeId}">\n${html}</section>`
}

// HTML beautify function using js-beautify
function beautify(htmlContent) {
  return html(htmlContent, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 1,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: false,
    indent_empty_lines: false
  })
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index.html'),
        interactions: resolve(__dirname, 'src/pages/interactions.html'),
        'knowledge-check': resolve(__dirname, 'src/pages/knowledge-check.html'),
        'learning-blocks': resolve(__dirname, 'src/pages/learning-blocks.html'),
        'marker-reference': resolve(__dirname, 'src/pages/marker-reference.html'),
        media: resolve(__dirname, 'src/pages/media.html'),
        tables: resolve(__dirname, 'src/pages/tables.html'),
        text: resolve(__dirname, 'src/pages/text.html')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[ext]'
          }
          return 'assets/[name].[ext]'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    middlewareMode: false
  },
  preview: {
    port: 4173
  },
  css: {
    preprocessorOptions: {
      scss: {
        // No additional data needed
      }
    },
    // Suppress asset resolution warnings for public assets
    devSourcemap: false
  },
  plugins: [
    multiPageDevPlugin(),
    htmlIncludesPlugin(),
    // Compression plugin for gzip files
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files larger than 1KB
      minRatio: 0.8, // Only compress if compression ratio is better than 80%
      deleteOriginFile: false // Keep original files
    }),
    // Compression plugin for brotli files
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files larger than 1KB
      minRatio: 0.8, // Only compress if compression ratio is better than 80%
      deleteOriginFile: false // Keep original files
    }),
    {
      name: 'move-html-to-root',
      writeBundle() {
        // Move HTML files from dist/src/pages/ to dist/
        const srcDir = resolve(__dirname, 'dist/src/pages')
        const distDir = resolve(__dirname, 'dist')
        
        if (fs.existsSync(srcDir)) {
          const files = fs.readdirSync(srcDir)
          files.forEach(file => {
            if (file.endsWith('.html')) {
              fs.renameSync(
                resolve(srcDir, file),
                resolve(distDir, file)
              )
            }
          })
          
          // Remove empty directories
          try {
            fs.rmdirSync(srcDir) // Remove pages directory
            fs.rmdirSync(resolve(__dirname, 'dist/src')) // Remove src directory
          } catch (e) {
            // Directory not empty, that's fine
          }
        }
      }
    }
  ]
})
