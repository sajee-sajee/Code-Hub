# Code Hub

A React and TypeScript browser editor for writing, downloading and sharing code snippets.

**Status: frontend prototype.** The Run action uses local pattern-based simulations in `src/lib/codeUtils.ts`. It does not compile or execute arbitrary Python, C++, Java or JavaScript. There is no compilation API or API key to configure. The editor is a textarea with line numbers and tab indentation, not Monaco.

## Implemented

- Language selection and starter snippets
- Editing, copying and downloading code
- Share links containing the snippet in the URL
- Simulated output and input prompts for selected examples

## Run locally

Use Node.js 22 and npm.

```bash
git clone https://github.com/sajee-sajee/Code-Hub.git
cd Code-Hub
npm ci
npm run dev
```

Open the address printed by Vite. To build and inspect the production bundle:

```bash
npm run build
npm run preview
```

There are no required environment variables. Internet access is needed to install dependencies.

## Two-minute demonstration

1. Choose Python and edit the sample snippet.
2. Select **Simulate** to explore the example output flow.
3. Download the code and verify the file contents.
4. Generate a share link and open it in a second tab.

Share links expose their code and output in the URL. Do not include credentials or private code; long snippets can exceed browser URL limits.

## Structure

- `src/components/CodeEditor.tsx`: textarea editor
- `src/pages/Index.tsx`: editor state and actions
- `src/lib/codeUtils.ts`: example simulations, sharing and downloads

## Next engineering milestone

Integrate an isolated execution service with authentication, execution quotas, input/output limits and error handling. Until that exists, simulated results must not be used to assess program correctness. Build success verifies bundling, not real compilation behavior.
