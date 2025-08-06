# Tailwind Color Decorator for Svelte

Visual Studio Code extension that adds inline color decorators for <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" height="17" alt="tailwindcss logo"/> TailwindCSS hex colors inside <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg" height="17" alt="svelte logo"/> `.svelte` files. I made this because the popular [`Tailwind CSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension shows color decorators but are not editable in `.svelte` files for some reason.

## Features

- Adds clickable color swatches next to Tailwind classes like:
  - `text-[#f87171]`
  - `bg-[#1d4ed8]`
  - `border-[#10b981]`
- Works specifically in `.svelte` files.
- Instantly preview and update colors using the built-in color picker.

## Installation

1. Make sure you have `vsce` installed:

   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:

   ```bash
   vsce package
   ```

3. Install the resulting `.vsix` file in VS Code:
   - Open the Command Palette (`Ctrl+Shift+P`)
   - Select `Extensions: Install from VSIX...`
   - Browse to your `.vsix` file

## Supported Syntax

This extension currently supports Tailwind color utility classes that use **custom hex values**, such as:

```html
<div class="bg-[#1d4ed8] text-[#f87171ba] border-[#abc]">Colorful!</div>
```

## Not Supported Yet

- Named Tailwind colors like `bg-red-500`
- RGB/HSL/opacity variants