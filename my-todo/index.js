import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';

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

// // Container Component
// class FilterLink extends Component {
//
//   componentDidMoount() {
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     );
//   }
//
//   componenentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const {store} = this.context;
//     const {filter, children} = this.props;
//     const {visibilityFilter} = store.getState();
//
//     return (
//       <Link
//         active={filter === visibilityFilter}
//         onClick={ () => store.dispatch({
//           type: 'SET_VISIBILITY_FILTER',
//           filter
//         })
//         }
//       >
//         {children}
//       </Link>
//     );
//   }
// }
// FilterLink.contextTypes = {
//   store: React.PropTypes.object
// }

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({type: 'SET_VISIBILITY_FILTER', filter: ownProps.filter})
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);


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

let nextTodoId = 0;
// onAddClick is passed in as a prop.
// It is a function that has one parameter and it sends a dispatch to store to add a new todo
let  AddTodo = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }}/>
      <button onClick={() => {
        dispatch({
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

// AddTodo.contextTypes = {
//   store: React.PropTypes.object
// }

AddTodo = connect()(AddTodo);

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

//       this.forceUpdate());
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const {store} = this.context;
//     const {todos, visibilityFilter} = store.getState();
//
//     return (
//       <TodoList
//         todos={getVisibleTodos(todos, visibilityFilter)}
//         onTodoClick={ id =>
//           store.dispatch({
//             type: 'TOGGLE_TODO',
//             id
//           })
//         }
//       />
//     );
//
//   }
// }
//
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// }

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch({type: 'TOGGLE_TODO', id})
    }
  };
};

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// class Provider extends Component {
//   getChildContext() {
//     return {
//       store: this.props.store
//     };
//   }
//
//   render() {
//     return this.props.children;
//   }
// }

// Provider.childContextTypes = {
//   store: React.PropTypes.object
// };

class DisplayExample extends Component {

  input;

  state = {
    displayValue: ''
  };

  render() {
    return (
      <div>
        <input ref={node => {
          input = node;
        }} onChange={() => this.setState({displayValue: this.input.value}) }/>

        <Preview displayValue={this.state.displayValue}> </Preview>
      </div>
    );
  }
}

class DisplayExample2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      givenName: '',
      surname: ''
    };
  }

  render() {
    return (
      <div>
        <input name="inputValue" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
        <input name="givenName" value={this.state.givenName} onChange={evt => this.updateInputValue(evt)}/>
        <input name="surname" value={this.state.surname} onChange={evt => this.updateInputValue(evt)}/>
        <Preview inputValue={this.state.inputValue}
                 givenName={this.state.givenName}
                 surname={this.state.surname}
                 fullData={this.state}
        />
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }
}

const Preview = ({inputValue, givenName, surname, fullData}) => {
  return (
    <div>
      <h1>{fullData.inputValue}</h1>
      <h2>{fullData.givenName}</h2>
      <h3>{fullData.surname}</h3>
    </div>
  );
}

const TodoApp = () => (
  <div>
    <AddTodo/>
    <VisibleTodoList/>
    <Footer/>
    <DisplayExample2/>
  </div>
)


ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp/>
  </Provider>,
  document.getElementById('root')
);

