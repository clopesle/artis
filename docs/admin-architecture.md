# Administração da ARTÍS

## Objetivo

O painel `/admin/` oferece edição estruturada do conteúdo e das imagens da ARTÍS. O
GitHub continua sendo a única fonte de verdade: toda publicação cria um commit no
repositório `clopesle/artis`, aciona as validações existentes e só chega ao GitHub Pages
quando o workflow termina com sucesso.

## Limite de segurança do GitHub Pages

GitHub Pages entrega apenas arquivos estáticos. Ele não pode guardar com segurança o
segredo de um OAuth App nem um token de escrita do GitHub. Por isso, a autenticação e as
chamadas autenticadas passam por uma ponte mínima executada fora do Pages.

A ponte:

1. inicia o OAuth do GitHub;
2. troca o código usando o segredo armazenado no ambiente do servidor;
3. confirma que a pessoa autenticada tem permissão de escrita em `clopesle/artis`;
4. guarda o token do GitHub apenas no servidor;
5. entrega ao navegador uma sessão curta e revogável;
6. aceita operações somente nos caminhos de conteúdo e imagem permitidos.

Nenhum segredo ou token do GitHub entra no bundle público, na URL ou no `localStorage`.

## Componentes

```text
GitHub Pages /admin/
        │
        │ sessão curta
        ▼
Ponte OAuth e API
        │
        │ token do usuário no servidor
        ▼
GitHub Contents API
        │
        ▼
commits em main → validação → GitHub Pages
```

## Conteúdo administrável

| Área                    | Caminho no repositório     |
| ----------------------- | -------------------------- |
| Identidade e contato    | `src/data/site.json`       |
| Serviços e preços       | `src/data/services.json`   |
| Joias e preços internos | `src/data/products.json`   |
| Categorias              | `src/data/categories.json` |
| Portfólio               | `src/data/projects.json`   |
| Perguntas frequentes    | `src/data/faqs.json`       |
| Imagens                 | `src/assets/catalog/`      |
| Fornecedores            | `admin/providers.json`     |

Os fornecedores existem somente no contexto administrativo. Seus nomes e URLs não são
renderizados no site público.

## Importação de fornecedores

A ponte consulta apenas fornecedores registrados e tipos de integração conhecidos. Os
resultados são normalizados e filtrados para Ouro, Titânio ASTM, Aço 316L e PVD. Uma
joia encontrada nunca é publicada automaticamente:

1. a pessoa pesquisa o catálogo;
2. seleciona um resultado elegível;
3. revisa nome, descrição, categoria, material, opções e imagem;
4. importa a peça como rascunho com `published: false`;
5. revisa o rascunho no site antes de publicar.

O preço do fornecedor não é importado. O campo interno de preço começa como `null`,
evitando gravar custo comercial no repositório público.

## Concorrência e histórico

Cada leitura retorna o SHA atual do arquivo. A gravação envia o mesmo SHA para a API do
GitHub. Se outra pessoa publicar primeiro, a API recusa a gravação em vez de
sobrescrever o trabalho mais recente. O painel então solicita uma recarga.

Imagens e arquivos são gravados em sequência porque a API de conteúdo do GitHub pode
gerar conflitos em atualizações paralelas.
