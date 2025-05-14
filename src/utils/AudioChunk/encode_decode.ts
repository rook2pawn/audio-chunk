import cbor from 'cbor'; // or use msgpack-lite
import { AudioChunk } from '../../AudioChunk.js';

export function encodeAudioChunkBinary(chunk: AudioChunk): Uint8Array {
  return cbor.encode(chunk.toJSON());
}

export function decodeAudioChunkBinary(data: Uint8Array): AudioChunk {
  return AudioChunk.fromJSON(cbor.decode(data));
}
