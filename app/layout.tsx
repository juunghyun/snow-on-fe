import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '눈 ON | 실시간 대한민국 강설 현황', // 제목을 프로젝트에 맞게 수정했습니다.
  description: '실시간 대한민국 강설 현황을 보여주는 웹 애플리케이션',
  generator: 'v0.app',

  // 파비콘 설정: favicon.ico 파일만 명시합니다.
  icons: {
    icon: '/favicon.ico',
  },

  // manifest.json 연결은 필요 없으므로 제거했습니다.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
