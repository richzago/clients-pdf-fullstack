import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const FormLogin = styled.form<React.FormHTMLAttributes<HTMLFormElement>>`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;

  p,
  h6,
  h2 {
    color: white;
  }

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
    margin-top: -10px;

    min-width: 185px;
    padding: 0 16px 0 16px;
    color: #ffff;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(23, 26, 32, 1);
    cursor: pointer;
  }

  svg {
    position: absolute;
    top: 152px;
    left: 12px;
    height: 12px;
    border-radius: 7px;
    color: #ffff;
  }

  .btnRegister {
    margin-top: 1rem;
    font-weight: 0;
    font-size: 14px;
    color: #fff;
    background-color: #0066cc;
    padding: 10px 30px;
    border: 2px solid #0066cc;
    box-shadow: rgb(0, 0, 0) 0px 0px 0px 0px;
    border-radius: 50px;
    transition: 1000ms;
    height: 25px;
    transform: translateY(0);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .btnRegister:hover {
    transition: 1000ms;
    padding: 10px 50px;
    transform: translateY(-0px);
    background-color: #fff;
    color: #0066cc;
    border: solid 2px #0066cc;
  }
`;
