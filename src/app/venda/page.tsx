import Link from "next/link";

export const metadata = {
  title: "Jornada com Deus — 30 dias",
  description:
    "Uma jornada de 30 dias com leituras, reflexões e orações para fortalecer sua caminhada com Deus.",
};

export default function VendaPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL;

  return (
    <main className="min-h-screen bg-[#F5F0E7] px-5 py-10 text-[#302820] sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#78664F] underline underline-offset-4">
          ← Voltar para a Jornada
        </Link>

        <section className="mt-8 rounded-[2rem] bg-[#78664F] p-7 text-[#FFFDF8] shadow-xl sm:p-12">
          <p className="text-xs tracking-[3px] text-white/75">JORNADA COM DEUS</p>
          <h1 className="mt-5 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
            30 dias para cultivar um momento diário com Deus.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85">
            Uma caminhada guiada com leituras bíblicas, reflexões e orações para
            ajudar você a criar constância e dar um passo de cada vez.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-white/75">Acesso à jornada completa</p>
            <p className="mt-1 font-serif text-4xl">R$ 39,90</p>
            <p className="mt-1 text-sm text-white/75">Pagamento único</p>
          </div>

          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              className="mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#F5F0E7] px-6 py-4 text-center font-semibold text-[#554735] transition hover:bg-white"
            >
              Quero começar minha jornada
            </a>
          ) : (
            <div className="mt-6 rounded-xl border border-white/25 bg-black/10 px-5 py-4 text-sm leading-6 text-white/85">
              O checkout da Cakto será conectado aqui assim que o produto e o link
              de pagamento forem criados.
            </div>
          )}

          <p className="mt-4 text-center text-xs text-white/65">
            O acesso é liberado após a confirmação do pagamento pela Cakto.
          </p>
        </section>

        <section id="como-funciona" className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Leia", "Um trecho bíblico por dia para orientar sua reflexão."],
            ["Reflita", "Uma mensagem curta para conectar a Palavra à rotina."],
            ["Ore", "Finalize com uma oração e siga no seu próprio ritmo."],
          ].map(([title, body], index) => (
            <article key={title} className="rounded-2xl bg-[#FFFCF6] p-5">
              <p className="text-xs tracking-widest text-[#897D6D]">
                PASSO {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-serif text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#716657]">{body}</p>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-8 max-w-lg text-center text-xs leading-5 text-[#897D6D]">
          Conteúdo devocional para apoio à sua caminhada pessoal. A experiência
          não substitui acompanhamento pastoral, comunitário ou profissional.
        </p>
      </div>
    </main>
  );
}
