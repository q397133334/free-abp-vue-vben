interface OAuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
  message?: string;
}

export function useOAuthError() {
  function formatError(error: OAuthError) {
    // TODO: 解决oauth消息国际化.
    return error.message;
  }

  return {
    formatError,
  };
}
