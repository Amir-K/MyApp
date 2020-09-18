import React from 'react';
import './Overlay.css';

export function Overlay(props: {
  value: number;
  onCloseHandler: (input: any) => any;
}): JSX.Element {
  return (
    <div className="overlay">
      <div className="content">
        <h1>Result</h1>
        <h2>{props.value}</h2>
        <button onClick={props.onCloseHandler}>Close</button>
      </div>
    </div>
  );
}
