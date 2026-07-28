# ARTÍS

Site estático da ARTÍS, desenvolvido com Astro e publicado pelo GitHub Pages.

## Desenvolvimento

Requisitos:

- Node.js 24 ou superior
- npm 11 ou superior

```bash
npm install
npm run dev
```

## Verificação

```bash
npm run verify
```

Esse comando valida o conteúdo estruturado, a formatação, os tipos, os testes e a
compilação estática.

## GitHub Pages

O site é compilado com o caminho-base do próprio repositório. No repositório
`clopesle/artis`, o endereço padrão é:

```text
https://clopesle.github.io/artis/
```

O workflow em `.github/workflows/deploy-pages.yml` valida, compila e publica apenas o
conteúdo aprovado na branch `main`.

Antes do lançamento, crie a variável de repositório `PUBLIC_WHATSAPP_NUMBER` em
**Settings → Secrets and variables → Actions → Variables**. Use somente dígitos,
incluindo `55`, DDD e número.

## Conteúdo

Os arquivos editáveis ficam em `src/data/`:

- `site.json`: dados institucionais e contato
- `services.json`: serviços e preços
- `products.json`: joias e disponibilidade
- `projects.json`: projetos autorizados para o portfólio
- `faqs.json`: perguntas frequentes

Consulte `docs/content-management.md` antes de publicar alterações.

## Documentação

- [Arquitetura](docs/architecture.md)
- [Gestão de conteúdo](docs/content-management.md)
- [Segurança da administração](docs/administration-security.md)
- [Publicação](docs/deployment.md)
- [Solução de problemas](docs/troubleshooting.md)
- [Checklist de lançamento](docs/release-checklist.md)
- [Decisões do produto](docs/product-decisions.md)
