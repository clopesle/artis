# Dependências operacionais da ARTÍS

Este documento descreve os serviços externos usados pelo site e pelo painel `/admin/`. O
site público continua sendo publicado pelo GitHub Pages, e o repositório
`clopesle/artis` continua sendo a fonte de verdade de todo o conteúdo.

## Visão geral

| Serviço                       | Para que serve                                                   | Dados que guarda                                        | Custo esperado                                            |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| GitHub                        | Repositório, histórico, autenticação dos editores e publicação   | Conteúdo, imagens e histórico de commits                | Plano gratuito é suficiente para este repositório público |
| GitHub Pages                  | Hospedagem do site e da interface `/admin/`                      | Arquivos estáticos publicados                           | Incluído para repositórios públicos                       |
| GitHub App                    | Login individual no painel e permissão para editar o repositório | Identidade/autorização; o segredo fica somente na ponte | Sem cobrança própria                                      |
| Cloudflare Workers            | Ponte privada entre o painel e as APIs do GitHub                 | Segredos do GitHub App e lógica de autorização          | Plano Free é suficiente para uso administrativo normal    |
| Cloudflare KV                 | Sessões temporárias e tokens de GitHub no servidor               | Sessões de até oito horas; nunca conteúdo do site       | Incluído no plano Free para o volume esperado             |
| Angel Piercings e My Piercing | Pesquisa de catálogo para importar rascunhos de joias            | Nenhum dado persistido fora do repositório              | Conforme os próprios fornecedores                         |
| WhatsApp                      | Destino da mensagem de pedido e atendimento                      | A conversa passa a seguir as políticas do WhatsApp      | Conforme a conta comercial utilizada                      |

## O que é obrigatório para o painel protegido

O GitHub Pages não executa código secreto no servidor. Por esse motivo, ele não pode
guardar o segredo de um GitHub App nem trocar um código de login por um token. A ponte
no Cloudflare é necessária apenas para essa parte privada:

```text
Navegador → GitHub Pages /admin/ → Cloudflare Worker → GitHub App/API → repositório
```

O navegador recebe uma identificação de sessão temporária. O token do GitHub e o segredo
do GitHub App ficam no Worker, nunca no JavaScript público, no `localStorage` ou no
repositório.

## GitHub

### O que é necessário

- O repositório público `clopesle/artis`.
- GitHub Pages configurado para **GitHub Actions**.
- A variável Actions `PUBLIC_WHATSAPP_NUMBER`, com somente dígitos.
- Uma conta GitHub por editora, com permissão `push` ou `admin` no repositório e 2FA.
- Um GitHub App instalado somente neste repositório.

### Como criar o GitHub App

Em **Settings → Developer settings → GitHub Apps → New GitHub App**, preencher:

| Campo                                   | Valor                                                       |
| --------------------------------------- | ----------------------------------------------------------- |
| Homepage URL                            | `https://clopesle.github.io/artis/`                         |
| Callback URL                            | `https://<subdomínio-cloudflare>.workers.dev/auth/callback` |
| Expire user authorization tokens        | Ativado                                                     |
| Repository permissions → Contents       | Read and write                                              |
| Repository permissions → Metadata       | Read-only                                                   |
| Where can this GitHub App be installed? | Only on this account                                        |
| Installation                            | Somente `clopesle/artis`                                    |

Depois de criar o App, guardar o **Client ID** e gerar um **Client secret**. O Client ID
é configuração pública do Worker. O Client secret é confidencial e só pode ser enviado
ao Worker como segredo criptografado; ele nunca deve ser commitado, salvo em Actions ou
enviado pelo chat.

### Uso cotidiano

1. Abrir `/artis/admin/`.
2. Selecionar **Entrar com GitHub**.
3. Autorizar o App na própria conta GitHub.
4. Editar o conteúdo e salvar; cada gravação cria um commit auditável em `main`.
5. Aguardar o workflow **Deploy GitHub Pages** ficar verde antes de conferir o site.

Para revogar uma editora, remova sua permissão no repositório. Para revogar toda a
integração, desinstale o GitHub App ou apague o segredo no Worker.

## Cloudflare Workers e KV

### O que é necessário

- Uma conta Cloudflare no plano **Free**.
- Um Worker chamado `artis-admin-bridge`.
- Um namespace KV ligado como `SESSIONS`.
- Dois segredos do Worker: `GITHUB_CLIENT_SECRET` e `STATE_SECRET`.

O namespace KV criado para esta instalação é `b56f9cc5554848158e769e5c38593b5c`. Ele
deve ser usado exclusivamente pela ponte administrativa.

### Custo e limites

No plano Free atual, Workers inclui 100.000 solicitações por dia e KV inclui 100.000
leituras e 1.000 gravações/exclusões por dia, além de 1 GB de armazenamento. O painel
faz poucas requisições: login, leitura e gravação durante a edição. Esse volume é muito
inferior aos limites em uso normal. Sem contratar o plano pago, ultrapassar um limite
faz a operação falhar; não há cobrança automática. Consulte sempre a página oficial de
preços antes de mudar de plano:
<https://developers.cloudflare.com/workers/platform/pricing/>.

O plano pago do Workers tem cobrança mínima mensal. Ele não é necessário para publicar o
site nem para o uso administrativo esperado.

### Configuração e publicação

1. Atualizar `admin-worker/wrangler.toml` com o ID do namespace, a URL final do Worker e
   o Client ID do GitHub App.
2. Cadastrar os dois segredos diretamente no Cloudflare com `wrangler secret put`.
3. Publicar com `npm run admin:deploy`.
4. Criar a variável Actions `PUBLIC_ADMIN_BRIDGE_URL` com a URL HTTPS do Worker.
5. Fazer uma nova publicação do Pages.

Opcionalmente, para publicação automática da ponte pelo GitHub Actions, criar os
segredos Actions `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`, e a variável
`ADMIN_BRIDGE_CONFIGURED=true`. O token deve ter apenas permissões para Workers e KV da
conta correta. Os segredos do GitHub App continuam somente no Cloudflare.

### Recuperação

- Sessão expirada: entrar novamente pelo GitHub.
- Suspeita de vazamento do GitHub App: gerar um novo Client secret, atualizar o segredo
  `GITHUB_CLIENT_SECRET` no Worker e revogar o anterior no GitHub.
- Suspeita de vazamento da sessão: trocar `STATE_SECRET`; todas as novas autorizações
  passam a usar o novo valor.
- Indisponibilidade do Worker: editar os JSONs diretamente pelo GitHub; o repositório e
  o Pages continuam independentes da ponte.

## Fornecedores de joias

Os URLs são cadastrados no painel e ficam em `admin/providers.json`. A ponte aceita
somente hosts HTTPS dos fornecedores já cadastrados e bloqueia redirecionamentos. A
pesquisa filtra resultados para as categorias `Ouro`, `Titânio ASTM`, `Aço 316L` e
`PVD`.

Uma importação sempre cria um rascunho não publicado, sem identidade do fornecedor e sem
preço. Revisar texto, imagem, material, medidas, disponibilidade e direitos de uso antes
de publicar.

## Informações que nunca devem ser expostas

- `GITHUB_CLIENT_SECRET`
- `STATE_SECRET`
- Tokens de acesso do GitHub
- Token da API do Cloudflare
- Custos, tabelas de preço ou acordos privados dos fornecedores

O arquivo `products.json` está em um repositório público. Mesmo que o site não mostre o
preço das joias, qualquer valor gravado nesse JSON é tecnicamente público. Use o campo
somente para valores que podem ser expostos ou mantenha-o como `null`.
