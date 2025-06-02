import type React from "react"
export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-gray-50 min-h-screen">{children}</div>
}
