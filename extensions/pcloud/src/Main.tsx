import React, { useEffect } from "react";
import { FileList } from "./components/FileList";
import { oauth } from "./utils/oauth";
import { useConfigProvider } from "./providers/ConfigProvider";
import { useLoading } from "./hooks/useLoading";
import { showToast, Toast } from "@raycast/api";

export default function Main() {
  const { loading: oAuthLoading, withLoading: withOAuthLoading } = useLoading({ initialValue: true });
  const {
    updateToken,
    config: { isEuropeRegion },
  } = useConfigProvider();

  useEffect(() => {
    void withOAuthLoading(
      oauth({ isEuropeRegion })
        .then((token) => {
          if (token) updateToken(token);
        })
        .catch((err) => {
          return showToast({
            message: `Failed to authenticate with pCloud: ${err.message}`,
            title: "Error",
            style: Toast.Style.Failure,
          });
        })
    );
  }, [isEuropeRegion, updateToken, withOAuthLoading]);

  return <FileList isLoading={oAuthLoading} />;
}
