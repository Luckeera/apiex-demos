# APIEX 2026 — Soluções No-Code & Inteligência Artificial

> **Atividade Prática de Extensão (APIEX) — Universidade da Amazônia (Unama)**  
> **Tema:** Programação para o dia a dia com No-Code e Inteligência Artificial  
> **Hospedagem Web (Vercel):** *[Insira aqui a URL gerada na Vercel, ex: https://apiex-demos.vercel.app]*

---

## 📌 1. Apresentação do Projeto

Este repositório reúne os protótipos funcionais concebidos e desenvolvidos durante a realização da oficina de extensão universitária **APIEX 2026**. O objetivo central da iniciativa foi apresentar a estudantes do Ensino Fundamental e Médio como ferramentas *no-code* aliadas à Inteligência Artificial possibilitam a criação de soluções digitais práticas para problemas reais da sua rotina escolar e comunitária.

A tese fundamental trabalhada com os alunos foi: **a programação não começa pela sintaxe de uma linguagem, mas pela observação de um problema real, pela organização de dados, definição de regras lógicas e testes práticos.**

---

## 🎯 2. Metodologia e Mentoria

A proposta realizada para os estudantes foi dividida em cinco etapas orientadas ao pensamento computacional:

```
[ 1. Problema ] ➔ [ 2. Dados ] ➔ [ 3. Regras ] ➔ [ 4. Telas ] ➔ [ 5. Teste ]
```

1. **Problema:** Mapeamento de dores reais vividas nos cenários escolar, de lazer, esportivo ou de rotina de estudos.
2. **Dados:** Identificação de quais informações essenciais precisam ser guardadas e processadas (títulos, datas, categorias, pontuações).
3. **Regras:** Definição da lógica condicional de negócio (ex.: *"se faltam menos de 48h, emitir alerta visual"*; *"se o time A marcou mais gols, avance o time A e bloqueie empates"*).
4. **Telas:** Construção e prototipagem da interface em plataformas visuais (*no-code*) através de linguagem natural estruturada e blocos lógicos.
5. **Teste:** Validação em múltiplos dispositivos e ajuste fino com feedback de colegas.

**Papel da Equipe de Mentoria:**  
Durante a atividade, os estudantes receberam auxílio direto dos integrantes da equipe universitária para estruturar suas ideias, tirar dúvidas sobre viabilidade técnica, refinar a redação de comandos (prompts) e implementar boas práticas de privacidade e segurança.

---

## 🚀 3. As Demonstrações Desenvolvidas

Dentre as propostas criadas pelos alunos, três projetos destacaram-se pelo impacto, coerência lógica e qualidade da solução entregue:

### 📅 Demo 1: Mural de Estudos — "Foco na Semana"
* **Acesso:** [`/mural-estudos/`](./mural-estudos/)
* **Dor Real:** Prazos de tarefas, trabalhos e provas dispersos em conversas de grupos de mensagens (WhatsApp), resultando em atrasos, esquecimentos e sobrecarga mental.
* **Solução Entregue:** Aplicação web interativa para centralizar a rotina acadêmica. Permite cadastrar tarefas com título, disciplina, data de entrega e nível de prioridade (alta, média e baixa).
* **Lógica Computacional & Destaques:**
  - Regra condicional automática: destaca em cor de alerta (coral) qualquer tarefa que vença nas próximas 48 horas.
  - Filtros dinâmicos por matéria e alternância entre pendentes e concluídas.
  - Calendário mensal integrado.
  - Privacidade por design: dados mantidos 100% no navegador via `localStorage`, sem coleta de dados pessoais sensíveis.

---

### ⚽ Demo 2: Copa da Escola — "Copa Integração"
* **Acesso:** [`/copa-escola/`](./copa-escola/)
* **Dor Real:** Desorganização em torneios esportivos escolares e interclasses, onde tabelas em papel rasuravam com facilidade e geravam desinformação sobre horários, adversários e critérios de classificação.
* **Solução Entregue:** Landing page esportiva responsiva contendo avisos gerais, regulamento da competição, calendário de partidas e um módulo de chaveamento eliminatório dinâmico.
* **Lógica Computacional & Destaques:**
  - Sistema de mata-mata estruturado (Quartas de Final → Semifinais → Grande Final → Campeão).
  - Lógica condicional estrita: bloqueia empates (exigindo definição por pênaltis conforme regulamento) e avança automaticamente a equipe vencedora para a chave da fase seguinte.
  - Interface adaptada para navegação rápida em dispositivos móveis (*Mobile First*).

---

### 🧠 Demo 3: Mapa Mental Visual Interativo (Revolução Industrial)
* **Acesso:** [`/mapa-mental/`](./mapa-mental/)
* **Dor Real:** Dificuldade em organizar, sintetizar e relacionar causas econômicas, inovações técnicas e consequências sociais de conteúdos densos antes de avaliações de História.
* **Solução Entregue:** Painel conceitual interativo dividindo a Revolução Industrial inglesa em 4 eixos estruturantes (*Causas*, *Inovações Técnicas*, *Impactos Sociais* e *Consequências Globais*).
* **Lógica Computacional & Destaques:**
  - Inspetor lateral interativo que detalha relações de causa e efeito ao clicar em cada nó do mapa.
  - Aplicação prática de Engenharia de Prompt: documentação de como orientar ferramentas generativas visuais especificando estilo (recorte de papel), paleta e a restrição fundamental de *"sem texto"* para evitar alucinações de letras ilegíveis pela IA.

---

## 📊 4. Análise Crítica dos Resultados

Após o desenvolvimento das soluções, a equipe realizou uma análise conjunta detalhada, avaliando:
- A correspondência entre os requisitos levantados pelos alunos e as funções efetivamente implementadas;
- A clareza e acessibilidade da interface para outros colegas estudantes;
- O respeito às diretrizes de privacidade e uso ético da inteligência artificial.

Esse processo evidenciou, na prática, que o uso de ferramentas *no-code* acelera a materialização de ideias, mas o sucesso do resultado depende diretamente do rigor no planejamento prévio de dados e regras lógicas.

---

## 💻 5. Como Executar o Projeto Localmente

O projeto foi construído com tecnologias web padrão (HTML5, CSS3 e JavaScript Vanilla), não exigindo compilação ou instalação de dependências pesadas.

### Opção 1: Via Servidor HTTP Local (Recomendado)
Com o Python instalado, execute no terminal dentro da pasta do projeto:

```bash
python -m http.server 3000
```

Em seguida, abra o navegador em: [http://localhost:3000](http://localhost:3000)

### Opção 2: Abertura Direta
Dê dois cliques no arquivo `index.html` da raiz do repositório para abrir o portal no seu navegador de preferência.

---

## ☁️ 6. Deploy na Vercel

O projeto está totalmente preparado para implantação estática contínua na Vercel:
1. Conecte este repositório no dashboard da [Vercel](https://vercel.com).
2. O arquivo `vercel.json` incluso na raiz já configura as rotas e URLs limpas automaticamente.
3. Não é necessário configurar comandos de build ou pastas de saída (`Output Directory: .`).

---

## 📁 7. Estrutura do Repositório

```text
apiex-demos/
├── index.html                 # Portal/Hub unificado com apresentação do projeto
├── styles.css                 # Folha de estilo do Hub principal
├── global-nav.css             # Barra de navegação unificada presente em todas as páginas
├── vercel.json                # Configuração de rotas para a Vercel
├── .gitignore                 # Arquivos ignorados pelo Git
├── README.md                  # Documentação acadêmica completa
│
├── mural-estudos/             # Demo 1: Aplicação de Gestão de Prazos Escolares
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── copa-escola/               # Demo 2: Aplicação do Campeonato Interclasses
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── mapa-mental/               # Demo 3: Mapa Mental e Engenharia de Prompt
    ├── index.html
    └── styles.css
```
