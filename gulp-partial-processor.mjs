import through from 'through2';
import { Transform } from 'stream';
import fs from 'fs';
import path from 'path';

// Simple HTML beautify function
function beautify(html) {
	// Basic HTML formatting - add line breaks and indentation
	return html
		.replace(/></g, '>\n<')
		.replace(/^\s+|\s+$/gm, '') // trim lines
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0)
		.join('\n');
}

export function partialProcessor() {
	return through.obj(function(file, enc, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(new Error('Streaming not supported'));
		}

		try {
			let content = file.contents.toString();
			
			// Process partial content - convert XML-like tags to HTML structure
			content = processPartialContent(content);
			
			file.contents = Buffer.from(content);
			this.push(file);
			callback();
		} catch (err) {
			callback(err);
		}
	});
}

function processPartialContent(content) {
	// Check if this is a partial with XML-like tags
	if (!content.includes('<heading>') && !content.includes('<blurb>') && !content.includes('<preview>')) {
		// This is not a partial with XML tags, return as-is
		return content;
	}

	// Extract the XML-like tags
	const headingMatch = content.match(/<heading>(.*?)<\/heading>/s);
	const blurbMatch = content.match(/<blurb>(.*?)<\/blurb>/s);
	const previewMatch = content.match(/<preview>(.*?)<\/preview>/s);
	const wordMatch = content.match(/<word>(.*?)<\/word>/s);
	const notesMatch = content.match(/<notes>(.*?)<\/notes>/s);

	const heading = headingMatch ? headingMatch[1].trim() : '';
	const blurb = blurbMatch ? blurbMatch[1].trim() : '';
	const preview = previewMatch ? previewMatch[1].trim() : '';
	const word = wordMatch ? wordMatch[1].trim() : '';
	const notes = notesMatch ? notesMatch[1].trim() : '';

	// Create the HTML structure that the JavaScript was creating
	let html = '';
	
	if (heading) {
		html += `<header><h2>${heading}</h2></header>\n`;
	}
	
	if (blurb) {
		html += `<article class="blurb">${blurb}</article>\n`;
	}
	
	if (preview) {
		html += `<article class="preview">${preview}</article>\n`;
		
		// Generate the HTML section at build time (replacing prism-setup.js functionality)
		const beautifiedPreview = beautify(preview);
		const escapedPreview = beautifiedPreview.split("<").join("&lt;");
		html += `<section class='html'><pre><code class='language-markup'>${escapedPreview}</code></pre></section>\n`;
	}
	
	if (word) {
		html += `<article class="word">${word}</article>\n`;
	}
	
	if (notes) {
		html += `<article class="notes">${notes}</article>\n`;
	}

	// Wrap in a section with proper ID
	const safeId = heading ? heading.toLowerCase().replace(/\W+/g, '-') : 'unknown';
	return `<section class="element" id="${safeId}">\n${html}</section>`;
}
