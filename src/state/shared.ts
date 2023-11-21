import { Signer } from 'ethers';
import { produce } from 'immer';
import {
  BehaviorSubject,
  Observable,
  distinctUntilKeyChanged,
  map,
  filter,
  startWith,
} from 'rxjs';

export type SharedState = {
  address: string | null;
  signer: Signer | null;
  connected: boolean;
};

const INITIAL_STATE: SharedState = {
  address: '',
  signer: null,
  connected: false,
};

const store = new BehaviorSubject<SharedState>(INITIAL_STATE);

type State = (previousState: SharedState) => SharedState;

const dispatch = (state: State) => store.next(state(store.getValue()));

// Selectors
function select(): Observable<SharedState>;
function select<T extends keyof SharedState>(
  stateKey: T,
): Observable<SharedState[T]>;
function select<T extends keyof SharedState>(
  stateKey?: keyof SharedState,
): Observable<SharedState[T]> | Observable<SharedState> {
  if (!stateKey) return store.asObservable();

  const validStateKeys = Object.keys(store.getValue());

  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }

  return store.asObservable().pipe(
    startWith(store.getValue()),
    distinctUntilKeyChanged(stateKey),
    map(x => x?.[stateKey]),
    filter(value => value !== null && value !== undefined),
  ) as Observable<SharedState[T]>;
}

const get = (): SharedState => store.getValue();

// Actions
const connectWallet = (address: string, signer: Signer) => dispatch(state => produce(state, draft => {
  draft.address = address;
  draft.signer = signer;
  draft.connected = true;
}));

const disconnectWallet = () => dispatch(state => produce(state, draft => {
  draft.address = null;
  draft.signer = null;
  draft.connected = false;
}));


export const state = {
  get,
  select,
  actions: {
    connectWallet,
    disconnectWallet,
  },
};
