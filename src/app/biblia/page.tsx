
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Book = {
  name: string;
  slug: string;
  abbrev: string;
  chapters: number;
  testament: "old" | "new";
};

type Verse = {
  number: number;
  text: string;
};

function localized(value: any): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  return (
    value["pt-br"] ||
    value["pt_BR"] ||
    value.pt ||
    value.en ||
    Object.values(value).find((v) => typeof v === "string") ||
    ""
  ) as string;
}

export default function BibliaPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookName, setBookName] = useState("");
  const [chapter, setChapter] = useState(1);
  const [search, setSearch] = useState("");
  const [testament, setTestament] = useState<"old" | "new">("new");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [credit, setCredit] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booksError, setBooksError] = useState("");

  const selectedBook = books.find((book) => book.name === bookName);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoadingBooks(true);
        setBooksError("");

        const response = await fetch("https://api.midvash.com/v1/books");

        if (!response.ok) {
          throw new Error("Não foi possível carregar os livros.");
        }

        const result = await response.json();

        const formattedBooks: Book[] = (result.data ?? []).map(
          (book: any) => ({
            name: localized(book.name),
            slug: localized(book.slug),
            abbrev: localized(book.abbrev),
            chapters: Number(book.chapters),
            testament: book.testament,
          })
        );

        const validBooks = formattedBooks.filter(
          (book) => book.name && book.slug && book.chapters > 0
        );

        if (!validBooks.length) {
          throw new Error("A lista de livros veio vazia.");
        }

        setBooks(validBooks);

        const john = validBooks.find(
          (book) => book.slug === "joao" || book.slug === "john"
        );

        const initialBook = john || validBooks[0];

        setBookName(initialBook.name);
        setTestament(initialBook.testament);
      } catch (err) {
        setBooksError(
          err instanceof Error ? err.message : "Erro ao carregar os livros."
        );
      } finally {
        setLoadingBooks(false);
      }
    }

    loadBooks();
  }, []);

  useEffect(() => {
    if (!selectedBook) return;

    let active = true;

    async function loadChapter() {
      setLoading(true);
      setError("");
      setVerses([]);

      try {
        const response = await fetch(
          `https://api.midvash.com/v1/bpm/${encodeURIComponent(
            selectedBook!.slug
          )}/${chapter}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Não foi possível carregar o capítulo."
          );
        }

        const data = result.data;
        const rawVerses = data.verses ?? [];

        const formattedVerses: Verse[] = rawVerses
          .map((verse: any, index: number) => ({
            number: index + 1,
            text: typeof verse === "string"
              ? verse
              : String(verse.text ?? verse.content ?? ""),
          }))
          .filter((verse: Verse) => verse.text.trim());

        if (!formattedVerses.length) {
          throw new Error("Nenhum versículo foi encontrado neste capítulo.");
        }

        if (active) {
          setVerses(formattedVerses);
          setCredit(
            result.meta?.copyright ||
            "Bíblia Portuguesa Mundial (BPM)"
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar a leitura."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadChapter();

    return () => {
      active = false;
    };
  }, [selectedBook, chapter]);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.testament === testament &&
        book.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, testament, search]);

  function changeBook(book: Book) {
    setBookName(book.name);
    setChapter(1);
    setTestament(book.testament);
    setSearch("");
  }

  return (
    <main className="min-h-screen bg-[#F5F0E7] pb-12 text-[#302820]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pb-7 pt-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#78664F]">
            Jornada com Deus
          </p>
          <h1 className="mt-2 font-serif text-3xl">Bíblia</h1>
          <p className="mt-1 text-sm text-[#78664F]">
            Sua leitura, seu momento com Deus.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full border border-[#D8CDBD] px-4 py-2 text-sm"
        >
          Início
        </Link>
      </header>

      <section className="mx-auto max-w-5xl space-y-5 px-5">
        <div className="rounded-3xl bg-[#E7DED0] p-5 sm:p-7">
          <p className="text-xs uppercase tracking-widest text-[#78664F]">
            Sua leitura atual
          </p>

          <h2 className="mt-3 font-serif text-3xl">
            {selectedBook ? `${selectedBook.name} ${chapter}` : "Preparando..."}
          </h2>

          <p className="mt-2 text-sm text-[#78664F]">
            Bíblia Portuguesa Mundial · BPM
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setChapter((v) => Math.max(1, v - 1))}
              disabled={!selectedBook || chapter === 1}
              className="min-h-11 rounded-full border border-[#B9AA96] px-5 text-sm disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              onClick={() =>
                setChapter((v) =>
                  Math.min(selectedBook?.chapters ?? 1, v + 1)
                )
              }
              disabled={!selectedBook || chapter === selectedBook.chapters}
              className="min-h-11 rounded-full bg-[#78664F] px-5 text-sm text-white disabled:opacity-40"
            >
              Próximo capítulo
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E2D8C9] bg-[#FAF8F3] p-5 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-[#78664F]">
            Palavra de Deus
          </p>

          <h2 className="mt-2 font-serif text-2xl">
            {selectedBook?.name} {chapter}
          </h2>

          {loadingBooks || loading ? (
            <p className="py-12 text-center text-sm text-[#78664F]">
              Preparando sua leitura...
            </p>
          ) : error ? (
            <div className="mt-5 rounded-2xl bg-[#F1EADF] p-5 text-sm">
              {error}
              <button
                onClick={() => setChapter((v) => v)}
                className="mt-3 block font-semibold text-[#78664F] underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="mt-7 space-y-5">
              {verses.map((verse) => (
                <p
                  key={verse.number}
                  className="font-serif text-lg leading-9 text-[#40372D]"
                >
                  <sup className="mr-2 font-sans text-xs font-semibold text-[#987E5E]">
                    {verse.number}
                  </sup>
                  {verse.text}
                </p>
              ))}
            </div>
          )}

          {booksError && (
            <p className="mt-4 text-sm text-red-700">{booksError}</p>
          )}

          {!loading && !error && verses.length > 0 && (
            <div className="mt-8 border-t border-[#E2D8C9] pt-4">
              <p className="text-xs leading-5 text-[#8A7B68]">
                {credit}
              </p>
              <p className="mt-2 text-xs text-[#8A7B68]">
                Conteúdo fornecido pela API Midvash.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[#E2D8C9] bg-[#FAF8F3] p-5 sm:p-7">
          <h2 className="font-serif text-xl">Escolha um livro</h2>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar livro..."
            className="mt-4 min-h-12 w-full rounded-2xl border border-[#D8CDBD] bg-white px-4 text-sm outline-none focus:border-[#78664F]"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setTestament("old")}
              className={`rounded-full px-4 py-3 text-xs ${
                testament === "old"
                  ? "bg-[#78664F] text-white"
                  : "bg-[#E7DED0] text-[#5F5345]"
              }`}
            >
              Antigo Testamento
            </button>

            <button
              onClick={() => setTestament("new")}
              className={`rounded-full px-4 py-3 text-xs ${
                testament === "new"
                  ? "bg-[#78664F] text-white"
                  : "bg-[#E7DED0] text-[#5F5345]"
              }`}
            >
              Novo Testamento
            </button>
          </div>

          {loadingBooks ? (
            <p className="py-8 text-sm text-[#78664F]">
              Carregando os livros...
            </p>
          ) : booksError ? (
            <p className="py-8 text-sm text-red-700">{booksError}</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredBooks.map((book) => (
                <button
                  key={book.slug}
                  onClick={() => changeBook(book)}
                  className={`rounded-xl border p-3 text-left text-sm ${
                    bookName === book.name
                      ? "border-[#78664F] bg-[#E7DED0]"
                      : "border-[#E2D8C9] bg-white"
                  }`}
                >
                  {book.name}
                  <span className="mt-1 block text-xs text-[#8A7B68]">
                    {book.chapters} capítulos
                  </span>
                </button>
              ))}
              {filteredBooks.length === 0 && (
                <p className="col-span-2 py-4 text-sm text-[#78664F]">
                  Nenhum livro encontrado.
                </p>
              )}
            </div>
          )}
        </div>

        {selectedBook && (
          <div className="rounded-3xl border border-[#E2D8C9] bg-[#FAF8F3] p-5 sm:p-7">
            <h2 className="font-serif text-xl">Escolha um capítulo</h2>

            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {Array.from(
                { length: selectedBook.chapters },
                (_, i) => i + 1
              ).map((number) => (
                <button
                  key={number}
                  onClick={() => setChapter(number)}
                  className={`aspect-square rounded-xl text-sm ${
                    chapter === number
                      ? "bg-[#78664F] text-white"
                      : "bg-[#E7DED0] text-[#302820]"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
