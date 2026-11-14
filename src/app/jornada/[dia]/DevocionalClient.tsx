"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDevotionalNumber, getLocalDateKey, isDateKey } from "@/lib/devotional-dates";

const devocionais = [
  {
    titulo: "Começar com Deus",
    referencia: "Salmos 63:1",
    introducao: "Toda caminhada começa com uma decisão: separar um momento para estar com Deus.",
    reflexao: "Muitas vezes esperamos a rotina ficar tranquila para nos aproximarmos de Deus. Mas a caminhada com Ele pode começar exatamente onde estamos, com nossas preocupações, dúvidas e limitações.\n\nEm Salmos 63, encontramos uma expressão profunda de sede pela presença de Deus. Buscar a Deus não é apenas cumprir uma obrigação religiosa, mas cultivar um relacionamento verdadeiro.\n\nVocê não precisa começar com uma hora por dia. Comece com alguns minutos de sinceridade. O importante não é impressionar ninguém, mas desenvolver uma relação com Deus.",
    pratica: "Separe cinco minutos em um lugar tranquilo. Leia o Salmo 63 e converse com Deus com suas próprias palavras.",
    pergunta: "O que tem ocupado tanto espaço na sua rotina que você acaba deixando seu momento com Deus para depois?",
    oracao: "Senhor, quero aprender a estar mais perto de Ti. Ajuda-me a encontrar tempo para cultivar nossa relação, mesmo em meio à correria. Que minha busca seja sincera. Amém."
  },
  {
    titulo: "Você pode recomeçar",
    referencia: "Lamentações 3:22–23",
    introducao: "Seu passado não precisa definir o próximo capítulo da sua caminhada.",
    reflexao: "Existem dias em que olhamos para trás e lembramos das vezes em que falhamos. Talvez você tenha começado outras vezes uma rotina com Deus e não conseguiu continuar.\n\nO livro de Lamentações fala sobre a fidelidade e a misericórdia de Deus em meio a um cenário de sofrimento. A esperança não nasce porque tudo está perfeito, mas porque a misericórdia de Deus não se esgota.\n\nRecomeçar não significa fingir que nada aconteceu. Significa reconhecer que hoje existe uma nova oportunidade para dar um passo em direção a Deus.",
    pratica: "Não tente recuperar todos os dias que passaram. Separe alguns minutos hoje e recomece de onde você está.",
    pergunta: "Existe alguma frustração do passado que está dificultando seu recomeço?",
    oracao: "Deus, obrigado porque tua misericórdia se renova. Ajuda-me a não viver preso aos meus erros e a encontrar coragem para recomeçar contigo. Amém."
  },
  {
    titulo: "Deus conhece seu coração",
    referencia: "Salmos 139:1–4",
    introducao: "Você não precisa esconder de Deus aquilo que realmente sente.",
    reflexao: "Às vezes, temos dificuldade de falar sobre o que acontece dentro de nós. Tentamos parecer fortes, organizados e tranquilos, mesmo quando estamos enfrentando conflitos.\n\nO Salmo 139 apresenta um Deus que conhece profundamente a vida humana. Ele conhece nossos pensamentos, caminhos e palavras. Isso não deve ser motivo para fugir, mas para encontrar segurança.\n\nNa oração, você não precisa usar palavras bonitas. Pode falar sobre seus medos, dúvidas, alegrias e dificuldades. Deus conhece seu coração antes mesmo de você conseguir explicar o que sente.",
    pratica: "Faça uma oração sincera hoje. Conte a Deus o que realmente está acontecendo dentro de você.",
    pergunta: "Qual sentimento você tem dificuldade de expressar até mesmo em suas orações?",
    oracao: "Senhor, tu conheces meu coração. Ensina-me a ser sincero diante de Ti e a encontrar descanso na tua presença. Amém."
  },
  {
    titulo: "Aproximar-se de Deus",
    referencia: "Tiago 4:8",
    introducao: "Uma relação se fortalece quando existe aproximação e intenção.",
    reflexao: "Relacionamentos não se desenvolvem apenas com boas intenções. Eles precisam de presença, atenção e tempo. Nossa relação com Deus também envolve uma decisão diária de buscá-lo.\n\nTiago 4 nos chama a nos aproximarmos de Deus. Esse convite nos lembra que a fé não precisa ficar restrita a momentos especiais ou ambientes religiosos.\n\nVocê pode buscar a Deus em sua rotina, em suas decisões e até nos momentos mais simples do dia. A constância nasce de pequenos passos repetidos com sinceridade.",
    pratica: "Escolha um horário possível para seu momento com Deus e tente protegê-lo hoje.",
    pergunta: "O que poderia mudar na sua rotina para facilitar sua aproximação com Deus?",
    oracao: "Pai, quero me aproximar de Ti não apenas quando preciso de alguma coisa, mas porque desejo conhecer-te melhor. Ajuda-me a desenvolver essa comunhão. Amém."
  },
  {
    titulo: "Aprender a entregar",
    referencia: "1 Pedro 5:7",
    introducao: "Nem tudo precisa ser carregado sozinho.",
    reflexao: "A preocupação pode ocupar tanto espaço em nossa mente que começamos a viver como se tudo dependesse exclusivamente de nós.\n\nEm 1 Pedro 5:7, encontramos o convite para lançar sobre Deus nossas ansiedades, porque Ele cuida de nós. Isso não significa ignorar responsabilidades, mas reconhecer que não precisamos enfrentar tudo sozinhos.\n\nEntregar uma preocupação a Deus pode ser um exercício diário. Algumas situações não mudam imediatamente, mas nossa maneira de enfrentá-las pode começar a mudar.",
    pratica: "Escreva uma preocupação que está pesando em você. Ore sobre ela e identifique também um passo responsável que pode dar.",
    pergunta: "Qual preocupação você precisa aprender a entregar a Deus?",
    oracao: "Senhor, existem coisas que pesam em meu coração. Ajuda-me a confiar no teu cuidado e a fazer minha parte sem carregar sozinho aquilo que não posso controlar. Amém."
  },
  {
    titulo: "O valor do silêncio",
    referencia: "Salmos 46:10",
    introducao: "Em meio a tanto barulho, precisamos aprender a parar.",
    reflexao: "Vivemos cercados por notificações, compromissos, conversas e preocupações. Mesmo quando estamos parados, nossa mente continua acelerada.\n\nO Salmo 46 apresenta um convite à quietude e ao reconhecimento de Deus. O silêncio não é uma fórmula mágica para resolver problemas. É uma oportunidade de diminuir as distrações e voltar nossa atenção para aquele em quem confiamos.\n\nTalvez você não consiga controlar tudo o que acontece ao seu redor, mas pode começar reservando alguns minutos para respirar, ler a Palavra e estar diante de Deus.",
    pratica: "Fique cinco minutos sem celular ou outras distrações. Leia o Salmo 46 com calma.",
    pergunta: "Quais distrações mais dificultam sua concentração durante seu momento com Deus?",
    oracao: "Deus, acalma meu coração. Ensina-me a diminuir o barulho ao meu redor e a reconhecer tua presença mesmo nos dias agitados. Amém."
  },
  {
    titulo: "Descansar em Deus",
    referencia: "Mateus 11:28–30",
    introducao: "Você não foi chamado para viver permanentemente sobrecarregado.",
    reflexao: "Muitas pessoas continuam funcionando mesmo quando estão emocionalmente cansadas. Cumprem compromissos, resolvem problemas e seguem em frente, mas quase nunca encontram espaço para descansar.\n\nEm Mateus 11, Jesus convida os cansados e sobrecarregados a encontrarem descanso nele. Esse convite revela cuidado e acolhimento.\n\nDescansar em Deus não significa abandonar suas responsabilidades. Significa reconhecer seus limites e aprender a caminhar com a confiança de que você não está sozinho.",
    pratica: "Identifique algo que está sobrecarregando sua rotina e pense em uma maneira saudável de reorganizá-la.",
    pergunta: "O que mais tem cansado você nesta fase da vida?",
    oracao: "Jesus, meu coração precisa de descanso. Ensina-me a confiar em Ti, respeitar meus limites e encontrar equilíbrio na caminhada. Amém."
  },
  {
    titulo: "Quando a ansiedade aparece",
    referencia: "Filipenses 4:6–7",
    introducao: "A preocupação pode chegar, mas não precisa conduzir todas as suas decisões.",
    reflexao: "A ansiedade muitas vezes nos leva a viver antecipadamente situações que ainda nem aconteceram. Pensamos em possibilidades, imaginamos resultados e tentamos encontrar garantias para tudo.\n\nEm Filipenses 4, Paulo orienta os cristãos a apresentarem suas preocupações a Deus em oração e súplica, com gratidão. Ele aponta para a paz de Deus como proteção para o coração e a mente.\n\nOrar não significa negar emoções ou dispensar ajuda quando precisamos dela. Significa incluir Deus em nossas preocupações e aprender a enfrentar cada situação com fé e responsabilidade.",
    pratica: "Escreva três preocupações e transforme cada uma delas em um motivo de oração.",
    pergunta: "Qual situação futura tem ocupado excessivamente seus pensamentos?",
    oracao: "Pai, conhece minhas preocupações. Ajuda-me a apresentar tudo a Ti e a caminhar com serenidade, sabedoria e confiança. Amém."
  },
  {
    titulo: "Não tenha medo",
    referencia: "Isaías 41:10",
    introducao: "Coragem não é ausência de medo, mas aprender a confiar em meio a ele.",
    reflexao: "Existem momentos em que o futuro parece incerto. Uma decisão difícil, uma mudança ou um problema podem despertar insegurança.\n\nEm Isaías 41, Deus oferece palavras de fortalecimento ao seu povo em um contexto de fragilidade e ameaça. A promessa aponta para a presença e o sustento de Deus.\n\nA fé não exige que você finja não sentir medo. Ela convida você a não permitir que o medo seja a única voz orientando seus passos.",
    pratica: "Identifique uma situação que provoca medo e pense em uma atitude prudente que pode tomar hoje.",
    pergunta: "Que medo tem impedido você de dar um passo importante?",
    oracao: "Senhor, fortalece meu coração nos momentos de insegurança. Ajuda-me a confiar na tua presença e agir com sabedoria. Amém."
  },
  {
    titulo: "Confiar mesmo sem entender",
    referencia: "Provérbios 3:5–6",
    introducao: "Nem sempre teremos todas as respostas antes de dar o próximo passo.",
    reflexao: "Gostamos de entender cada detalhe antes de tomar uma decisão. Queremos saber como tudo vai terminar e ter certeza de que não haverá dificuldades.\n\nProvérbios 3 nos orienta a confiar no Senhor de todo o coração e a reconhecê-lo em nossos caminhos. O texto não incentiva decisões impulsivas, mas uma vida que considera Deus como referência.\n\nConfiar também envolve buscar sabedoria, avaliar consequências e reconhecer que nosso entendimento é limitado.",
    pratica: "Leve a Deus uma decisão que está diante de você. Depois, avalie com calma quais passos responsáveis precisa tomar.",
    pergunta: "Em qual área da sua vida você sente mais dificuldade de confiar?",
    oracao: "Deus, ajuda-me a confiar em Ti sem deixar de buscar sabedoria. Guia meus passos e corrige meus caminhos quando necessário. Amém."
  },
  {
    titulo: "Aprender a esperar",
    referencia: "Salmos 27:14",
    introducao: "Esperar também faz parte da caminhada de fé.",
    reflexao: "Esperar pode ser difícil, principalmente quando desejamos respostas imediatas. A demora pode gerar frustração, comparação e desânimo.\n\nO Salmo 27 associa a espera no Senhor à coragem e ao fortalecimento do coração. A espera bíblica não é necessariamente passividade: é continuar confiando enquanto fazemos aquilo que está ao nosso alcance.\n\nNem todo processo acontece no ritmo que desejamos. Aprender a esperar também é aprender a não abandonar a fé nos períodos de incerteza.",
    pratica: "Escolha uma situação em que você está esperando uma resposta e ore por paciência e discernimento.",
    pergunta: "Como você costuma reagir quando as coisas não acontecem no tempo que gostaria?",
    oracao: "Senhor, fortalece meu coração enquanto espero. Dá-me paciência para respeitar os processos e sabedoria para continuar caminhando. Amém."
  },
  {
    titulo: "A fé em tempos difíceis",
    referencia: "Hebreus 11:1",
    introducao: "A fé também é exercitada quando as circunstâncias não são fáceis.",
    reflexao: "É simples falar sobre confiança quando tudo está acontecendo como planejamos. O desafio aparece quando surgem perdas, dificuldades e perguntas sem respostas.\n\nHebreus 11 apresenta a fé como confiança naquilo que se espera e convicção a respeito do que não se vê. O capítulo relembra pessoas que caminharam confiando em Deus em diferentes circunstâncias.\n\nFé não significa que nunca teremos dúvidas ou sofrimento. Significa continuar buscando a Deus mesmo quando não conseguimos enxergar todo o caminho.",
    pratica: "Leia Hebreus 11 e observe uma das histórias de fé mencionadas no capítulo.",
    pergunta: "O que costuma abalar sua confiança em Deus nos momentos difíceis?",
    oracao: "Pai, fortalece minha fé nos dias difíceis. Ajuda-me a continuar buscando tua presença mesmo quando não compreendo tudo. Amém."
  },
  {
    titulo: "Deus é seu refúgio",
    referencia: "Salmos 46:1",
    introducao: "Em tempos de instabilidade, podemos buscar segurança em Deus.",
    reflexao: "Nem sempre conseguimos encontrar segurança nas circunstâncias. Planos mudam, pessoas falham e situações inesperadas acontecem.\n\nO Salmo 46 apresenta Deus como refúgio e fortaleza, socorro presente na angústia. Essa imagem transmite proteção e confiança em meio à instabilidade.\n\nBuscar refúgio em Deus não elimina a necessidade de enfrentar problemas. Mas nos lembra que não precisamos enfrentá-los sem esperança, oração e direção.",
    pratica: "Leia o Salmo 46 inteiro e anote uma frase que fortaleça sua confiança.",
    pergunta: "Onde você costuma procurar segurança quando tudo parece incerto?",
    oracao: "Deus, sê meu refúgio nos dias difíceis. Ajuda-me a encontrar em Ti força, esperança e direção. Amém."
  },
  {
    titulo: "Um coração confiante",
    referencia: "Salmos 37:5",
    introducao: "Confiar em Deus também significa entregar a Ele nossos caminhos.",
    reflexao: "Muitas vezes tentamos controlar resultados, pessoas e situações. Quando algo foge do nosso planejamento, sentimos que perdemos o chão.\n\nO Salmo 37 orienta o leitor a entregar seu caminho ao Senhor e confiar nele. O contexto também fala sobre não se deixar consumir pela comparação com aqueles que parecem prosperar fazendo o mal.\n\nUm coração confiante não é um coração sem planos. É um coração que planeja, trabalha e toma decisões sem transformar o controle em sua maior segurança.",
    pratica: "Escolha uma área da sua vida que você tenta controlar excessivamente e converse com Deus sobre ela.",
    pergunta: "O que é mais difícil para você entregar a Deus?",
    oracao: "Senhor, ajuda-me a confiar meus caminhos a Ti. Ensina-me a fazer minha parte e descansar no teu cuidado. Amém."
  },
  {
    titulo: "Sua identidade em Deus",
    referencia: "Efésios 2:10",
    introducao: "Seu valor não precisa depender apenas do que você conquista.",
    reflexao: "É fácil medir nosso valor pelo desempenho, pela aparência, pelo dinheiro ou pela aprovação das pessoas. Quando falhamos, podemos começar a acreditar que somos definidos por nossos erros.\n\nEfésios 2 apresenta a salvação como resultado da graça de Deus e, em seguida, descreve os cristãos como criação de Deus, chamados para viver em boas obras.\n\nSua identidade não precisa ser construída apenas a partir das expectativas dos outros. A graça nos lembra que nossa relação com Deus começa em seu amor, não em uma tentativa de provar nosso valor.",
    pratica: "Anote três características que você deseja desenvolver em sua caminhada com Deus.",
    pergunta: "Em quais situações você costuma medir seu valor pela opinião de outras pessoas?",
    oracao: "Pai, ajuda-me a compreender minha identidade diante de Ti. Que minhas escolhas sejam guiadas pela tua graça e não pela necessidade de aprovação. Amém."
  },
  {
    titulo: "O poder do perdão",
    referencia: "Colossenses 3:13",
    introducao: "Perdoar é um caminho que exige verdade, graça e maturidade.",
    reflexao: "Algumas feridas permanecem conosco por muito tempo. Lembrar do que aconteceu pode despertar tristeza, raiva e ressentimento.\n\nColossenses 3:13 orienta os cristãos a suportarem uns aos outros e perdoarem, assim como foram perdoados por Cristo. O perdão faz parte da vida de quem recebeu graça.\n\nPerdoar não significa dizer que a injustiça foi correta, esquecer imediatamente ou permitir que alguém continue fazendo mal. Em situações de abuso ou perigo, limites e proteção são necessários. O perdão pode ser um processo.",
    pratica: "Ore sobre uma mágoa que você carrega. Se necessário, procure apoio seguro para lidar com essa situação.",
    pergunta: "Existe alguma mágoa que ainda influencia suas atitudes hoje?",
    oracao: "Senhor, ensina-me a compreender a graça que recebi e a caminhar em direção ao perdão. Dá-me sabedoria para estabelecer limites saudáveis. Amém."
  },
  {
    titulo: "Um coração agradecido",
    referencia: "1 Tessalonicenses 5:18",
    introducao: "A gratidão nos ajuda a perceber o que muitas vezes passa despercebido.",
    reflexao: "Quando enfrentamos dificuldades, nossa atenção pode ficar concentrada apenas no que falta. Aos poucos, deixamos de perceber pequenas demonstrações de cuidado e coisas boas que ainda fazem parte da vida.\n\nEm 1 Tessalonicenses 5, Paulo orienta a comunidade a cultivar a gratidão em todas as circunstâncias. Isso não significa agradecer pelo sofrimento como se ele fosse bom, mas manter uma postura de reconhecimento diante de Deus mesmo em dias difíceis.\n\nA gratidão não apaga os problemas. Ela amplia nossa percepção e nos ajuda a não enxergar a vida apenas pelas dificuldades.",
    pratica: "Escreva três coisas pelas quais você é grato hoje, mesmo que sejam simples.",
    pergunta: "Qual bênção cotidiana você costuma deixar de perceber?",
    oracao: "Deus, obrigado pelas pequenas e grandes demonstrações de cuidado. Ensina-me a cultivar um coração agradecido em todas as fases da vida. Amém."
  },
  {
    titulo: "Descobrindo seu propósito",
    referencia: "Romanos 12:2",
    introducao: "Uma vida com propósito começa também pela transformação da maneira de pensar.",
    reflexao: "Muitas pessoas imaginam que propósito significa descobrir uma única grande missão. Mas a vida com Deus também se revela nas decisões comuns, nos relacionamentos e na maneira como tratamos as pessoas.\n\nRomanos 12 convida os cristãos a não se conformarem com os padrões deste mundo, mas a serem transformados pela renovação da mente. O capítulo apresenta uma vida de fé que se expressa em atitudes concretas.\n\nEm vez de buscar respostas instantâneas sobre todo o futuro, comece perguntando como pode viver com fidelidade e amor hoje.",
    pratica: "Escolha uma atitude concreta que represente os valores cristãos em sua rotina hoje.",
    pergunta: "Que tipo de pessoa você deseja se tornar ao longo da sua caminhada com Deus?",
    oracao: "Pai, transforma minha maneira de pensar e ajuda-me a viver com propósito nas pequenas e grandes decisões. Amém."
  },
  {
    titulo: "Aprender a amar",
    referencia: "1 Coríntios 13:4–7",
    introducao: "O amor verdadeiro aparece nas atitudes, não apenas nas palavras.",
    reflexao: "É fácil falar sobre amor quando tudo está bem. O desafio aparece nas diferenças, nos conflitos e nos momentos em que precisamos abrir mão do orgulho.\n\nEm 1 Coríntios 13, Paulo descreve o amor em uma comunidade que enfrentava conflitos e disputas. O texto apresenta paciência, bondade e humildade como marcas de uma vida orientada pelo amor.\n\nAmar não significa aceitar qualquer comportamento ou abandonar limites. Significa tratar o outro com dignidade, buscar o bem e agir com responsabilidade.",
    pratica: "Demonstre cuidado por alguém hoje por meio de uma atitude simples e sincera.",
    pergunta: "Em qual relacionamento você precisa praticar mais paciência e bondade?",
    oracao: "Senhor, ensina-me a amar com atitudes. Ajuda-me a agir com paciência, humildade e respeito em meus relacionamentos. Amém."
  },
  {
    titulo: "A força da oração",
    referencia: "Jeremias 33:3",
    introducao: "Orar é abrir espaço para conversar com Deus e buscar sua direção.",
    reflexao: "Às vezes, tratamos a oração como último recurso, procurando Deus somente quando todas as outras alternativas falham.\n\nEm Jeremias 33, o profeta recebe uma palavra de Deus em um contexto de crise para Judá. O convite à oração está ligado à revelação e à ação de Deus naquele cenário específico.\n\nNossa oração não é uma maneira de controlar Deus ou garantir que tudo acontecerá como queremos. É uma prática de relacionamento, dependência e busca por direção.",
    pratica: "Reserve alguns minutos para orar por três áreas: sua vida, sua família e alguém que precisa de apoio.",
    pergunta: "O que faz você deixar a oração para depois?",
    oracao: "Deus, quero desenvolver uma vida de oração sincera. Ensina-me a conversar contigo em todas as fases da minha caminhada. Amém."
  },
  {
    titulo: "Permanecer em Deus",
    referencia: "João 15:4–5",
    introducao: "A vida espiritual não se sustenta apenas em momentos isolados.",
    reflexao: "Uma árvore não produz frutos porque recebeu água uma única vez. Ela precisa permanecer ligada às condições que sustentam sua vida.\n\nEm João 15, Jesus utiliza a imagem da videira e dos ramos para ensinar sobre a necessidade de permanecer nele. A vida e os frutos dos discípulos dependem dessa relação.\n\nPermanecer em Cristo envolve mais do que uma experiência emocional. É desenvolver uma caminhada contínua de fé, obediência, amor e dependência.",
    pratica: "Escolha um pequeno hábito que ajude você a manter sua atenção em Deus ao longo do dia.",
    pergunta: "O que costuma afastar sua atenção de Deus durante a semana?",
    oracao: "Jesus, quero permanecer em Ti. Ensina-me a cultivar uma relação constante e a produzir frutos que expressem teu amor. Amém."
  },
  {
    titulo: "Desenvolver disciplina",
    referencia: "1 Coríntios 9:24–25",
    introducao: "A constância é construída por decisões pequenas e repetidas.",
    reflexao: "Muitas vezes começamos uma atividade com entusiasmo, mas perdemos o ritmo quando a novidade passa. Isso acontece também com hábitos espirituais.\n\nEm 1 Coríntios 9, Paulo utiliza a imagem de atletas que treinam com disciplina para falar sobre o compromisso da vida cristã. A comparação destaca intencionalidade, perseverança e domínio próprio.\n\nDisciplina não é tentar conquistar o amor de Deus por desempenho. É organizar a vida para cultivar aquilo que reconhecemos como importante.",
    pratica: "Defina um horário realista para seu momento com Deus durante os próximos três dias.",
    pergunta: "Qual obstáculo mais atrapalha sua constância?",
    oracao: "Senhor, ajuda-me a desenvolver disciplina sem transformar minha fé em uma obrigação vazia. Dá-me disposição para continuar. Amém."
  },
  {
    titulo: "A importância da Palavra",
    referencia: "Salmos 119:105",
    introducao: "A Palavra de Deus pode orientar nossas escolhas e iluminar nossos caminhos.",
    reflexao: "Quando precisamos tomar decisões, recebemos opiniões de muitos lugares. Algumas ajudam, outras confundem. Por isso, precisamos desenvolver discernimento.\n\nO Salmo 119 celebra a importância da Palavra de Deus e a apresenta como luz para o caminho. O salmista expressa seu compromisso com os ensinamentos divinos.\n\nLer a Bíblia não é apenas acumular informações. É aprender a compreender seu contexto, refletir sobre seus ensinamentos e permitir que eles orientem nossa maneira de viver.",
    pratica: "Leia um trecho do Salmo 119 e anote uma orientação que você pode aplicar.",
    pergunta: "Como a leitura bíblica poderia influenciar uma decisão que você precisa tomar?",
    oracao: "Pai, dá-me desejo de conhecer tua Palavra. Ajuda-me a compreendê-la com responsabilidade e a viver seus ensinamentos. Amém."
  },
  {
    titulo: "Escolher o que edifica",
    referencia: "Filipenses 4:8",
    introducao: "Aquilo que alimentamos em nossa mente influencia nossa maneira de viver.",
    reflexao: "Nossa atenção é disputada o tempo inteiro. Notícias, comparações, discussões e conteúdos podem ocupar nossa mente sem que percebamos.\n\nEm Filipenses 4:8, Paulo orienta os cristãos a direcionarem seus pensamentos para aquilo que é verdadeiro, respeitável, justo, puro e digno de consideração.\n\nIsso não significa ignorar problemas ou evitar conversas difíceis. Significa desenvolver discernimento sobre aquilo que consumimos e sobre os pensamentos que escolhemos alimentar.",
    pratica: "Observe seu consumo de conteúdo hoje e reduza uma distração que esteja prejudicando sua paz ou concentração.",
    pergunta: "Que tipo de conteúdo mais influencia seu humor e seus pensamentos?",
    oracao: "Deus, ajuda-me a desenvolver discernimento sobre aquilo que ocupa minha mente. Que meus pensamentos sejam orientados pela verdade e pelo bem. Amém."
  },
  {
    titulo: "Ser paciente",
    referencia: "Romanos 12:12",
    introducao: "Nem todos os processos acontecem no tempo que desejamos.",
    reflexao: "A impaciência aparece quando queremos resultados imediatos. Podemos nos frustrar com outras pessoas, com nossos próprios limites e com processos que parecem lentos.\n\nRomanos 12 apresenta orientações práticas para a vida cristã, incluindo alegria na esperança, perseverança na tribulação e dedicação à oração.\n\nA paciência não é simplesmente esperar sem fazer nada. É continuar agindo com maturidade sem permitir que a pressa destrua aquilo que estamos construindo.",
    pratica: "Em uma situação que normalmente despertaria irritação, faça uma pausa antes de responder.",
    pergunta: "Em qual situação você precisa desenvolver mais paciência?",
    oracao: "Senhor, fortalece minha esperança e ensina-me a agir com paciência e maturidade diante dos desafios. Amém."
  },
  {
    titulo: "Viver com humildade",
    referencia: "Miqueias 6:8",
    introducao: "Uma vida de fé também é revelada pela maneira como tratamos as pessoas.",
    reflexao: "Às vezes, podemos concentrar nossa atenção em demonstrar conhecimento religioso e esquecer a importância das atitudes cotidianas.\n\nMiqueias 6:8 resume exigências importantes da vida diante de Deus: praticar a justiça, amar a misericórdia e andar humildemente com Ele. O contexto questiona uma religiosidade que tenta substituir uma vida justa por demonstrações externas.\n\nHumildade não é se diminuir diante de todos. É reconhecer nossos limites, tratar as pessoas com dignidade e permanecer disposto a aprender.",
    pratica: "Procure uma oportunidade de agir com justiça, misericórdia ou humildade hoje.",
    pergunta: "Como você pode demonstrar sua fé de maneira mais prática nos relacionamentos?",
    oracao: "Deus, ensina-me a viver com humildade, praticar a justiça e tratar as pessoas com misericórdia. Amém."
  },
  {
    titulo: "Ter um coração obediente",
    referencia: "João 14:15",
    introducao: "O amor por Deus também se expressa nas escolhas que fazemos.",
    reflexao: "É possível conhecer muitos ensinamentos e ainda ter dificuldade de colocá-los em prática. A transformação exige mais do que informação: envolve decisões.\n\nEm João 14, Jesus relaciona o amor por ele à obediência aos seus mandamentos. Essa obediência nasce de um relacionamento e não de uma tentativa de comprar o favor de Deus.\n\nNem sempre fazer o que é correto será confortável. Mas cada escolha orientada pelos ensinamentos de Cristo pode fortalecer uma vida coerente com a fé que professamos.",
    pratica: "Pense em um ensinamento de Jesus que você já conhece e escolha uma maneira concreta de praticá-lo.",
    pergunta: "Existe alguma área em que você sabe o que precisa mudar, mas continua adiando?",
    oracao: "Jesus, ajuda-me a demonstrar meu amor por Ti através das minhas escolhas. Dá-me coragem para viver aquilo que aprendo. Amém."
  },
  {
    titulo: "Ser luz",
    referencia: "Mateus 5:14–16",
    introducao: "Sua fé pode influenciar positivamente o ambiente ao seu redor.",
    reflexao: "Nossa fé não foi feita para ficar restrita às palavras. Ela também aparece na maneira como tratamos familiares, colegas, amigos e desconhecidos.\n\nEm Mateus 5, Jesus chama seus discípulos de luz do mundo e os orienta a viver de modo que suas boas obras apontem para Deus.\n\nSer luz não é buscar reconhecimento ou tentar parecer perfeito. É agir com amor, honestidade, justiça e generosidade, mesmo quando ninguém está observando.",
    pratica: "Faça hoje uma atitude de bondade sem esperar reconhecimento em troca.",
    pergunta: "Que tipo de influência suas atitudes têm exercido sobre as pessoas próximas?",
    oracao: "Senhor, que minhas atitudes reflitam teu amor. Ajuda-me a ser uma presença de bondade, verdade e esperança onde eu estiver. Amém."
  },
  {
    titulo: "Continuar caminhando",
    referencia: "Gálatas 6:9",
    introducao: "Não abandone uma caminhada importante apenas porque os resultados ainda não apareceram.",
    reflexao: "Existem esforços que parecem não produzir resultados imediatos. Podemos nos cansar de tentar, de melhorar e de continuar fazendo o que é correto.\n\nEm Gálatas 6, Paulo incentiva os cristãos a não se cansarem de fazer o bem. O texto está inserido em orientações sobre responsabilidade, cuidado e vida comunitária.\n\nPerseverar não significa ignorar o cansaço ou insistir em caminhos prejudiciais. Significa reconhecer o valor de continuar fazendo o bem, mesmo quando os frutos ainda não são visíveis.",
    pratica: "Identifique um hábito saudável que você quase abandonou e escolha um pequeno passo para retomá-lo.",
    pergunta: "O que você sente vontade de abandonar por não enxergar resultados?",
    oracao: "Pai, fortalece meu coração para continuar fazendo o bem. Dá-me sabedoria para respeitar meus limites e perseverança para seguir contigo. Amém."
  },
  {
    titulo: "Uma vida com Deus",
    referencia: "João 15:5",
    introducao: "O fim desta jornada não precisa ser o fim da sua caminhada.",
    reflexao: "Chegar ao último dia de uma jornada é motivo para reconhecer o caminho percorrido. Mas desenvolver uma vida com Deus não é uma tarefa que termina depois de trinta dias.\n\nEm João 15, Jesus ensina que os discípulos precisam permanecer nele, assim como os ramos permanecem ligados à videira. Essa imagem aponta para uma relação contínua, da qual dependem os frutos.\n\nTalvez você tenha começado com dificuldades, perdido alguns dias ou precisado recomeçar. Isso não apaga o valor de cada passo. O objetivo nunca foi cumprir um calendário perfeitamente, mas cultivar uma relação mais constante com Deus.",
    pratica: "Escolha um horário e uma prática simples para continuar sua caminhada espiritual nos próximos sete dias.",
    pergunta: "O que mudou em sua maneira de enxergar seu relacionamento com Deus durante esta jornada?",
    oracao: "Senhor, obrigado por cada passo desta caminhada. Ajuda-me a permanecer em Ti e a continuar buscando tua presença todos os dias. Que esta jornada seja um começo, não um ponto final. Amém."
  }
];

export default function DevocionalPage({ dia }: { dia: string }) {
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Carregando seu progresso...");

  const routeKey = dia;
  const dateKey = isDateKey(routeKey) ? routeKey : null;
  const diaAtual = dateKey
    ? getDevotionalNumber(dateKey, devocionais.length) + 1
    : Number(routeKey);

  const devocional =
    dateKey !== null || (Number.isInteger(diaAtual) && diaAtual >= 1 && diaAtual <= 30)
      ? devocionais[diaAtual - 1]
      : null;
  const storageKey = dateKey || String(diaAtual);
  const isFutureDate = Boolean(dateKey && dateKey > getLocalDateKey());

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!devocional) {
        if (active) setLoaded(true);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!active) return;

      if (authError || !authData.user) {
        const localReflection = localStorage.getItem(`jornada-reflexao-${storageKey}`) || "";
        const localCompleted = localStorage.getItem(`jornada-concluido-${storageKey}`) === "true";
        setReflection(localReflection);
        setCompleted(localCompleted);
        setSavedToCloud(false);
        setSaveMessage("Entre na sua conta para salvar seu progresso na nuvem.");
        setLoaded(true);
        return;
      }

      const currentUserId = authData.user.id;
      setUserId(currentUserId);

      const { data, error } = dateKey
        ? await supabase.from("devotional_entries")
            .select("reflection, completed")
            .eq("user_id", currentUserId)
            .eq("devotional_date", dateKey)
            .maybeSingle()
        : await supabase.from("journey_progress")
            .select("reflection, completed")
            .eq("user_id", currentUserId)
            .eq("day_number", diaAtual)
            .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Erro ao carregar progresso:", error.message);
        setSavedToCloud(false);
        setSaveMessage(getProgressErrorMessage(error));
      } else if (data) {
        setReflection(data.reflection || "");
        setCompleted(data.completed === true);
        setSavedToCloud(true);
        setSaveMessage("Seu progresso está sincronizado.");
      } else {
        // Aproveita dados antigos deste dispositivo e os migra para a conta.
        const localReflection = localStorage.getItem(`jornada-reflexao-${storageKey}`) || "";
        const localCompleted = localStorage.getItem(`jornada-concluido-${storageKey}`) === "true";
        setReflection(localReflection);
        setCompleted(localCompleted);
        if (localReflection || localCompleted) {
          const { error: migrationError } = dateKey
            ? await supabase.from("devotional_entries").upsert(
                {
                  user_id: currentUserId,
                  devotional_date: dateKey,
                  devotional_number: diaAtual,
                  reflection: localReflection,
                  completed: localCompleted,
                  completed_at: localCompleted ? new Date().toISOString() : null,
                },
                { onConflict: "user_id,devotional_date" }
              )
            : await supabase.from("journey_progress").upsert(
                {
                  user_id: currentUserId,
                  day_number: diaAtual,
                  reflection: localReflection,
                  completed: localCompleted,
                  completed_at: localCompleted ? new Date().toISOString() : null,
                },
                { onConflict: "user_id,day_number" }
              );
          if (!active) return;
          setSavedToCloud(!migrationError);
          setSaveMessage(migrationError ? "Seu progresso antigo foi carregado, mas não sincronizou." : "Progresso deste dispositivo sincronizado.");
        } else {
          setSavedToCloud(false);
          setSaveMessage("Seu progresso está pronto para ser salvo.");
        }
      }

      setLoaded(true);
    }

    loadProgress();
    return () => { active = false; };
  }, [diaAtual, dateKey, devocional, storageKey]);

  function handleReflectionChange(value: string) {
    setReflection(value);
    setSavedToCloud(false);
    localStorage.setItem(`jornada-reflexao-${storageKey}`, value);
    setSaveMessage("Alterações ainda não salvas na nuvem.");
  }

  async function handleSaveReflection() {
    if (!userId) return;
    setSaving(true);
    const { error } = dateKey
      ? await supabase.from("devotional_entries").upsert(
          {
            user_id: userId,
            devotional_date: dateKey,
            devotional_number: diaAtual,
            reflection,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,devotional_date" }
        )
      : await supabase.from("journey_progress").upsert(
          {
            user_id: userId,
            day_number: diaAtual,
            reflection,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,day_number" }
        );
    setSaving(false);
    setSavedToCloud(!error);
    setSaveMessage(error ? getProgressErrorMessage(error) : "Reflexão salva na sua conta.");
    if (error) console.error("Erro ao salvar reflexão:", error.message);
  }

  async function handleComplete() {
    if (isFutureDate) {
      setSaveMessage("Este devocional ficará disponível nessa data.");
      return;
    }

    if (!userId) {
      setSaveMessage("Entre na sua conta para registrar a conclusão do dia.");
      return;
    }

    if (completed && savedToCloud) {
      window.location.assign("/jornada");
      return;
    }

    const nextStatus = true;
    setSaving(true);
    const { error } = dateKey
      ? await supabase.from("devotional_entries").upsert(
          {
            user_id: userId,
            devotional_date: dateKey,
            devotional_number: diaAtual,
            reflection,
            completed: nextStatus,
            completed_at: nextStatus ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,devotional_date" }
        )
      : await supabase.from("journey_progress").upsert(
          {
            user_id: userId,
            day_number: diaAtual,
            reflection,
            completed: nextStatus,
            completed_at: nextStatus ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,day_number" }
        );
    setSaving(false);

    if (error) {
      console.error("Erro ao atualizar conclusão:", error.message);
      setSaveMessage(getProgressErrorMessage(error));
      return;
    }

    setCompleted(nextStatus);
    setSavedToCloud(true);
    localStorage.setItem(`jornada-concluido-${storageKey}`, String(nextStatus));
    setSaveMessage("Dia concluído e salvo na sua conta.");
    window.location.assign("/jornada");
  }

  if (!loaded) return null;

  if (!devocional) {
    return (
      <main className="min-h-screen bg-[#F5F0E7] p-8 text-[#302820]">
        <h1 className="font-serif text-3xl">Dia não encontrado</h1>
        <a href="/jornada" className="mt-4 inline-block text-[#78664F]">
          Voltar para a jornada
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E7] px-6 py-8 text-[#302820]">
      <div className="mx-auto max-w-2xl">
        <a href="/jornada" className="text-sm text-[#78664F]">
          ← Voltar para a jornada
        </a>

        <header className="mt-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#78664F]">
            {dateKey
              ? `Devocional diário · ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${dateKey}T12:00:00Z`))}`
              : `Jornada de 30 dias · Dia ${String(diaAtual).padStart(2, "0")}`}
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight">
            {devocional.titulo}
          </h1>

          <p className="mt-4 leading-7 text-[#71675B]">
            {devocional.introducao}
          </p>
        </header>

        <section className="mt-10 rounded-3xl bg-[#E7DED0] p-6">
          <p className="text-xs uppercase tracking-widest text-[#78664F]">
            Palavra de hoje
          </p>

          <h2 className="mt-3 font-serif text-2xl">
            {devocional.referencia}
          </h2>

          <p className="mt-4 leading-7">
            Reserve um momento para ler esta passagem diretamente
            em sua Bíblia, observando também os versículos ao redor
            para compreender o contexto.
          </p>

          <p className="mt-4 text-xs text-[#78664F]">
            Referência bíblica para leitura e reflexão.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Uma reflexão para hoje</h2>

          <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#51483E]">
            {devocional.reflexao.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#E2D8C9] bg-[#FAF8F3] p-6">
          <h2 className="font-serif text-2xl">Pratique hoje</h2>
          <p className="mt-3 leading-7 text-[#71675B]">
            {devocional.pratica}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Reflita sobre isso</h2>

          <p className="mt-3 leading-7 text-[#71675B]">
            {devocional.pergunta}
          </p>

          <textarea
            value={reflection}
            onChange={(e) => handleReflectionChange(e.target.value)}
            placeholder="Escreva aqui o que está no seu coração..."
            className="mt-5 min-h-36 w-full resize-y rounded-2xl border border-[#E2D8C9] bg-[#FAF8F3] p-4 text-sm outline-none focus:border-[#78664F]"
          />

          <p className="mt-2 text-xs text-[#8A7C6B]" aria-live="polite">
            {saving ? "Salvando..." : saveMessage}
          </p>
          {userId && (
            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={saving}
              className="mt-3 min-h-10 rounded-xl border border-[#D2C6B5] px-4 text-sm text-[#78664F] disabled:opacity-50"
            >
              Salvar reflexão
            </button>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Uma oração</h2>
          <p className="mt-3 leading-8 text-[#51483E]">
            {devocional.oracao}
          </p>
        </section>

        {isFutureDate ? (
          <button disabled className="mt-10 w-full rounded-2xl bg-[#78664F]/50 px-6 py-4 text-sm font-medium text-white">
            Disponível nessa data
          </button>
        ) : userId ? (
          <button
            onClick={handleComplete}
            disabled={saving}
            className="mt-10 w-full rounded-2xl bg-[#78664F] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#62523F] disabled:opacity-60"
          >
            {saving ? "Salvando..." : completed ? "✓ Dia concluído" : "Concluir meu devocional"}
          </button>
        ) : (
          <a
            href="/login"
            className="mt-10 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#78664F] px-6 py-4 text-center text-sm font-medium text-white transition hover:bg-[#62523F]"
          >
            Entre para concluir e acender seu foguinho
          </a>
        )}

        <div className="mb-10 mt-6 flex justify-between gap-4">
          {dateKey ? (
            <a
              href={`/jornada/${shiftDateKey(dateKey, -1)}`}
              className="rounded-xl border border-[#D2C6B5] px-4 py-3 text-sm text-[#78664F]"
            >
              ← Dia anterior
            </a>
          ) : diaAtual > 1 ? (
            <a
              href={`/jornada/${diaAtual - 1}`}
              className="rounded-xl border border-[#D2C6B5] px-4 py-3 text-sm text-[#78664F]"
            >
              ← Dia anterior
            </a>
          ) : <span />}

          {dateKey ? (
            <a
              href={`/jornada/${shiftDateKey(dateKey, 1)}`}
              className="rounded-xl bg-[#E7DED0] px-4 py-3 text-sm text-[#78664F]"
            >
              Próximo dia →
            </a>
          ) : diaAtual < 30 ? (
            <a
              href={`/jornada/${diaAtual + 1}`}
              className="rounded-xl bg-[#E7DED0] px-4 py-3 text-sm text-[#78664F]"
            >
              Próximo dia →
            </a>
          ) : <span />}
        </div>

        <p className="mb-8 text-center text-xs text-[#8A7C6B]">
          Um dia de cada vez, mais perto de Deus.
        </p>
      </div>
    </main>
  );
}

function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getProgressErrorMessage(error: { code?: string; message?: string }) {
  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.includes("devotional_entries")
  ) {
    return "O calendário novo ainda não foi ativado no Supabase. Execute a migração diária no SQL Editor para salvar este dia.";
  }

  return "Não foi possível salvar seu progresso. Verifique sua conexão e tente novamente.";
}
