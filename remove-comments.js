import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to remove comments from file content
function removeComments(content) {
  // Remove single-line comments (// ...)
  content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]\/\/).*$/gm, '');
  
  // Remove multi-line comments (/* ... */)
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove empty lines left after comment removal
  content = content.replace(/^\s*\n/gm, '');
  
  // Remove trailing whitespace
  content = content.replace(/\s+$/gm, '');
  
  return content;
}

// Function to process all files in a directory
function processDirectory(directory) {
  const files = readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = join(directory, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules and .git directories
      if (file.name === 'node_modules' || file.name === '.git') {
        continue;
      }
      processDirectory(fullPath);
    } else if (file.isFile() && /\.(js|jsx|ts|tsx)$/.test(file.name)) {
      try {
        // Skip this file
        if (file.name === 'remove-comments.js') continue;
        
        // Read file content
        const content = readFileSync(fullPath, 'utf8');
        // Remove comments
        const newContent = removeComments(content);
        // Write back to file if content changed
        if (newContent !== content) {
          writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Processed: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  }
}

// Start processing from the current directory
const rootDir = resolve(__dirname);
console.log('Starting to remove comments from all TypeScript and JavaScript files...');
processDirectory(rootDir);
console.log('Comment removal completed!');
