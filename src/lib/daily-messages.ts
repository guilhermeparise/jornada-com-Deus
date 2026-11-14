export const dailyMessages = [
  { title: "Comece com Deus", body: "Separe alguns minutos para buscar a presença de Deus. Salmos 63:1" },
  { title: "Há espaço para recomeçar", body: "A misericórdia se renova; hoje pode ser um novo começo. Lamentações 3:22–23" },
  { title: "Você é conhecido", body: "Deus conhece seus pensamentos e acolhe sua sinceridade. Salmos 139:1–4" },
  { title: "Aproxime-se", body: "Um pequeno passo de fé também fortalece sua caminhada. Tiago 4:8" },
  { title: "Entregue suas preocupações", body: "Você não precisa carregar tudo sozinho. 1 Pedro 5:7" },
  { title: "Faça uma pausa", body: "Respire, silencie as distrações e reconheça a presença de Deus. Salmos 46:10" },
  { title: "Encontre descanso", body: "Respeite seus limites e leve seu cansaço a Jesus. Mateus 11:28" },
  { title: "Ore sobre o que preocupa você", body: "Apresente suas inquietações a Deus com sinceridade. Filipenses 4:6–7" },
  { title: "Coragem para hoje", body: "Você pode agir com sabedoria mesmo quando sente medo. Isaías 41:10" },
  { title: "Confie no próximo passo", body: "Nem todas as respostas precisam chegar antes de você caminhar. Provérbios 3:5–6" },
  { title: "A espera também é caminho", body: "Continue fazendo o bem enquanto espera com esperança. Salmos 27:14" },
  { title: "Sua fé pode atravessar dias difíceis", body: "Busque a Deus mesmo quando ainda não consegue ver todo o caminho. Hebreus 11:1" },
  { title: "Deus é refúgio", body: "Em meio à instabilidade, procure força e direção em Deus. Salmos 46:1" },
  { title: "Confie seus caminhos", body: "Faça sua parte e entregue a Deus aquilo que você não controla. Salmos 37:5" },
  { title: "Seu valor não depende de desempenho", body: "Você é criação de Deus, chamado a caminhar com propósito. Efésios 2:10" },
  { title: "O perdão pode ser um processo", body: "Busque graça, verdade e limites saudáveis em seus relacionamentos. Colossenses 3:13" },
  { title: "Perceba o que já floresce", body: "A gratidão ajuda você a reconhecer o bem presente no caminho. 1 Tessalonicenses 5:18" },
  { title: "Seu propósito começa no cotidiano", body: "Sirva com amor nas pequenas oportunidades que surgem hoje. Colossenses 3:23" },
  { title: "Escolha amar com atitudes", body: "O amor também aparece na maneira como você trata as pessoas. 1 Coríntios 13:4–7" },
  { title: "A oração aproxima", body: "Converse com Deus com as palavras que você tem hoje. Jeremias 29:12" },
  { title: "Permaneça ligado à fonte", body: "Cultive sua relação com Jesus um dia de cada vez. João 15:5" },
  { title: "Constância começa pequeno", body: "Um hábito simples, repetido com sinceridade, pode criar raízes. Lucas 16:10" },
  { title: "Abra espaço para a Palavra", body: "Leia com calma e procure compreender o contexto. Salmos 119:105" },
  { title: "Alimente o que faz bem", body: "Escolha hoje uma atitude que promova paz e crescimento. Filipenses 4:8" },
  { title: "Seja paciente com seu processo", body: "Crescimento espiritual também pede tempo e perseverança. Romanos 12:12" },
  { title: "Caminhe com humildade", body: "Pratique a justiça, ame a misericórdia e caminhe com Deus. Miqueias 6:8" },
  { title: "Transforme fé em escolha", body: "Escolha praticar com amor aquilo que você aprende. João 14:15" },
  { title: "Seja presença de bondade", body: "Uma atitude generosa pode iluminar o dia de alguém. Mateus 5:14–16" },
  { title: "Continue fazendo o bem", body: "Não desista de uma caminhada importante por causa da demora. Gálatas 6:9" },
  { title: "A jornada continua", body: "Cada dia é uma nova oportunidade de permanecer em Deus. João 15:5" },
];

export function getDailyMessage(dateKey: string, userId = "") {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const anchor = new Date("2026-01-01T12:00:00Z");
  const day = Math.floor((date.getTime() - anchor.getTime()) / 86_400_000);
  const offset = [...userId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const index = ((day + offset) % dailyMessages.length + dailyMessages.length) % dailyMessages.length;
  return dailyMessages[index];
}
