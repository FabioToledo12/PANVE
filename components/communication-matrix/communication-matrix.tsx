"use client"

import { useEffect, useRef, useState } from "react"
import { Share2, Printer, Download, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

interface MatrixData {
  name: string
  date: string
  responses: {
    sectionA?: Record<string, Record<string, string>>
    sectionB?: Record<string, Record<string, string>>
    sectionC?: Record<string, Record<string, string>>
  }
}

interface CommunicationMatrixProps {
  data: MatrixData
}

export function CommunicationMatrix({ data }: CommunicationMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { patientName } = useAssessmentStore()

  const colors = {
    primary: "#1E6F5C",
    secondary: "#29BB89",
    accent: "#289672",
    emergent: "#FFCE54",
    mastered: "#48CFAD",
    background: "#FFFFFF",
    text: "#333333",
    lightText: "#FFFFFF",
    border: "#DDDDDD",
  }

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 1150
    canvas.height = 794

    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawMatrix(ctx, canvas, data)

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      if (containerWidth < canvas.width) {
        setScale((containerWidth / canvas.width) * 0.95)
      }
    }

    setImageUrl(canvas.toDataURL("image/png"))
  }, [data])

  const drawMatrix = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: MatrixData) => {
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const cellWidth = 60
    const cellHeight = 70
    const headerWidth = 100
    const sectionHeaderHeight = 35
    const sectionGap = 10

    ctx.fillStyle = colors.primary
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("PANVE", canvasWidth / 2, 30)

    ctx.fillStyle = colors.text
    ctx.font = "14px Arial"
    const displayName = patientName || data.name || "Avaliação de Comunicação"
    if (displayName !== "Avaliação de Comunicação") {
      ctx.fillText(`Paciente: ${displayName}`, canvasWidth / 2, 50)
      ctx.fillText(`Data da avaliação: ${data.date}`, canvasWidth / 2, 70)
    } else {
      ctx.fillText(`Data da avaliação: ${data.date}`, canvasWidth / 2, 55)
    }

    const matrixStartY = displayName !== "Avaliação de Comunicação" ? 95 : 80

    const levels = [
      {
        id: "1",
        name: "Nível 1",
        description: "Comportamento pré-intencional",
        color: colors.primary,
      },
      {
        id: "2",
        name: "Nível 2",
        description: "Comportamento intencional",
        color: colors.primary,
      },
      {
        id: "3",
        name: "Nível 3",
        description: "Comunicação não convencional",
        color: colors.primary,
      },
      {
        id: "4",
        name: "Nível 4",
        description: "Comunicação convencional",
        color: colors.primary,
      },
      {
        id: "5",
        name: "Nível 5",
        description: "Símbolos Concretos",
        color: colors.primary,
      },
      {
        id: "6",
        name: "Nível 6",
        description: "Símbolos Abstratos",
        color: colors.primary,
      },
      {
        id: "7",
        name: "Nível 7",
        description: "Linguagem",
        color: colors.primary,
      },
    ]

    const sections = [
      { id: "recusar", name: "Recusar", color: colors.secondary },
      { id: "obter", name: "Obter", color: colors.secondary },
      { id: "social", name: "Social", color: colors.secondary },
      { id: "informacao", name: "Informação", color: colors.secondary },
    ]

    const columns = [
      { id: "A1", name: "Expressa desconforto", section: "recusar", level: "1" },
      { id: "B1", name: "Protesta", section: "recusar", level: "2" },
      { id: "C1", name: "Recusa rejeita", section: "recusar", level: "3-7" },

      { id: "A2", name: "Expressa conforto", section: "obter", level: "1" },
      { id: "B2", name: "Continua a ação", section: "obter", level: "2" },
      { id: "B3", name: "Obtém Mais de Algo", section: "obter", level: "2" },
      { id: "C2", name: "Solicita mais ação", section: "obter", level: "3-7" },
      { id: "C3", name: "Solicita Nova Ação", section: "obter", level: "3-7" },
      { id: "C4", name: "Solicita mais objeto", section: "obter", level: "3-7" },
      { id: "C5", name: "Faz escolhas", section: "obter", level: "3-7" },
      { id: "C6", name: "Solicita novo objeto", section: "obter", level: "3-7" },
      { id: "C7", name: "Solicita Objetos Ausentes", section: "obter", level: "3-7" },

      { id: "A3", name: "Expressa interesse em pessoas", section: "social", level: "1" },
      { id: "B4", name: "Atrai a atenção", section: "social", level: "2" },
      { id: "C8", name: "Solicita atenção", section: "social", level: "3-7" },
      { id: "C9", name: "Demonstra afeição", section: "social", level: "3-7" },
      { id: "C10", name: "Cumprimenta as pessoas", section: "social", level: "3-7" },
      { id: "C11", name: "Oferece, Ações", section: "social", level: "3-7" },
      { id: "C12", name: "Direciona sua atenção", section: "social", level: "3-7" },
      { id: "C13", name: "Formas sociais educadas", section: "social", level: "3-7" },

      { id: "C14", name: "Responde Sim/Não Perguntas", section: "informacao", level: "3-7" },
      { id: "C15", name: "Faz perguntas", section: "informacao", level: "3-7" },
      { id: "C16", name: "Nomeia Coisas/Pessoas", section: "informacao", level: "3-7" },
      { id: "C17", name: "Faz Comentários", section: "informacao", level: "3-7" },
    ]

    const sectionColumns: Record<string, typeof columns> = {
      recusar: columns.filter((c) => c.section === "recusar"),
      obter: columns.filter((c) => c.section === "obter"),
      social: columns.filter((c) => c.section === "social"),
      informacao: columns.filter((c) => c.section === "informacao"),
    }

    const sectionWidths: Record<string, number> = {}
    const sectionPositions: Record<string, number> = {}

    let currentX = headerWidth
    sections.forEach((section, index) => {
      sectionPositions[section.id] = currentX

      let width = 0

      const level1Count = sectionColumns[section.id].filter((c) => c.level === "1").length
      const level2Count = sectionColumns[section.id].filter((c) => c.level === "2").length
      const level3to7Count = sectionColumns[section.id].filter((c) => c.level === "3-7").length

      const maxColumns = Math.max(level1Count, level2Count, level3to7Count)
      width = maxColumns * cellWidth

      sectionWidths[section.id] = width
      currentX += width + (index < sections.length - 1 ? sectionGap : 0)
    })

    levels.forEach((level, i) => {
      const y = matrixStartY + i * cellHeight

      const gradient = ctx.createLinearGradient(0, y, 0, y + cellHeight)
      gradient.addColorStop(0, colors.primary)
      gradient.addColorStop(1, colors.accent)
      ctx.fillStyle = gradient
      ctx.fillRect(0, y, headerWidth, cellHeight)

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(headerWidth, y)
      ctx.lineTo(headerWidth, y + cellHeight)
      ctx.lineTo(0, y + cellHeight)
      ctx.closePath()
      ctx.strokeStyle = colors.background
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = colors.lightText
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(level.name, headerWidth / 2, y + 25)

      ctx.font = "12px Arial"
      const words = level.description.split(" ")
      let line = ""
      let lineY = y + 45

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        if (testLine.length * 5 > headerWidth - 20) {
          ctx.fillText(line, headerWidth / 2, lineY)
          line = words[n] + " "
          lineY += 15
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, headerWidth / 2, lineY)
    })

    sections.forEach((section) => {
      const x = sectionPositions[section.id]
      const width = sectionWidths[section.id]
      const y = matrixStartY + levels.length * cellHeight

      const gradient = ctx.createLinearGradient(x, y, x + width, y)
      gradient.addColorStop(0, colors.secondary)
      gradient.addColorStop(1, colors.accent)
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, sectionHeaderHeight)

      ctx.fillStyle = colors.lightText
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(section.name, x + width / 2, y + 22)
    })

    const legendX = canvasWidth - 170
    const legendY = canvasHeight - 120
    drawLegend(ctx, legendX, legendY)

    const allSectionsDominated = {
      A: false,
      B: false,
      C: false,
    }

    let sectionADominated = true
    for (let i = 1; i <= 3; i++) {
      const questionId = `A.${i}`
      if (!data.responses.sectionA?.[questionId]) {
        sectionADominated = false
        break
      }

      let questionHasMastered = false
      Object.values(data.responses.sectionA[questionId]).forEach((status) => {
        if (status === "mastered") questionHasMastered = true
      })

      if (!questionHasMastered) {
        sectionADominated = false
        break
      }
    }
    allSectionsDominated.A = sectionADominated

    let sectionBDominated = true
    for (let i = 1; i <= 4; i++) {
      const questionId = `B.${i}`
      if (!data.responses.sectionB?.[questionId]) {
        sectionBDominated = false
        break
      }

      let questionHasMastered = false
      Object.values(data.responses.sectionB[questionId]).forEach((status) => {
        if (status === "mastered") questionHasMastered = true
      })

      if (!questionHasMastered) {
        sectionBDominated = false
        break
      }
    }
    allSectionsDominated.B = sectionBDominated

    let sectionCDominated = true
    for (let i = 1; i <= 17; i++) {
      const questionId = `C.${i}`
      if (!data.responses.sectionC?.[questionId]) {
        sectionCDominated = false
        break
      }

      let questionHasMasteredInAnyLevel = false
      Object.entries(data.responses.sectionC[questionId]).forEach(([key, status]) => {
        if (status === "mastered") {
          questionHasMasteredInAnyLevel = true
        }
      })

      if (!questionHasMasteredInAnyLevel) {
        sectionCDominated = false
        break
      }
    }
    allSectionsDominated.C = sectionCDominated

    sections.forEach((section) => {
      const sectionX = sectionPositions[section.id];
      const level1Columns = sectionColumns[section.id].filter((col) => col.level === "1");
      level1Columns.forEach((column, colIndex) => {
        const x = sectionX + colIndex * cellWidth;
        const y = matrixStartY + 0 * cellHeight;
        const status = getCellStatus(column.id, "1", data);
        const useSuperadoStatus = allSectionsDominated.A && status === "mastered";
        drawCell(ctx, x, y, cellWidth, cellHeight, column, status, useSuperadoStatus);
      });
    });

    sections.forEach((section) => {
      const sectionX = sectionPositions[section.id]

      const level2Columns = sectionColumns[section.id].filter((col) => col.level === "2")
      const level3to7Columns = sectionColumns[section.id].filter((col) => col.level === "3-7")

      level2Columns.forEach((column, colIndex) => {
        const x = sectionX + colIndex * cellWidth
        const y = matrixStartY + 1 * cellHeight

        const status = getCellStatus(column.id, "2", data)
        const useSuperadoStatus = allSectionsDominated.A && status === "mastered"
        drawCell(ctx, x, y, cellWidth, cellHeight, column, status, useSuperadoStatus)
      })

      level3to7Columns.forEach((column, colIndex) => {
        const x = sectionX + colIndex * cellWidth

        for (let levelIndex = 2; levelIndex < 7; levelIndex++) {
          const y = matrixStartY + levelIndex * cellHeight
          const levelId = (levelIndex + 1).toString()

          const status = getCellStatus(column.id, levelId, data)
          const useSuperadoStatus = allSectionsDominated.B && status === "mastered"

          drawCell(ctx, x, y, cellWidth, cellHeight, column, status, useSuperadoStatus)
        }
      })
    })

    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 2
    sections.forEach((section, index) => {
      if (index < sections.length - 1) {
        const x = sectionPositions[section.id] + sectionWidths[section.id] + sectionGap / 2
        ctx.beginPath()
        ctx.moveTo(x, matrixStartY)
        ctx.lineTo(x, matrixStartY + levels.length * cellHeight + sectionHeaderHeight)
        ctx.stroke()
      }
    })

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("PANVE - Avaliação de Habilidades Comunicativas", canvasWidth / 2, canvasHeight - 10)
  }

  const getCellStatus = (columnId: string, levelId: string, data: MatrixData): string => {
    if (!data.responses) {
      return "not-used"
    }

    const columnType = columnId.charAt(0)
    const columnNumber = Number.parseInt(columnId.substring(1), 10)

    // Função auxiliar para contar respostas em um grupo
    const countStatuses = (responsesObj: Record<string, string> | undefined, filterKey?: (key: string) => boolean) => {
      let emergent = 0
      let mastered = 0
      if (!responsesObj) return { emergent, mastered }
      Object.entries(responsesObj).forEach(([key, value]) => {
        if (filterKey && !filterKey(key)) return
        if (value === "emergent") emergent++
        if (value === "mastered") mastered++
      })
      return { emergent, mastered }
    }

    if (columnType === "A" && levelId === "1") {
      const sectionAData = data.responses.sectionA
      if (!sectionAData) return "not-used"
      const questionId = `A.${columnNumber}`
      const questionResponses = sectionAData[questionId]
      if (!questionResponses || typeof questionResponses !== "object") return "not-used"
      // Conta todas as respostas do grupo (A.x)
      const { emergent, mastered } = countStatuses(questionResponses)
      if (emergent > mastered) return "emergent"
      if (mastered > emergent) return "mastered"
      return "not-used"
    }

    if (columnType === "B" && levelId === "2") {
      const sectionBData = data.responses.sectionB
      if (!sectionBData) return "not-used"
      const questionId = `B.${columnNumber}`
      const questionResponses = sectionBData[questionId]
      if (!questionResponses || typeof questionResponses !== "object") return "not-used"
      // Conta todas as respostas do grupo (B.x)
      const { emergent, mastered } = countStatuses(questionResponses)
      if (emergent > mastered) return "emergent"
      if (mastered > emergent) return "mastered"
      return "not-used"
    }

    if (columnType === "C" && levelId >= "3" && levelId <= "7") {
      const sectionCData = data.responses.sectionC
      if (!sectionCData) return "not-used"
      const romanLevel =
        levelId === "3" ? "III" : levelId === "4" ? "IV" : levelId === "5" ? "V" : levelId === "6" ? "VI" : "VII"
      const questionId = `C.${columnNumber}`
      const questionResponses = sectionCData[questionId]
      if (!questionResponses || typeof questionResponses !== "object") return "not-used"
      // Conta apenas as respostas do nível correspondente dentro do grupo (C.x)
      const { emergent, mastered } = countStatuses(
        questionResponses,
        (key) => key.includes(`Nível ${romanLevel}:`) || key.includes(`NÍVEL ${romanLevel}:`)
      )
      if (emergent > mastered) return "emergent"
      if (mastered > emergent) return "mastered"
      return "not-used"
    }

    return "not-used"
  }

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    column: { id: string; name: string; extraLabel?: string },
    status: string,
    useSuperadoStatus: boolean,
  ) => {
    if (status === "emergent") {
      const emergentGradient = ctx.createLinearGradient(x, y, x, y + height)
      emergentGradient.addColorStop(0, colors.emergent)
      emergentGradient.addColorStop(1, "#FFE082")
      ctx.fillStyle = emergentGradient
    } else if (status === "mastered") {
      const masteredGradient = ctx.createLinearGradient(x, y, x, y + height)
      masteredGradient.addColorStop(0, colors.mastered)
      masteredGradient.addColorStop(1, "#A7FFEB")
      ctx.fillStyle = masteredGradient
    } else {
      ctx.fillStyle = colors.background
    }

    ctx.fillRect(x + 1, y + 1, width - 2, height - 2)

    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    ctx.fillStyle = colors.text
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText(column.id, x + 5, y + 15)

    ctx.font = "10px Arial"
    const words = column.name.split(" ")
    let line = ""
    let lineY = y + 30

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " "
      if (testLine.length * 5 > width - 10) {
        ctx.fillText(line, x + 5, lineY)
        line = words[n] + " "
        lineY += 12
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x + 5, lineY)
  }

  const drawLegend = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const boxSize = 16
    const spacing = 25

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillRect(x - 5, y - 5, 150, spacing * 3 + 10)
    ctx.strokeStyle = colors.border
    ctx.strokeRect(x - 5, y - 5, 150, spacing * 3 + 10)

    ctx.fillStyle = colors.text
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Não usado", x + boxSize + 10, y + 12)

    ctx.strokeStyle = colors.text
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, boxSize, boxSize)
    ctx.fillStyle = colors.background
    ctx.fillRect(x + 1, y + 1, boxSize - 2, boxSize - 2)

    ctx.fillStyle = colors.text
    ctx.fillText("Emergente", x + boxSize + 10, y + spacing + 12)

    ctx.strokeStyle = colors.text
    ctx.strokeRect(x, y + spacing, boxSize, boxSize)
    ctx.fillStyle = colors.emergent
    ctx.fillRect(x + 1, y + spacing + 1, boxSize - 2, boxSize - 2)

    ctx.fillStyle = colors.text
    ctx.fillText("Dominado", x + boxSize + 10, y + spacing * 2 + 12)

    ctx.strokeStyle = colors.text
    ctx.strokeRect(x, y + spacing * 2, boxSize, boxSize)
    ctx.fillStyle = colors.mastered
    ctx.fillRect(x + 1, y + spacing * 2 + 1, boxSize - 2, boxSize - 2)
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir o gráfico.")
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const imageUrl = canvas.toDataURL("image/png")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PANVE - Impressão</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            width: 100%;
            text-align: center;
          }
          .header {
            margin-bottom: 10px;
            text-align: center;
          }
          .header h1 {
            font-size: 18px;
            color: #1E6F5C;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 14px;
            color: #666;
            margin-top: 0;
          }
          .matrix-image {
            max-width: 100%;
            height: auto;
          }
          .footer {
            margin-top: 10px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PANVE</h1>
            <p>Avaliação de Habilidades Comunicativas - ${data.date}</p>
          </div>
          <img src="${imageUrl}" alt="PANVE" class="matrix-image" />
          <div class="footer">
            <p>© ${new Date().getFullYear()} PANVE - Todos os direitos reservados</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `)

    printWindow.document.close()
  }

  const handleShareWhatsApp = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `matriz-comunicacao-${data.date.replace(/\//g, "-")}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    const message = encodeURIComponent("Segue a PANVE da avaliação realizada em " + data.date)
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const handleShareEmail = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `matriz-comunicacao-${data.date.replace(/\//g, "-")}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    const subject = encodeURIComponent("PANVE - Avaliação " + data.date)
    const body = encodeURIComponent(
      "Segue em anexo a PANVE da avaliação realizada em " +
      data.date +
      ". Por favor, encontre o arquivo anexado a este email.",
    )

    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleDownload = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `matriz-comunicacao-${data.date.replace(/\//g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.2))
  }

  const handleZoomReset = () => {
    if (containerRef.current && canvasRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const canvasWidth = canvasRef.current.width
      setScale((containerWidth / canvasWidth) * 0.95)
    }
  }

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const canvasWidth = canvasRef.current.width
      setScale(Math.min((containerWidth / canvasWidth) * 0.95, 0.5))
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center print:hidden">
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-white hover:bg-gray-100"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white hover:bg-gray-100">
                <Share2 size={16} />
                <span>Compartilhar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleShareWhatsApp} className="flex items-center gap-2 cursor-pointer">
                <MessageSquare size={16} className="text-green-600" />
                <span>WhatsApp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareEmail} className="flex items-center gap-2 cursor-pointer">
                <Mail size={16} className="text-blue-600" />
                <span>Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} className="flex items-center gap-2 cursor-pointer">
                <Download size={16} />
                <span>Download</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="px-3 py-1 bg-white hover:bg-gray-100"
            title="Diminuir zoom"
          >
            -
          </Button>
          <Button
            onClick={handleZoomReset}
            variant="outline"
            size="sm"
            className="px-3 py-1 bg-white hover:bg-gray-100"
            title="Ajustar à tela"
          >
            Ajustar
          </Button>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="px-3 py-1 bg-white hover:bg-gray-100"
            title="Aumentar zoom"
          >
            +
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="matrix-container overflow-auto border border-gray-200 rounded-md bg-white"
        style={{
          maxHeight: "70vh",
          width: "100%",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: "fit-content",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  )
}
