
# Coffee Platform Charts

Este é um projeto Next.js que permite aos usuários buscar informações sobre artistas e ver dados de streaming, incluindo top tracks e álbuns nas plataformas Spotify e Last.fm.

## Funcionalidades

### Estatísticas de Artista:
- **Busca de Artistas**: Busque informações sobre qualquer artista.
- **Dados de Streaming**: Veja informações sobre o artista, como número de seguidores, popularidade, e ouvintes mensais.
- **Top Tracks**: Visualize as 10 músicas mais populares do artista.
- **Top Álbuns**: Visualize os 10 álbuns mais populares do artista (apenas para Last.fm).
- **Biografia do Artista**: Veja a biografia do artista (apenas para Last.fm).

### Estatísticas Pessoais:
- **Login no Spotify**: Conecte-se a sua conta do Spotify.
- **Dados de Streaming**: Verifique quais as suas músicas mais ouvidas, nos seguintes intervalos de tempo:
  - Última semana;
  - Último mês;
  - último ano;
  - Todos os tempos.

## Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para criar interfaces de usuário.
- **Next.js**: Framework React para renderização no lado do servidor e geração de sites estáticos.
- **Tailwind CSS**: Framework de CSS utilitário para criar layouts rápidos e responsivos.
- **Spotify Web API**: API utilizada para buscar dados sobre os artistas e suas músicas.
- **Last.fm API**: API utilizada para buscar dados sobre os artistas, músicas, álbuns e biografias.

## Instalação

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/oHenryy/coffee-platform-charts.git
    cd coffee-platform-charts
    ```

2. **Instale as dependências**:
    ```bash
    npm install
    ```

3. **Configuração das chaves de API**:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione suas chaves de API no arquivo `.env.local`:
    ```
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    LASTFM_API_KEY=your_lastfm_api_key
    LASTFM_API_SECRET=your_lastfm_api_secret
    ```

4. **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

5. **Abra o navegador e acesse**:
    ```
    http://localhost:3000
    ```

## Como Usar

1. **Buscar um Artista**: Digite o nome de um artista na barra de pesquisa e pressione `Enter` ou clique em "Buscar".
2. **Selecionar uma Plataforma**: Clique na aba "Spotify" ou "Last.fm" para visualizar os dados da respectiva plataforma.
3. **Ver Informações e Top Músicas/Álbuns**: Navegue entre as abas de "Informações", "Top Tracks" e "Top Álbuns" para ver os dados detalhados.

## Estrutura do Projeto

O projeto está organizado da seguinte maneira:

- **app**: 
  - **api**:
    - **getArtistData**: Endpoint para obter dados básicos do artista do Spotify.
      - `route.ts`: Código relacionado à obtenção dos dados do artista.
    - **getLastFmData**: Endpoint para obter dados do Last.fm como biografia, top tracks, e top álbuns.
      - `route.ts`: Código para recuperar dados do Last.fm e realizar o fallback para as imagens do Spotify.
    - **getTopTracks**: Endpoint para obter as músicas mais populares do artista no Spotify.
      - `route.ts`: Código responsável por buscar e retornar as top tracks do artista no Spotify.
  - **favicon.ico**: Ícone do site.
  - **globals.css**: Estilos globais do projeto.
  - **layout.tsx**: Layout principal do projeto.
  - **page.tsx**: Página principal onde a interface do usuário é renderizada.
- **node_modules**: Dependências do projeto.
- **public**: Arquivos públicos como imagens e ícones.
- **.env.local**: Arquivo contendo variáveis de ambiente, como as chaves de API (não deve ser versionado).
- **.eslintrc.json**: Configurações do ESLint para padronização de código.
- **.gitignore**: Arquivos e diretórios que devem ser ignorados pelo Git.
- **next-env.d.ts**: Declarações de tipos do Next.js.
- **next.config.mjs**: Configurações do Next.js.
- **package.json**: Arquivo de configuração do NPM que define as dependências do projeto.
- **package-lock.json**: Arquivo que bloqueia as versões das dependências instaladas.
- **postcss.config.js**: Configurações do PostCSS.
- **README.md**: Documentação do projeto.
- **tailwind.config.ts**: Configurações do Tailwind CSS.
- **tsconfig.json**: Configurações do TypeScript.

## Melhorias Futuras

- **Suporte a outras plataformas de streaming**: Adicionar suporte a plataformas como Apple Music, YouTube Music, etc.
- **Histórico de rankings**: Permitir visualizar a evolução dos rankings das músicas e álbuns ao longo do tempo.
- **Exportação de Dados**: Implementar a opção para exportar os dados como planilha (CSV, Excel).
