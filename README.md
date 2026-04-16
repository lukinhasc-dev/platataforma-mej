<p align="center">
  <img src="front-end/assets/logo.png" alt="Logo Missão Evangélica Jaboque" width="180"/>
</p>

# 🕊️ Plataforma MEJ - Missão Evangélica Jaboque

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Produ%C3%A7%C3%A3o-success?style=for-the-badge" alt="Status de Produção">
  <img src="https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-orange?style=for-the-badge" alt="Licença">
</p>

---

## 📌 Visão Geral da Plataforma

A **Plataforma MEJ** é um sistema digital completo e inovador, desenvolvido para modernizar o acesso ao conhecimento dentro da comunidade religiosa. O projeto centraliza materiais essenciais (como estudos bíblicos, roteiros de culto, formulários e letras de louvores) em um único ambiente, acessível a todos os membros por meio de seus celulares ou computadores, a qualquer momento e com extrema velocidade.

Ao mesmo tempo que facilita para os usuários, a plataforma oferece um painel de liderança seguro para que as pessoas autorizadas gerenciem ativamente esses materiais e convidem novos líderes para ajudar a administrar o portal.

---

## 🎯 Propósito Social e Acadêmico

Muitas organizações sem fins lucrativos e congregações religiosas enfrentam barreiras grandes na sua organização interna. Arquivos ficam dispersos em computadores diferentes e a distribuição difícil de apostilas ou informativos de papel prejudica a inclusão e o controle. 

O grande objetivo deste projeto e desenvolvimento foi **solucionar essas dificuldades reais**, criando com a programação uma ponte social para organização. Esse projeto transforma aprendizados densos do ambiente acadêmico da **Faculdade Capital Federal – UniFECAF** em uma ferramenta comunitária de altíssima escala construída diretamente como o principal requisito prático para o currículo acadêmico e provando em cenário real as grandiosas capacidades técnicas.

---

## 🏛️ Entidade Atendida (MEJ)

O portal em sua concepção, sua paleta de cores institucional e interatividade amigável foram pensados especialmente para respeitar a personalidade da **Missão Evangélica Jaboque (Igreja e entidade sem fins lucrativos)**. Acessando tecnologias poderosas de mercado a igreja também marca sua autêntica presença sendo referenciada pelo novo domínio recém-adquirido de forma oficial: **`oficialmej.com.br`**.

---

## 💻 Arquitetura e Tecnologias Modernas

A aplicação não tem seus dados fixados em um "único saco cego" em qualquer computador, ela adota um modelo inteligente onde a visualização fica extremamente separada do "cérebro" das informações, conferindo velocidade à aplicação.

### 📱 O Palco Visível (Front-end)
Criado de maneira minuciosa para garantir carregamentos ágeis até mesmo em redes móveis de internet mais fracas dos congregados:
- **HTML, CSS e JavaScript**: Escolhidos em prol de leveza por estarem na sua sintaxe mais pura, descartando dependências super saturadas, elaborando interfaces de alta beleza sob um design contemporâneo de telas charmosas (*efeitos Glassmorphism* de vidro em transparência inteligente).

### ⚙️ Os Bastidores (Back-end)
O motor da regra do portal e onde as solicitações de dados ganham complexidade:
- **Node.js e Express**: É o trator por trás da operação de dados rápidos para a leitura e armazenamento. 
- **TypeScript**: Funciona como um rigoroso gerente de controle de qualidade, obrigando o sistema de desenvolvimento não aprovar construções duvidosas e evitando quebras ou "telas brancas" surpresas na experiência de centenas de usuários. 

### 🗄️ Dados e Nuvem (Supabase)
O banco de dados se ancora nos braços dos servidores do **PostgreSQL** pelo **Supabase**, salvando arquivos fisicamente protegidos na nuvem de modo a não se corromperem caso o computador central tenha avarias, os tornando seguros por anos.

---

## 🔒 Segurança de Informação e Feitos Diferenciais

Construir o portal online das interações não é só fazer aparecer a lista das apostilas. Proteger uma liderança corporativa é tão crucial quanto o site em si e as implementações atestam imenso nível profissional do software:

- **Proteção Avançada de Senhas Múltiplas**: Nenhum curioso tem acesso às senhas de líderes ao observar os metadados brutos do banco de dados salvos. Toda senha recém cadastrada sofre intensos processos matemáticos de "embaralhamento cego" pela tecnologia **Bcrypt**, camuflando sua chave central e inviabilizando hackers a descobrirem as verdadeiras credenciais, pois elas nunca ficam armazenadas e salvas limpas (*Plain Text*).

- **Sessões Fechadas para Liderança Autorizada**: Acessar o sistema administrativo não conta só com o campo Login, mas injetores nativos de controle chamados **JWT (JSON Web Tokens)** criam um "crachá digital assinado". Essa engrenagem invisível certifica permanentemente que o computador que logou é de fato lícito e no momento presente não permitindo burlas aos atalhos de URLs.

- **Protegendo o Tráfego do Falso Uso**: Componentes agressivos de rede (Como as ferramentas nativas **Helmet** e verificação originária **CORS**) validam de mãos estendidas as requisições que circulam entre o dispositivo da liderança até os servidores isolados na nuvem (*Web Handshakes*). Dispositivos piratas se passando maliciosamente pela aplicação ganham desclassificação imediata bloqueando sequestro nos bancos da MEJ.

- **Central de Comunicação de E-mails com Força da Identidade**: Um enorme passo acima dos recursos gratuitos padronizados, a Missão Jaboque acopla o robusto despachador **Resend**. Pelo cadastro validado nos complexos registros **DNS (Chaves SPF/DKIM/MX)** provou-se ao planeta corporativo que os donos da página são legítimos detentores do espaço virtual. Quando alguém se insere na equipe de liderança, convites e lembretes de recuperação caem confiavelmente em suas caixas sob o autêntico `contato@oficialmej.com.br`, abolindo bloqueios e falsas caixas de SPAM.

---

## 🚀 Locais Estáveis dos Motores em Deploy 

Um software profissional roda de forma espalhada estrategicamente pela nuvem sem necessidade de servidores caseiros nas dependências da igreja onde problemas comuns como "falta de energia na sede" o retirariam do ar:

- **Visual / Site**: Repousa na gigante **Vercel**.
- **Processos (Back-end)**: Fica orquestrado estavelmente contido na **Render**.
- **Armazenamento e Bancos de Tabelas (SGBD)**: Salvos no **Supabase** sob datacenters localizados externamente como a Amazon nos Estados Unidos (AWS).
