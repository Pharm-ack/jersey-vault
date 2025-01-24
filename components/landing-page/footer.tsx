export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700">
      <div className="container px-4 flex py-5 items-center justify-between">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/pharm_ack"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Pharmack
            </a>
            .
          </p>
        </div>
        <a
          href="https://twitter.com/pharm_ack"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-2xl dark:md:hover:bg-gray-800 border border-spacing-4 border-opacity-80 rounded px-2"
        >
          𝕏
        </a>
      </div>
    </footer>
  );
}
