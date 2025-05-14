import { AudioChunkStream } from '../../AudioChunkStream.ts'
import { AudioChunk } from '../../AudioChunk.ts';

export function mapAudioChunkStream(
    stream: AudioChunkStream,
    fn: (chunk: AudioChunk) => AudioChunk | Promise<AudioChunk>
  ): AudioChunkStream {
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield await fn(chunk);
        }
      }
    };
  }
  