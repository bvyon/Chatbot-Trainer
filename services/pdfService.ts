import { DocumentChunk } from "../types";

/**
 * Splits text into manageable chunks (simulating vector embeddings preparation).
 * Uses a sliding window approach or paragraph splitting to maintain context.
 */
const createChunks = (text: string, sourceId: string): DocumentChunk[] => {
  // Split by double newlines to get paragraphs
  const rawParagraphs = text.split(/\n\s*\n/);
  const chunks: DocumentChunk[] = [];
  
  let currentChunk = "";
  
  // Helper to estimate tokens (rough approx 4 chars = 1 token)
  const countTokens = (str: string) => Math.ceil(str.length / 4);

  rawParagraphs.forEach((para, index) => {
    const cleanPara = para.trim();
    if (!cleanPara) return;

    // If a single paragraph is too huge, we might split it (simplified here)
    // We try to group paragraphs until we hit a "context window" limit for a chunk (e.g., ~500 tokens)
    if (countTokens(currentChunk + cleanPara) < 500) {
      currentChunk += (currentChunk ? "\n\n" : "") + cleanPara;
    } else {
      // Push current chunk and start new
      if (currentChunk) {
        chunks.push({
          id: `${sourceId}-chunk-${chunks.length}`,
          text: currentChunk,
          tokenCount: countTokens(currentChunk)
        });
      }
      currentChunk = cleanPara;
    }
  });

  // Push the last remaining chunk
  if (currentChunk) {
    chunks.push({
      id: `${sourceId}-chunk-${chunks.length}`,
      text: currentChunk,
      tokenCount: countTokens(currentChunk)
    });
  }

  return chunks;
};

/**
 * Extracts text from a PDF file and chunks it.
 */
export const processPdfDocument = async (file: File, fileId: string): Promise<{ fullText: string, chunks: DocumentChunk[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);

      try {
        if (!window.pdfjsLib) {
          reject(new Error("PDF.js library not loaded"));
          return;
        }

        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        }

        // Create "Neural Nodes" (Chunks)
        const chunks = createChunks(fullText, fileId);

        resolve({ fullText, chunks });
      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Keep the original function for backward compatibility if needed, essentially wrapping the new one
export const extractTextFromPdf = async (file: File): Promise<string> => {
    const result = await processPdfDocument(file, 'temp');
    return result.fullText;
};