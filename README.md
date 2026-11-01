# Xerlace Agent

AI-assisted Roblox development with custom model reseller & proxy support. **Xerlace Agent** is a free, open-source desktop app that connects any AI model (including custom OpenAI-compatible resellers, local LLMs like Ollama, DeepSeek, Groq, OpenRouter, etc.) to Roblox Studio's official MCP server, so you can build games by describing what you want.

## Key Features

- **Custom Model Reseller / Proxy Base URL Support**: Add any OpenAI-compatible provider with custom `Base URL`, `API Key`, and `Model IDs`.
- **CORS-Free Endpoint Testing & Auto-Fetch**: Test reseller connection directly from the desktop main process without browser CORS restrictions, and auto-fetch model lists with one click.
- **Full Roblox Studio MCP Integration**: AI models can read, inspect, create scripts, build UI, manipulate Explorer hierarchy, and edit properties in real time through Roblox Studio's official MCP server.
- **Multi-Provider Support**: Supports OpenAI, Anthropic Claude, Google Gemini, Groq, DeepSeek, OpenRouter, Together AI, local Ollama, and any third-party reseller proxy.
- **Local Storage & Persistence**: Custom providers are securely stored locally and automatically configured into the OpenCode execution engine.

## How it works

Xerlace Agent connects:

1. **A desktop app** (Electron, Effect, and React) where you chat with AI and configure custom reseller providers.
2. **An AI engine** ([OpenCode](https://github.com/anomalyco/opencode)) that manages model connections, sessions, and tool calling.
3. **Roblox Studio MCP Server**: Built-in MCP server in Roblox Studio that executes Lua code and modifies your Studio place safely.

## Setup & Quick Start

1. Install and launch **Xerlace Agent**.
2. Open Roblox Studio and open (or create) a place.
3. In Studio, open **Assistant** settings (three-dot menu) → **MCP Servers** → enable **Studio as MCP server**.
4. In Xerlace Agent:
   - Go to **Settings (gear icon)** → **Custom APIs** tab.
   - Click a preset (e.g. DeepSeek, OpenRouter, Ollama) or enter your reseller's `Base URL` and `API Key`.
   - Click **Test Connection & Fetch Models**, then **Auto-fill Models** and **Save Provider**.
   - Click **Restart Now** on the prompt.
5. In the chat interface, select your custom model from the picker and start building!

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10+

### Setup

```sh
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build production installers (.exe NSIS)
pnpm package
```

### Key commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run the full app in dev mode |
| `pnpm package` | Build production desktop installer (`release/Xerlace-Agent-Setup-*.exe`) |
| `pnpm build` | Compile TypeScript and Vite bundles |
| `pnpm typecheck` | Type-check app, Electron, and release scripts |
| `pnpm test` | Run test suite |

## Tech stack

- **Frontend**: React 18, TypeScript, TanStack React Query, Tailwind CSS
- **Desktop runtime**: Electron with Effect-managed services
- **AI engine**: [OpenCode](https://opencode.ai)
- **Studio integration**: [Roblox Studio MCP](https://create.roblox.com/docs/studio/mcp) (built-in)

## License

[MIT](LICENSE)
