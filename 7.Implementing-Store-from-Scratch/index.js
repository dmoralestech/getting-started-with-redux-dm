
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// createStore returns an object with 3 functions: getState, dispatch and subscribe
// getState returns the contents of the current state object
// dispatch gets the new state by calling the reducer with the new action and call each listener because there's a change
// subscribe makes you add listener to the store. it also returns an unsubscribe function.
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {  // 回傳 function ，作為移除 listener 使用。
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});  // 初始化 state

  return { getState, dispatch, subscribe };
}

const store = createStore(counter);

const render = () => {
  document.body.innerHTML = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});
