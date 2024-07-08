import { create, StateCreator } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

type CustomMis = [['zustand/devtools', never], ['zustand/persist', unknown]];

export const createStore = <T extends object, U extends object = T>(
    initializer: StateCreator<T, CustomMis>,
    persistOptions: PersistOptions<T, U>, // persist의 옵션 타입 지정
) => create<T, CustomMis>(devtools(persist(initializer, persistOptions)));
