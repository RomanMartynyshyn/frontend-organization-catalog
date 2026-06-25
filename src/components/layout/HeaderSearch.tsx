const CITY_NAME = 'Кривий Ріг';

const SearchArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

type HeaderSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HeaderSearch({ search, onSearchChange }: HeaderSearchProps) {
  return (
    <div className="flex w-full max-w-[640px] overflow-hidden rounded-lg border border-black">
      <span className="inline-flex shrink-0 items-center bg-[#1B224B] px-3 py-2.5 text-xs font-bold text-white sm:px-4 sm:text-sm md:px-5">
        {CITY_NAME}
      </span>

      <label className="flex min-w-0 flex-1 items-center gap-2 bg-white px-3 py-2.5 sm:gap-3 sm:px-4">
        <span className="sr-only">Пошук організацій</span>
        <input
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Введіть назву організації"
          className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[#6b6b6b]"
        />
        <span className="shrink-0 text-[#6b6b6b]">
          <SearchArrowIcon />
        </span>
      </label>
    </div>
  );
}
