
import React from 'react';

const AddTodoEntry = ({onClick}) => {
  let input;

  return (
    <div>
      <input type="text" name="username"/>
      <p>Hello</p>
      <input ref={node => {
          input = node;
        }}/>
      <button onClick={() => {
        onClick(input.value);
        input.value = '';
      }}>
        click Add Todo
      </button>
      <p>World</p>
    </div>
  );
};

export default AddTodoEntry;
