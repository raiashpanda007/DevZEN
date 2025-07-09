import type { Ops, CharObj, InsertTypeOps } from "@workspace/types";

export function applyOps(ops: Ops[], returnArray = false): string | CharObj[] {
  const insertMap = new Map<string, InsertTypeOps>();
  const deleted = new Set<string>();
  const nextMap = new Map<string | null, string[]>();

  // Process operations
  for (const op of ops) {
    if (op.type === "insert") {
      insertMap.set(op.id, op);
      if (!nextMap.has(op.after)) {
        nextMap.set(op.after, []);
      }
      nextMap.get(op.after)!.push(op.id);
    } else if (op.type === "delete") {
      deleted.add(op.id);
    }
  }

  // Sort operations by timestamp within each position
  for (const [after, ids] of nextMap.entries()) {
    ids.sort((a, b) => {
      const opA = insertMap.get(a);
      const opB = insertMap.get(b);
      if (!opA || !opB) return 0;

      // Compare timestamps
      return opA.timeStamp.getTime() - opB.timeStamp.getTime();
    });
  }

  const result: { id: string; value: string }[] = [];

  // Improved traversal function
  function buildOrderedDocument() {
    let currentAfter: string | null = null;

    // Process all characters from the start
    const visited = new Set<string>();
    const queue: (string | null)[] = [null]; // Start with null as the root

    while (queue.length > 0) {
      currentAfter = queue.shift()!;
      const children = nextMap.get(currentAfter) || [];

      for (const childId of children) {
        if (deleted.has(childId) || visited.has(childId)) continue;

        const op = insertMap.get(childId);
        if (!op) continue;

        result.push({ id: childId, value: op.value });
        visited.add(childId);
        queue.push(childId); // Add to queue for breadth-first traversal
      }
    }
  }

  buildOrderedDocument();

  return returnArray ? result : result.map((r) => r.value).join("");
}
