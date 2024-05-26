import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'), // エントリポイント
            fileName: 'bundle', // 生成するファイルのファイル名を指定
            formats: ['es'],
        }
    }
  })