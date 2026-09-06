# Diretrizes de Processamento Semântico (Parser)

Ao ler arquivos de texto (.md) na pasta de conteúdo (`conteudo_base/`), o agente deve aplicar conversões visuais automáticas ao gerar as páginas e componentes do e-book:

- **Checklist Interativo**: Itens sequenciais, passos críticos ou tarefas operacionais de produção/higiene devem ser convertidos para o componente `<ChecklistOperacional />`.
- **Tabela Estilizada**: Tabelas de dados, gramaturas, custos, tempos, especificações técnicas e horários devem ser convertidas para o componente `<TabelaTecnica />`.
- **Card de Alerta**: Avisos de perigo, boas práticas sanitárias, normas de vácuo e temperaturas críticas (ex: -18°C, zona de perigo de 5°C a 60°C) devem ser convertidos para o componente `<CalloutAlerta />`.

## Convenções de Componentes e Design System
- **Tema Visual**: Estética escura sofisticada com tons de carvão (`#09090b`, `#18181b`, `#27272a`), ardósia e contrastes em tons quentes de âmbar, brasa e fogo (`#f59e0b`, `#ea580c`, `#be123c`).
- **Imagens e Ilustrações**: Salvas em `src/assets/illustrations/` e incorporadas via `<VisualBlock />` ou referenciadas nos cards.
- **Localização de Componentes**: Todos os blocos reutilizáveis residem em `src/components/`.
- **Páginas Geradas**: Criadas em `src/pages/` utilizando layout fluido, responsivo e interativo.
