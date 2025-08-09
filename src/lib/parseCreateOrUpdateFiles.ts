// utils/parseCreateOrUpdateFiles.ts
export function parseFileUpdatesFromResponse(text: string) {
  if (!text) return null;

  // 1) Try to find a JSON codeblock first (```json ... ```)
  const jsonBlock = text.match(/```json([\s\S]*?)```/i);
  if (jsonBlock) {
    try {
      const parsed = JSON.parse(jsonBlock[1]);
      // Accept structured { "app/file.tsx": "code..." } OR { files: [{path,content}] }
      if (parsed.files && Array.isArray(parsed.files)) return parsed.files;
      if (typeof parsed === "object") {
        const entries = Object.entries(parsed).map(([k, v]) => ({
          path: k,
          content: String(v),
        }));
        return entries;
      }
    } catch (e) {
      // fallthrough to other parsers
      console.warn("JSON parse failed:", e);
    }
  }

  // 2) Try to catch a plain JSON object inline (no code fences)
  const inlineJson = text.match(/(\{[\s\S]*\})/);
  if (inlineJson) {
    try {
      const parsed = JSON.parse(inlineJson[1]);
      if (parsed.files && Array.isArray(parsed.files)) return parsed.files;
      if (typeof parsed === "object") {
        const entries = Object.entries(parsed).map(([k, v]) => ({
          path: k,
          content: String(v),
        }));
        return entries;
      }
    } catch (e) {
      // not JSON
      console.log("Error in partCreateOrUpdateFile:     ",e)
    }
  }

  // 3) Parse "createOrUpdateFiles" blocks that look like:
  // createOrUpdateFiles
  // app/file.tsx
  // <code block or lines until blank line or next filename>
  const markerMatch = text.match(/createOrUpdateFiles/i);
  if (markerMatch) {
    // attempt to split into file sections by detecting lines that look like "app/xxx.tsx"
    // strategy: split text into lines, find filenames, then take subsequent lines until next filename
    const lines = text.split(/\r?\n/);
    const fileSections: { path: string; contentLines: string[] }[] = [];
    let cur: { path: string; contentLines: string[] } | null = null;

    const filenamePattern = /^[\w\-./]+\.(ts|tsx|js|jsx|json|css|mdx?)$/i;

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i].trim();
      // if the line is a filename or looks like one, start a new section
      if (filenamePattern.test(ln)) {
        if (cur) fileSections.push(cur);
        cur = { path: ln, contentLines: [] };
        continue;
      }

      // also support lines that are just: ``` or ```tsx or `use client` or code fence markers
      if (!cur) continue;
      cur.contentLines.push(lines[i]);
    }
    if (cur) fileSections.push(cur);

    // If we found sections, convert them to file objects
    if (fileSections.length > 0) {
      return fileSections.map((s) => {
        // Trim leading/trailing blank lines and trim triple backticks if included
        let content = s.contentLines.join("\n");
        content = content.replace(/(^```(?:tsx?|json)?\s*)|(\s*```$)/g, "").trim();
        return { path: s.path, content };
      });
    }
  }

  // 4) Last resort: find any triple-backtick codeblocks and use the preceding line as filename
  const codeBlockRegex = /(^[\t ]*([^\n`]+)\n```(?:[\w+]*)\n([\s\S]*?)```)/gm;
  const files: { path: string; content: string }[] = [];
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const possibleName = match[2].trim();
    const body = match[3];
    if (/^[\w\-./]+\.(ts|tsx|js|jsx|json|css|mdx?)$/.test(possibleName)) {
      files.push({ path: possibleName, content: body });
    }
  }
  if (files.length) return files;

  // Nothing matched
  return null;
}
