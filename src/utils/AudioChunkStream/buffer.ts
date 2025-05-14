import { AudioChunkStream } from '../../AudioChunkStream.ts'
import { AudioChunk } from '../../AudioChunk.ts';

export class AudioChunkBuffer {
    private buffer: AudioChunk[] = [];
    private maxAgeMs: number;
  
    constructor(maxAgeMs: number = 30000) {
      this.maxAgeMs = maxAgeMs;
    }
  
    push(chunk: AudioChunk) {
      this.buffer.push(chunk);
      const cutoff = Date.now() - this.maxAgeMs;
      this.buffer = this.buffer.filter(c => c.timestamp >= cutoff);
    }
  
    getRecent(ms: number): AudioChunk[] {
      const cutoff = Date.now() - ms;
      return this.buffer.filter(c => c.timestamp >= cutoff);
    }
  
    toStream(): AudioChunkStream {
      const chunks = [...this.buffer];
      return {
        async *[Symbol.asyncIterator]() {
          for (const chunk of chunks) {
            yield chunk;
          }
        }
      };
    }
  }
  