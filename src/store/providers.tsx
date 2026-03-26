import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode, useMemo } from "react";
import { store, persistor } from "./store";
import { hydrateLegacyState } from "./thunks/hydrateLegacyState";

export function AppProviders({ children }: { children: ReactNode }) {
  // PersistGate ko‘proq barqaror bo‘lishi uchun yagona render siklida action dispatch qilamiz.
  const onBeforeLift = useMemo(() => {
    return () => {
      store.dispatch(hydrateLegacyState());
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} onBeforeLift={onBeforeLift}>
        {children}
      </PersistGate>
    </Provider>
  );
}

