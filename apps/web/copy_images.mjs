import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../../Góc Nhà Mình _ Facebook');
const destDir = path.resolve(__dirname, 'public/images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'hero.jpg': 'Câu chuyện của góc nhà mình/657354297_122106792075287016_1512612225683356100_n.jpg',
  'logo.jpg': 'logo and paralax effect/642792381_122099330757287016_8314988747280443465_n.jpg',
  'menu-featured.jpg': 'Menu/Trà sữa olong camelia(best seller).jpg',
  'promo.jpg': 'Deal or thông báo  ( dán ở baner có khả năng tự lướt qua lại)/Deal free topping khi checking 2.jpg',
  'gallery-1.jpg': 'Câu chuyện của góc nhà mình/658273868_122106471615287016_7520371911359261908_n.jpg',
  'gallery-2.jpg': 'Câu chuyện của góc nhà mình/657042934_122106813723287016_8265101340127515010_n.jpg',
  'gallery-3.jpg': 'Câu chuyện của góc nhà mình/656621557_122106508407287016_7382614843143852174_n.jpg',
  'location.jpg': 'Deal or thông báo  ( dán ở baner có khả năng tự lướt qua lại)/658511358_122106813753287016_6920757217041444812_n.jpg'
};

for (const [destName, srcRelative] of Object.entries(map)) {
  const srcFile = path.join(sourceDir, srcRelative);
  const destFile = path.join(destDir, destName);
  
  try {
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${destName}`);
    } else {
      console.error(`Source not found: ${srcFile}`);
    }
  } catch (error) {
    console.error(`Failed to copy ${srcRelative}:`, error.message);
  }
}
