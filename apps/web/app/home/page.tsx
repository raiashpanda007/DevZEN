function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-6 p-8 text-center">
      <h1 className="text-4xl font-extrabold">Welcome to DevZEN</h1>

      <p className="text-lg max-w-2xl text-gray-700 dark:text-gray-300">
        Yo — try building it yourself first. Stuck? Call in Ashna, your sweet,
        smart coding assistant.
      </p>

      <div className="w-full max-w-2xl  border rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-3">What you can do right now</h2>
        <ul className="text-left list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
          <li>Create new projects from templates</li>
          <li>Edit code with the Monaco editor</li>
          <li>Open an interactive terminal and run commands</li>
          <li>Share projects via a generated link</li>
        </ul>

        <div className="mt-6 p-4 rounded-lg  border">
          <h3 className="font-semibold">Ashna coming soon</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Ashna will help scaffold features, suggest fixes, generate tests,
            and automate deployments  think of it as a friendly co-pilot for
            coding and ops.
        </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Want to explore the code? See the editor and server integration in the
        repo.
      </p>
    </div>
  );
}

export default Page;
