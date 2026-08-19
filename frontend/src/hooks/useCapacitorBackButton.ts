import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useCapacitorBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listenerHandler: any = null;

    const setupListener = async () => {
      try {
        // Dynamically import @capacitor/app to prevent SSR or web build issues
        // @ts-ignore
        const { App } = await import("@capacitor/app");

        listenerHandler = await App.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
          const path = location.pathname;

          // Define root entry routes where pressing back should exit app
          const isRootPage =
            path === "/" ||
            path === "/app-launcher" ||
            path === "/farmer" ||
            path === "/provider" ||
            path === "/admin" ||
            path === "/login";

          if (isRootPage) {
            // Exit app cleanly on main root screens
            App.exitApp();
          } else if (canGoBack || window.history.length > 1) {
            // Go back in webview history
            navigate(-1);
          } else {
            // Fallback to launcher or exit
            App.exitApp();
          }
        });
      } catch (err) {
        // Graceful fallback on standard web browsers where @capacitor/app is absent
      }
    };

    setupListener();

    return () => {
      if (listenerHandler && typeof listenerHandler.remove === "function") {
        listenerHandler.remove();
      }
    };
  }, [navigate, location]);
}
