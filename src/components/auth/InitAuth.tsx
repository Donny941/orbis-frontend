import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserThunk } from "../../store/thunks/authThunks";

interface InitAuthProps {
  children: React.ReactNode;
}

export const InitAuth = ({ children }: InitAuthProps) => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Se c'è token ma non user, carica l'utente
    if (token && !user) {
      dispatch(fetchUserThunk());
    }
  }, [dispatch, token, user]);

  return <>{children}</>;
};
