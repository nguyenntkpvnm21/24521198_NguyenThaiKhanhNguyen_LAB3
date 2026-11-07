/**
 * First-in, first-out queue for recorded notes.
 * enqueue() adds at the tail, dequeue() removes from the head.
 */
export class NoteQueue {
  #items = [];

  get size() {
    return this.#items.length;
  }

  enqueue(item) {
    this.#items.push(item);
    return this.#items.length;
  }

  dequeue() {
    return this.#items.shift();
  }

  peek() {
    return this.#items[0];
  }

  clear() {
    this.#items.length = 0;
  }

  /** Copy of the queued items, head first. */
  toArray() {
    return [...this.#items];
  }

  static from(items) {
    const queue = new NoteQueue();
    for (const item of items) {
      queue.enqueue(item);
    }
    return queue;
  }
}