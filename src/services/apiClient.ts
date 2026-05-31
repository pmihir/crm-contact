import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

function toApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Unexpected API error");
}

function normalizeAxiosError(error: AxiosError) {
  if (error.response) {
    return new ApiError(`Request failed with status ${error.response.status}`, error.response.status);
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError("Request timed out");
  }

  if (error.request) {
    return new ApiError("No response received from API");
  }

  return new ApiError(error.message);
}

export async function getJson<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
