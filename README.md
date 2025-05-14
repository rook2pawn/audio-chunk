# @rook2pawn/audio-chunk

A shared module for real-time audio systems built around a common `AudioChunk` structure. Designed to support streaming, serialization, transport, observability, and playback for use cases like AI-driven speech applications (e.g., STT, TTS, audio routing, and replay).

---

## 📦 Installation

```bash
npm install @rook2pawn/audio-chunk
```

## 📚 Module Structure
```
src/
├── AudioChunk.ts                # Core AudioChunk class and interface
├── AudioChunkStream.ts          # Type alias: AsyncIterable<AudioChunk>
├── utils/
│   ├── encode_decode.ts         # CBOR, JSON, and base64 encoding/decoding
│   ├── transport.ts             # HTTP and WebSocket send utilities
│
│   └── AudioChunkStream/
│       ├── buffer.ts            # AudioChunkBuffer with replay support
│       ├── stream.ts            # streamFromWebSocket, pipeToWritableStream
│       ├── transform.ts         # mapAudioChunkStream
```

## 🔊 What is an AudioChunk?
An AudioChunk is a portable wrapper around a slice of audio data, carrying important metadata:

```js
export interface AudioChunkProps {
  data: Uint8Array | Float32Array;
  encoding?: 'float32' | 'pcm16' | 'opus' | 'mp3';
  sampleRate?: number;
  timestamp?: number;
  id?: string;
  metadata?: Record<string, any>;
}
```

## ✨ Core Features

### ✅ AudioChunk Class
```js
import { AudioChunk } from '@rook2pawn/audio-chunk';

const chunk = new AudioChunk({
  data: new Float32Array([...]), 
  sampleRate: 16000,
  timestamp: Date.now()
});
```

### Serialize and Deserialize
```js
const json = chunk.toJSON();
const recovered = AudioChunk.fromJSON(json);
```

### 🔁 AudioChunkStream
A type alias for streaming audio:

```js
export type AudioChunkStream = AsyncIterable<AudioChunk>;
```

Used for:

* Streaming audio from mic or WebSocket
* Piping to TTS or STT
* Broadcasting to multiple sinks

### 🧰 Utilities

#### encode_decode.ts

* encodeAudioChunkBinary(chunk) → Uint8Array (CBOR)
* decodeAudioChunkBinary(data: Uint8Array) → AudioChunk
* chunk.toJSON() / AudioChunk.fromJSON(json)

#### transport.ts
* sendChunkOverWS(ws, chunk)
* postChunk(url, chunk)

### 📡 AudioChunkStream Utilities

#### stream.ts
```js
streamFromWebSocket(ws: WebSocket): AudioChunkStream
pipeToWritableStream(stream: AudioChunkStream, fn: (chunk) => void)
```

#### transform.ts
```js
mapAudioChunkStream(stream, fn): AudioChunkStream
```
#### buffer.ts
```js
class AudioChunkBuffer {
  push(chunk: AudioChunk): void
  getRecent(ms: number): AudioChunk[]
  toStream(): AudioChunkStream
}
```

## 🔌 Example Usage
Receiving Audio Chunks from WebSocket
```js
const stream = streamFromWebSocket(myWebSocket);

pipeToWritableStream(stream, (chunk) => {
  // Send to WebAudio or decode for transcription
});
```

📤 Sending AudioChunk to Server
```js
await postChunk('/api/stream-audio', chunk);
```

Or WebSocket:
```js
sendChunkOverWS(ws, chunk);
```

## 🔮 Future Roadmap
* RTP adapter for low-level packet transmission
* ReplaySubject-style multicast support
* Framed audio decoding / windowing
* Observability dashboard for live streams

## 🪪 License
MIT © David Wee 2025