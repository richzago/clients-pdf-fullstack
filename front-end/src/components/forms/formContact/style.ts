import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  p,
  h2 {
    color: white;
  }
  border-bottom: 2px dashed #1c6ea4;
  width: 100%;
  padding: 12px;
`;

export const FormStyle = styled.form<React.FormHTMLAttributes<HTMLFormElement>>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  input {
    padding: 3px;
    font-size: 15px;
    border-width: 1px;
    border-color: #ededed;
    background-color: #ffffff;
    color: black;
    border-style: solid;
    border-radius: 8px;
    box-shadow: 0px 0px 11px rgba(66, 66, 66, 0.75);
    text-shadow: -5px 0px 8px rgba(66, 66, 66, 0.75);
    z-index: 9999;
  }
  input:focus {
    outline: none;
  }

  button {
    background-color: rgba(23, 26, 32, 0.8);
    border: none;
    border-radius: 6px;
    color: #fff;
    flex-grow: 1;
    font-family: SFProText-Regular, Helvetica, Arial, sans-serif;
    font-size: 15px;
    height: 36px;
    line-height: 20px;
    margin-left: 8px;
    margin-right: 6px;
    min-width: 185px;
    padding: 0 16px 0 16px;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(23, 26, 32, 1);
    cursor: pointer;
  }

  .error {
    color: red;
    margin: 0;
  }
`;
