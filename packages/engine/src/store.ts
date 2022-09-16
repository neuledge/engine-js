export interface EngineStore {
  readonly status: EngineStoreStatus;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  //   findUnique(
  //     collectionName: string,
  //     id: Record<string, unknown>,
  //   ): Promise<Record<string, unknown>>;
}

export enum EngineStoreStatus {
  DISCONNECTED = 1,
  CONNECTING = 2,
  CONNECTED = 3,
  DISCONNECTING = 4,
}
