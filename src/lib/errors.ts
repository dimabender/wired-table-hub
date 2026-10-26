export type ErrorMessage = { field: string | null; message: string };

export class ResponseError extends Error {
  constructor(
    public status: number,
    public messages: ErrorMessage[],
  ) {
    super("Request failed");
  }
}
