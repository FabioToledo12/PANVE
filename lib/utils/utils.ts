// Função utilitária para concatenar classes condicionalmente (usada em projetos Tailwind)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export {} // Garante que o arquivo seja tratado como módulo 