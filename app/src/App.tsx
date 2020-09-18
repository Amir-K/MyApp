import { gql, useLazyQuery } from '@apollo/client';
import React, { ChangeEvent, useState } from 'react';
import './App.css';
import { Overlay } from './overlay/Overlay';

const query = gql`
  query GetPerson($input: Float!) {
    person(input: $input) {
      facility {
        val3
      }
      exposure {
        val5
      }
    }
  }
`;

interface IQueryResponse {
  person: {
    facility: { val3: number };
    exposure: { val5: number };
  };
}

function App() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [inputValue, setInputValue] = useState(0);

  const [showOverlay, setShowOverlay] = useState(false);

  const [getQueryResponse, { data }] = useLazyQuery<IQueryResponse>(query);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (value.length > 10) {
      setIsButtonDisabled(true);
      return;
    }

    const numberValue = Number.parseInt(value);

    if (!numberValue) {
      setIsButtonDisabled(true);
      return;
    }

    setInputValue(numberValue);
    setIsButtonDisabled(false);
  }

  function handleButtonClick() {
    getQueryResponse({ variables: { input: inputValue } });
    setShowOverlay(true);
  }

  function handleOverlayOnClose() {
    setShowOverlay(false);
  }

  return (
    <div className="app-container">
      <div>
        <input type="text" onChange={handleInputChange}></input>
        <button disabled={isButtonDisabled} onClick={handleButtonClick}>
          Submit
        </button>
      </div>
      <div className="info-container">
        <p className="info-title">Guides on use</p>
        <p>Enter an integer value and press submit to see the result.</p>
        <p>Examples: 123, 9999, 3000</p>
        <p className="author-text">- Amir Kodro</p>
      </div>
      {data && showOverlay ? (
        <Overlay
          value={data.person.exposure.val5 * data.person.facility.val3}
          onCloseHandler={handleOverlayOnClose}
        />
      ) : null}
    </div>
  );
}

export default App;
