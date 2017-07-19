import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import React, {Component} from 'react';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
        size: 11
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

const Link = ({active, children, onClick}) => {
  if (active) {
    return (
      <span>{children}</span>
    )
  }
  return (
    <a href="#"
       onClick={ e => {
         e.preventDefault();
         onClick();
       }}
    >
      {children}
    </a>
  )
}

// Container Component
class FilterLink extends Component {

  componentDidMoount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componenentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {filter, children} = this.props;
    const {visibilityFilter} = store.getState();

    return (
      <Link
        active={filter === visibilityFilter}
        onClick={ () => store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
        }
      >
        {children}
      </Link>
    );
  }
}

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'>
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_ACTIVE'>
      Active
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_COMPLETED'>
      Completed
    </FilterLink>
  </p>

)

const Todo = ({onClick, color, completed, text, size}) => {
  console.log('completed', completed);
  console.log('text', text);
  console.log('color', color);
  console.log('size: ', size);
  return (
    <li
      onClick={onClick}
      style={{textDecoration: completed ? 'line-through' : 'none'}}>
      {text}
    </li>
  );

};

// all the props are contained in one object
const TodoList = ({todos, onTodoClick, color}) => {
  console.log('todos', todos);
  return (
    <ul>
      {todos.map(todo => {
          console.log('todo:', todo);
          console.log('{...todo}:', {...todo});
          return (<Todo
            key={todo.id}
            color={color}

            {...todo} // this spreads the properties of this object as props of Todo

            onClick={() => {
              onTodoClick(todo.id);
            }}
          />);
        }
      )}
    </ul>
  );
};

// onAddClick is passed in as a prop.
// It is a function that has one parameter and it sends a dispatch to store to add a new todo
const AddTodo = () => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }}/>
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        });
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {todos, visibilityFilter} = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={ id =>
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
        }
      />
    );

  }
}

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    const {todos, visibilityFilter} = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

    return (
      <div>
        <AddTodo onAddClick={text => store.dispatch({
          type: 'ADD_TODO',
          text: text,
          id: nextTodoId++
        })
        }/>
        <TodoList
          color="red"
          todos={visibleTodos}
          onTodoClick={ id => {
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
          }}
        />
        <Footer
          visibilityFilter={visibilityFilter}
          onFilterClick={filter =>
            store.dispatch({
              type: 'SET_VISIBILTY_FILTER',
              filter
            })
          }
        />
      </div>
    );
  };
}
;

const TodoApp = () => (
  <div>
    <AddTodo/>
    <VisibleTodoList/>
    <Footer/>
  </div>
)


ReactDOM.render(
  <TodoApp/>,
  document.getElementById('root')
);

