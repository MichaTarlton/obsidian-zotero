import type { GeneralItem } from "@obzt/zotero-type";
import type Fuse from "fuse.js";
import type { DbWorkerAPI } from "@api";
import { cache } from "@init";

const query: DbWorkerAPI["query"] = (libId, pattern, options) => {
  const fuse = cache.items.get(libId)?.fuse;
  if (!fuse) {
    throw new Error("Query before init");
  }
  let result: Fuse.FuseResult<GeneralItem>[];
  if (pattern === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let docs = (fuse as any)?._docs as GeneralItem[] | undefined;
    if (!docs) {
      result = [];
    } else {
      options?.limit !== undefined && (docs = docs.slice(0, options.limit));
      result = docs.map((item, index) => ({
        item,
        refIndex: index,
      }));
    }
  } else result = fuse.search(pattern, options);
  return result;
};
export default query;