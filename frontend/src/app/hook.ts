// In src/app/hook.ts

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";

// Use `withTypes` to create typed versions of the hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>(); 