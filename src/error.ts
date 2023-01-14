import { Key } from "./types";

export type Issue = { code: string; path: Key[] };

export class TError {
  issues: Issue[] = [];

  get message() {
    return this.issues
      .map((issue) => `[${issue.code}]:[${issue.path}]`)
      .join("\n");
  }

  constructor(issue?: Issue) {
    if (issue) {
      this.issues.push(issue);
    }
  }

  merge(error: TError, path?: Key) {
    if (path) {
      this.issues.push(
        ...error.issues.map((issue) => {
          return {
            ...issue,
            path: [path, ...issue.path],
          };
        }),
      );
    } else {
      this.issues.push(...error.issues);
    }
  }
}
