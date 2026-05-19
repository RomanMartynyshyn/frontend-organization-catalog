export default function HeroMapSection() {
  return (
    <section className="w-full px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="mb-4 text-3xl font-semibold">Lorem ipsum</h1>

          <p className="mb-6 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            rutrum egestas elit quis pellentesque. Sed vitae odio lacus. Cras at
            velit lacinia, viverra sem lacinia, ultrices ante. Proin eu mi et
            leo sagittis iaculis. Etiam eget condimentum est. In faucibus odio
            sollicitudin, lobortis enim id, ultrices augue.
          </p>

          <button className="cursor-pointer rounded-md bg-black px-6 py-3 text-white transition hover:opacity-80">
            Call to action
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col gap-4">
          {/* MAP */}
          <div className="h-[300px] w-full cursor-grab overflow-hidden rounded-xl shadow transition hover:shadow-lg active:cursor-grabbing">
            <iframe
              className="h-[300px] w-full rounded-xl"
              src="https://www.openstreetmap.org/export/embed.html?bbox=30.5%2C50.4%2C30.6%2C50.5&layer=mapnik"
            />
          </div>

          {/* COORDINATES */}
          <div className="grid w-full grid-cols-3 gap-3">
            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div>
                <span className="text-2xl leading-none font-bold">X </span>
                donec
              </div>
            </div>

            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div>
                <span className="text-2xl leading-none font-bold">Y </span>
                parturient
              </div>
            </div>

            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div>
                <span className="text-2xl leading-none font-bold">Z </span>
                mattis
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mt-8 flex w-full flex-col items-stretch gap-3 px-6 lg:flex-row">
        {/* SEARCH */}
        <div className="flex flex-[2] cursor-text items-center rounded-full border bg-[#d9d9d9] px-4 py-3 shadow-sm">
          <input
            type="text"
            placeholder="Введіть назву організації..."
            className="w-full bg-transparent text-sm outline-none"
          />

          <svg
            className="ml-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* SORT */}
        <div className="relative flex-1 cursor-pointer">
          <select className="w-full cursor-pointer appearance-none rounded-full border bg-[#d9d9d9] px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm">
            <option value="">Сортувати за</option>
            <option value="popular">За популярністю</option>
            <option value="newest">За датою</option>
            <option value="reviews">За відгуками</option>
            <option value="recommended">Рекомендовані</option>
            <option value="alphabet">За алфавітом</option>
          </select>

          <svg
            className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* FILTER */}
        <div className="relative flex-1 cursor-pointer">
          <select className="w-full cursor-pointer appearance-none rounded-full border bg-[#d9d9d9] py-3 pr-10 pl-10 text-sm text-gray-700 shadow-sm">
            <option value="">Фільтр</option>
            <option value="area">Район</option>
            <option value="rating">Рейтинг</option>
            <option value="open_now">Відкрито зараз</option>
            <option value="online_booking">Онлайн-запис</option>
          </select>

          <svg
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
