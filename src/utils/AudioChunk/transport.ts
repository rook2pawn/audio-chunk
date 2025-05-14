import { AudioChunk } from '../../AudioChunk.js';
import { encodeAudioChunkBinary, decodeAudioChunkBinary } from './encode_decode.js';

// WebSocket
export function sendChunkOverWS(ws: WebSocket, chunk: AudioChunk) {
    ws.send(encodeAudioChunkBinary(chunk));
  }
  
  // HTTP POST
  export async function postChunk(url: string, chunk: AudioChunk) {
    await fetch(url, {
      method: 'POST',
      body: encodeAudioChunkBinary(chunk),
      headers: { 'Content-Type': 'application/cbor' }
    });
  }
  