import { AudioChunkStream } from '../../AudioChunkStream.ts'
import { AudioChunk } from '../../AudioChunk.ts';

export function streamFromWebSocket(ws: WebSocket): AudioChunkStream {
    const decoder = new TextDecoder(); // if text-based transport
    const queue: AudioChunk[] = [];
    const waiters: ((chunk: AudioChunk) => void)[] = [];
  
    ws.onmessage = (event) => {
      const data = event.data instanceof ArrayBuffer
        ? new Uint8Array(event.data)
        : new TextEncoder().encode(event.data);
      const chunk = AudioChunk.fromJSON(JSON.parse(decoder.decode(data)));
      if (waiters.length) waiters.shift()!(chunk);
      else queue.push(chunk);
    };
  
    return {
      async *[Symbol.asyncIterator]() {
        while (true) {
          if (queue.length) {
            yield queue.shift()!;
          } else {
            yield await new Promise<AudioChunk>((resolve) => waiters.push(resolve));
          }
        }
      }
    };
  }

  // sink to a writable stream
  export async function pipeToWritableStream(
    stream: AudioChunkStream,
    writable: (chunk: AudioChunk) => Promise<void> | void
  ) {
    for await (const chunk of stream) {
      await writable(chunk);
    }
  }
  