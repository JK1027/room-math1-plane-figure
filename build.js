const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const indexHtmlPath = path.join(srcDir, 'Index.html');
const outputHtmlPath = path.join(__dirname, 'dist_test.html');

function resolveIncludes(htmlContent) {
  // <?!= include("path"); ?> 또는 <?!= include('path'); ?> 형식 매칭 (등호 = 및 선택적 세미콜론 지원)
  const includeRegex = /<\?!\s*=\s*include\s*\(\s*["']([^"']+)["']\s*\)\s*;?\s*\?>/g;
  
  return htmlContent.replace(includeRegex, (match, filepath) => {
    // 확장자가 없으면 .html을 기본으로 설정
    let targetFile = filepath;
    if (!targetFile.endsWith('.html') && !targetFile.endsWith('.js')) {
      targetFile += '.html';
    }
    
    const fullPath = path.join(srcDir, targetFile);
    if (fs.existsSync(fullPath)) {
      console.log(`Including: ${filepath} -> ${fullPath}`);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      // 포함하는 파일 내용 안에 또 include가 있을 수 있으므로 재귀적으로 해결
      return resolveIncludes(fileContent);
    } else {
      console.error(`Error: File not found: ${fullPath}`);
      return `<!-- Error: ${filepath} not found -->`;
    }
  });
}

try {
  console.log('Starting build for local test...');
  let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  let resultHtml = resolveIncludes(indexContent);
  fs.writeFileSync(outputHtmlPath, resultHtml, 'utf8');
  console.log(`Success! Combined HTML generated at: ${outputHtmlPath}`);
} catch (err) {
  console.error('Build failed:', err);
}
