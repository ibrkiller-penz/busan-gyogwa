import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 원문 PDF를 복사하는 동안 감시가 파일을 잠가 서버가 죽는다.
  // 한글 경로에서 기본 감시가 수정을 가끔 놓쳐 폴링으로 본다.
  server: { watch: { ignored: ['**/자료/**', '**/dist/**'], usePolling: true, interval: 300 } },
})
