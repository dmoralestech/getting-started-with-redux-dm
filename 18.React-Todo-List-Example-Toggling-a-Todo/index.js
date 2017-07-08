import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import React, {Component} from 'react';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
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

const visibilityFilter = (state = 'SHOW_ALL',
                          action) => {
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

let nextTodoId = 0;
class TodoApp extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    console.log('element', e);
    console.log('target: ', e.target);
    console.log('value: ', e.target.value);
  }

  render() {
    function onChange2(e) {
      console.log('element', e);
      console.log('target: ', e.target);
      console.log('value: ', e.target.value);
    }
    return (
      <div>
        <input type="text" name="username" onChange={onChange2}/>
        <input type="checkbox" onChange={this.onChange}/>
        <input type="color" onChange={this.onChange}/>
        <input type="date" onChange={this.onChange}/>
        <input type="datetime-local" onChange={this.onChange}/>
        <input type="file" onChange={this.onChange}/>
        <input type="image" onChange={this.onChange}/>
        <input type="month" onChange={this.onChange}/>
        <input type="number" onChange={this.onChange}/>
        <input type="password" onChange={this.onChange}/>
        <input type="radio" onChange={this.onChange}/>
        <input type="range" onChange={this.onChange}/>
        <input type="reset" onChange={this.onChange}/>
        <input type="search" onChange={this.onChange}/>
        <input type="time" onChange={this.onChange}/>
        <input type="url" onChange={this.onChange}/>
        <input type="tel" onChange={this.onChange}/>

        <form action="">
          <input type="radio" name="gender" value="male" onChange={this.onChange}/> Male<br/>
          <input type="radio" name="gender" value="female" onChange={this.onChange}/> Female<br/>
        </form>

        <select onChange={this.onChange}>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="opel">Opel</option>
          <option value="audi">Audi</option>
        </select>

        <p>Hello</p>
        <input ref={node => {
          this.input = node;  // 紀錄 input 的節點
        }}/>
        <button onClick={() => {  // 新增 Todo 的 button
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,  // 取得 input 的值
            id: nextTodoId++
          });
          this.input.value = '';  // 清除 input 的值
        }}>
          Add Todos
        </button>
        <ul>
          {this.props.todos.map(todo => {  // todo 列表
            return (
              <li key={todo.id}
                  onClick={() => {  // 點擊 todo 可以 uncompleted/completed todo
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      id: todo.id
                    });
                  }}
                  style={{  // completed 時, 把 todo 畫上刪節符號
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}>
                {todo.text}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}
;

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos}/>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
