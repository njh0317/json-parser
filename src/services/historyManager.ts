import { v4 as uuidv4 } from 'uuid';
import { HistoryItem } from '../types';

const DB_NAME = 'json-parser-tool';
const DB_VERSION = 1;
const STORE_NAME = 'history';
const MAX_ITEMS = 100;

let db: IDBDatabase | null = null;

/**
 * IndexedDB를 초기화합니다.
 */
export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error('Failed to open database'));

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * 히스토리 항목을 저장합니다.
 */
export async function save(content: string): Promise<HistoryItem> {
  const database = await initDB();
  const item: HistoryItem = {
    id: uuidv4(),
    content,
    timestamp: Date.now(),
    preview: content.substring(0, 100),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onsuccess = async () => {
      await cleanup();
      resolve(item);
    };
    request.onerror = () => reject(new Error('Failed to save history'));
  });
}

/**
 * 모든 히스토리 항목을 가져옵니다 (최신순).
 */
export async function getAll(): Promise<HistoryItem[]> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');
    const items: HistoryItem[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    request.onerror = () => reject(new Error('Failed to get history'));
  });
}

/**
 * 특정 히스토리 항목을 가져옵니다.
 */
export async function get(id: string): Promise<HistoryItem | null> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(new Error('Failed to get history item'));
  });
}

/**
 * 히스토리 항목을 삭제합니다.
 */
export async function remove(id: string): Promise<void> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to delete history item'));
  });
}

/**
 * 모든 히스토리를 삭제합니다.
 */
export async function clear(): Promise<void> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to clear history'));
  });
}

/**
 * 히스토리 항목 수를 반환합니다.
 */
export async function count(): Promise<number> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to count history'));
  });
}

/**
 * 100개 초과 시 오래된 항목을 자동 삭제합니다.
 */
async function cleanup(): Promise<void> {
  const total = await count();
  if (total <= MAX_ITEMS) return;

  const items = await getAll();
  const toDelete = items.slice(MAX_ITEMS);

  for (const item of toDelete) {
    await remove(item.id);
  }
}
