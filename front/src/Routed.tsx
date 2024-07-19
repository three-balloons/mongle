import { ReactNode } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';

type RoutedProps<TState = unknown> = {
  children: (routeInfo: {
    state: TState;
    hash?: string;
    searchParam: URLSearchParams;
    params: Params<string>;
  }) => ReactNode;
};

export const Routed = <TState,>({ children }: RoutedProps<TState>) => {
  const location = useLocation();
  const hash = window.location.hash === '' ? undefined : window.location.hash.substring(1);
  const searchParam = new URLSearchParams(window.location.search);
  const _params = useParams();
  return children({ state: location.state, hash, searchParam, params: _params });
};
