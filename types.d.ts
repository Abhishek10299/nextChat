import { Connection } from "mongoose";

declare global {
  var mongose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};
