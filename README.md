# Estrutura do Projeto Communication Matrix

## Estrutura de Pastas
Teste
```
/app
  /assessment
  /patients
  /api
  page.tsx
  layout.tsx
  globals.css

/components
  /communication-matrix
    communication-matrix.tsx
  /ui
    (componentes de interface reutilizáveis)
  theme-provider.tsx

/lib
  store.ts
  api-client.ts
  actions.ts
  db.ts
  types.ts
  utils.ts

/hooks
  (custom hooks)

/styles
  (estilos globais ou específicos)

/public
  (imagens, ícones, etc.)

package.json
...
```

## Orientações
- **components/communication-matrix/**: componentes relacionados à matriz de comunicação.
- **components/ui/**: componentes de interface reutilizáveis (botões, inputs, etc).
- **lib/**: utilitários, tipos e lógica de negócio.
- **hooks/**: hooks customizados.
- **styles/**: arquivos de estilo globais ou específicos.
- **public/**: arquivos públicos, imagens, ícones, etc.
- **app/**: páginas e rotas do Next.js.

Essa estrutura facilita a manutenção e o entendimento do projeto. 