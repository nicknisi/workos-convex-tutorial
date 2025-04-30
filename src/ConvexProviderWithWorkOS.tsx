import { ReactNode, useCallback, useMemo } from "react";
import { AuthTokenFetcher } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";

type IConvexReactClient = {
  setAuth(fetchToken: AuthTokenFetcher): void;
  clearAuth(): void;
};

// Modified to match WorkOS's auth hook structure
type UseAuth = () => {
  isLoading: boolean;
  user: any | null;
  getAccessToken: () => Promise<string | null>;
};

export function ConvexProviderWithWorkOS({
  children,
  client,
  useAuth,
}: {
  children: ReactNode;
  client: IConvexReactClient;
  useAuth: UseAuth;
}) {
  const useAuthFromWorkOS = useUseAuthFromWorkOS(useAuth);
  return (
    <ConvexProviderWithAuth client={client} useAuth={useAuthFromWorkOS}>
      {children}
    </ConvexProviderWithAuth>
  );
}

function useUseAuthFromWorkOS(useAuth: UseAuth) {
  return useMemo(
    () =>
      function useAuthFromWorkOS() {
        const { isLoading, user, getAccessToken } = useAuth();

        // This is the key part that matches Clerk's implementation
        const fetchAccessToken = useCallback(
          async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
            try {
              console.log("Fetching token, force refresh:", forceRefreshToken);
              const token = await getAccessToken();
              console.log("Token fetched:", !!token);
              return token;
            } catch (error) {
              console.error("Token fetch error:", error);
              return null;
            }
          },
          [getAccessToken],
        );

        return useMemo(
          () => ({
            isLoading,
            isAuthenticated: !!user,
            fetchAccessToken,
          }),
          [isLoading, user, fetchAccessToken],
        );
      },
    [useAuth],
  );
}
