# Diretrizes e Regras do Projeto: Gerador de Especificações Técnicas

Este documento define as regras e diretrizes que devem ser seguidas pelo assistente de IA durante o desenvolvimento deste projeto.

---

## 1. Diretrizes Gerais de Desenvolvimento
- **Idioma**: Toda a comunicação, código (comentários, documentação) e interface com o usuário deve ser em **Português (Brasil)**, exceto nomes de variáveis, classes, funções e arquivos em código que devem seguir o padrão da comunidade (em Inglês).
- **Integridade da Documentação**: Mantenha todos os comentários e docstrings existentes que não estejam relacionados com as alterações.
- **Links Clicáveis**: Sempre que mencionar arquivos ou símbolos de código no chat, crie links clicáveis no formato `[nome_do_arquivo](file:///caminho/absoluto/do/arquivo)`.
- **Limitação de Escopo (MUITO IMPORTANTE)**: O assistente de IA **não deve fazer nada além do que for expressamente pedido pelo usuário**. Não tome a iniciativa de adicionar novas features, arquivos ou fazer mudanças que não tenham sido explicitamente solicitadas.
- **Testes Automatizados e Simulações**: O assistente de IA **não deve executar testes automatizados ou simulações em navegador (como subagentes)** a menos que o usuário solicite isso expressamente no chat.

---

## 2. Design e Estética Visual (Front-end)
*Caso o projeto inclua uma interface web, as seguintes regras estéticas premium são obrigatórias:*
- **Estética Rica (Wow Factor)**: O design deve impressionar o usuário à primeira vista. Use práticas modernas como gradientes suaves, glassmorphism (efeito vidro), dark mode elegante, e sombras sutis.
- **Cores Harmoniosas**: Evite cores genéricas e puras (como red, blue, green puros). Use paletas baseadas em HSL refinado, cores pastéis modernas ou tons escuros/claros balanceados.
- **Tipografia**: Use fontes modernas via Google Fonts (ex: *Inter*, *Outfit*, *Roboto*, *Plus Jakarta Sans*) in vez das fontes padrão do navegador.
- **Interatividade e Micro-animações**: Adicione transições suaves em hover, focos e estados ativos para fazer a interface se sentir viva e dinâmica.
- **Componentes Customizados**: Personalize barras de rolagem, modais, tooltips, checkboxes e botões de input. Evite a aparência padrão do sistema operacional.
- **Design Responsivo**: A interface deve ser adaptável a diferentes tamanhos de tela (desktop, tablet, mobile).

---

## 3. Arquitetura e Estrutura do Código
- **Stack Tecnológica**: O projeto deve ser desenvolvido utilizando **React**, **Tailwind CSS** e **Supabase** para persistência e armazenamento dos registros do projeto.
- **Componentes Focados e Reutilizáveis**: Crie componentes modulares, cada um com uma única responsabilidade.
- **Sem Placeholders**: Não use placeholders ou códigos incompletos. Todo código escrito deve ser funcional.
- **Exportação de Especificações**: O sistema deve gerar especificações bem estruturadas em formato Markdown e/ou PDF, prontas para uso por desenvolvedores e equipes de produto.

---

## 4. Fluxo de Trabalho (Workflow)
1. **Planejamento**: Antes de grandes alterações, crie um plano de implementação em `implementation_plan.md` e aguarde a aprovação do usuário.
2. **Registro**: Sempre atualize o arquivo `historico.md` após concluir tarefas para manter o histórico de progresso transparente.
3. **Validação**: Testar e garantir o funcionamento correto de cada funcionalidade criada.
