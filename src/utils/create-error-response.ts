export interface ErrorMessage {
  error: {
    message: string;
  };
}

const isObject = (data: unknown): data is object => {
  return typeof data === "object" && !!data;
};

export const isErrorMessage = (data: unknown): data is ErrorMessage => {
  return (
    isObject(data) &&
    "error" in data &&
    isObject(data.error) &&
    "message" in data.error &&
    typeof data.error.message === "string"
  );
};

export default function createErrorResponse(message: string): ErrorMessage {
  return {
    error: {
      message,
    },
  };
}
