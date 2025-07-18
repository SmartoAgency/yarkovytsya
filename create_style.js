const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Будь ласка, вкажіть ім\'я компонента.');
  process.exit(1);
}

const componentScssPath = path.join(__dirname, 'src/assets/styles/components', `${componentName}.scss`);
const mainScssPath = path.join(__dirname, 'src/assets/styles/main.scss');

// Перевіряємо, чи існує файл стилів компонента
if (fs.existsSync(componentScssPath)) {
  console.error(`Файл ${componentName}.scss вже існує.`);
  process.exit(1);
}

// Створюємо файл стилів компонента
fs.writeFileSync(componentScssPath, '');

// Додаємо директиву @import до main.scss
const importDirective = `@import 'components/${componentName}';\n`;

fs.appendFileSync(mainScssPath, importDirective);

console.log(`Файл стилів ${componentName}.scss створено та додано директиву @import у main.scss.`);
