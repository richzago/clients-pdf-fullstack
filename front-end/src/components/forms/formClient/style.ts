import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
export const FormStyle = styled.form<React.FormHTMLAttributes<HTMLFormElement>>`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 2rem 0;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  input {
    min-width: 190px;
    padding: 5px;
    font-size: 16px;
    border-width: 1px;
    border-color: #f9f7f7;
    background-color: #ffffff;
    color: #000000;
    border-style: solid;
    border-radius: 0px;
    box-shadow: 0px 0px 5px rgba(66, 66, 66, 0.22);
  }
  input:focus {
    outline: none;
  }

  p,
  h2 {
    color: #ffff;
  }

  .btn {
    margin-bottom: 1.5rem;
    font-weight: 0;
    font-size: 14px;
    color: #fff;
    background-color: #0066cc;
    padding: 10px 30px;
    border: 2px solid #0066cc;
    box-shadow: rgb(0, 0, 0) 0px 0px 0px 0px;
    border-radius: 50px;
    transition: 1000ms;
    transform: translateY(0);
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .btn:hover {
    transition: 1000ms;
    padding: 10px 50px;
    transform: translateY(-0px);
    background-color: #fff;
    color: #0066cc;
    border: solid 2px #0066cc;
  }

  .btnback {
    font-weight: bolder;
    font-size: 14px;
    color: #000000;
    background-color: #fff;
    padding: 5px 15px;
    border: 2px solid #0066cc;
    box-shadow: rgb(0, 0, 0) 0px 0px 0px 0px;
    border-radius: 50px;
    transition: 1000ms;
    transform: translateY(0);
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .btnback:hover {
    transition: 1000ms;
    padding: 10px 20px;
    transform: translateY(-0px);
    background-color: #fff;
    color: #0066cc;
    border: solid 2px #0066cc;
  }

  .error {
    color: red;
  }
`;
