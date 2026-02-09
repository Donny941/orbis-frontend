import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserThunk } from "../../store/slices/authThunks";
import { Loader2 } from "lucide-react";

interface InitAuthProps {
  children: React.ReactNode;
}

export const InitAuth = ({ children }: InitAuthProps) => {
  const dispatch = useAppDispatch();
  const { token, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserThunk());
    }
  }, [dispatch, token, user]);

  if (token && !user && isLoading) {
    return (
      <div className="app-loading">
        <Loader2 className="spinner" size={48} />
        <p>Loading...</p>
      </div>
    );
  }
  return <>{children}</>;
};
