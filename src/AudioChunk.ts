export type AudioEncoding = 'pcm16' | 'float32' | 'opus' | 'wav' | 'mp3';

export interface AudioChunkProps {
  data: Uint8Array | Float32Array;
  encoding?: AudioEncoding;      // default: 'float32'
  sampleRate?: number;           // default: 16000
  timestamp?: number;            // default: Date.now()
  id?: string;                   // optional UUID or stream ID
  metadata?: Record<string, any>;
}

export class AudioChunk {
  id?: string;
  data: Uint8Array | Float32Array;
  encoding: AudioEncoding;
  sampleRate: number;
  timestamp: number;
  metadata?: Record<string, any>;

  constructor({
    data,
    encoding = 'float32',
    sampleRate = 16000,
    timestamp = Date.now(),
    id,
    metadata
  }: AudioChunkProps) {
    this.id = id;
    this.data = data;
    this.encoding = encoding;
    this.sampleRate = sampleRate;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }

  toJSON(): any {
    return {
      id: this.id,
      sampleRate: this.sampleRate,
      encoding: this.encoding,
      timestamp: this.timestamp,
      metadata: this.metadata,
      data: Array.from(this.data)
    };
  }

  static fromJSON(json: any): AudioChunk {
    const data =
      json.encoding === 'float32'
        ? new Float32Array(json.data)
        : new Uint8Array(json.data);
    return new AudioChunk({
      id: json.id,
      data,
      encoding: json.encoding,
      sampleRate: json.sampleRate,
      timestamp: json.timestamp,
      metadata: json.metadata
    });
  }
}
