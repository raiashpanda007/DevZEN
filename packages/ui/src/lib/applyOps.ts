import type { Ops, CharObj, InsertTypeOps } from "@workspace/types";

export function applyOps(ops: Ops[], returnArray = false): string | CharObj[] {
  const insertMap = new Map<string, InsertTypeOps>();
  const deleted = new Set<string>();
  const nextMap = new Map<string | null, string[]>();

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

  const result: { id: string; value: string }[] = [];

  function walk(after: string | null) {
    const children = nextMap.get(after);
    if (!children) return;
    for (const id of children) {
      if (!deleted.has(id)) {
        const op = insertMap.get(id);
        if (!op) return;
        result.push({
          id: op.id,
          value: op.value,
        });
      }
      walk(id); // DFS
    }
  }

  walk(null);

  return returnArray ? result : result.map((r) => r.value).join("");
}
