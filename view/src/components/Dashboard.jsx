import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

function Dashboard() {
  const [askForCredentials, setAskForCredentials] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getProtectedResource = async (authHeaderStr) => {
    try {
      const response = authHeaderStr
        ? await fetch("http://localhost:3000/api/user/protected-resource", {
            headers: {
              Authorization: authHeaderStr,
            },
          })
        : await fetch("http://localhost:3000/api/user/protected-resource");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized request");
        }
        if (response.status === 500) {
          throw new Error("Something went wrong.");
        }
      }
      const data = await response.json();
      setAskForCredentials(false);
      setData(data.message);
    } catch (err) {
      setAskForCredentials(true);
      setErrorMsg(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const authHeaderStr = `Basic ${btoa(username)}:${btoa(password)}`;
    getProtectedResource(authHeaderStr);
  };

  return (
    <Wrapper>
      <Header>Dashboard</Header>
      <p>
        This is a protected resource. Please provide your credentials to access
        it.
      </p>
      {data && <ProtectedText>{data}</ProtectedText>}
      {!data && !askForCredentials && (
        <>
          <LoginForm onSubmit={handleSubmit}>
            <LoginFormHeader>Login</LoginFormHeader>
            <LoginFormItem>
              <label>Username:</label>
              <input
                name="username"
                value={username}
                onChange={(e) => handleInputChange(e)}
                type="text"
              />
            </LoginFormItem>
            <LoginFormItem>
              <label>Password:</label>
              <input
                name="password"
                value={password}
                onChange={(e) => handleInputChange(e)}
                type="password"
              />
            </LoginFormItem>
            <SubmitButton type="submit">Submit</SubmitButton>
            <LinkItem>
              Don{"'"}t have an account? <NavLink to="/signup">Signup</NavLink>
            </LinkItem>
          </LoginForm>
          {errorMsg && <p>{errorMsg}</p>}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  padding: 40px;
`;

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bolder;
  padding: 12px 0;
`;

const LoginForm = styled.form`
  background-color: #4474c2;
  max-width: 350px;
  margin: 40px auto;
  padding: 16px;
  border-radius: 12px;
  color: white;
`;

const LoginFormHeader = styled.h2`
  font-size: 1.45rem;
  font-weight: bold;
  padding: 12px 0;
  text-align: center;
`;

const LoginFormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 12px 0;

  & > input {
    flex-grow: 1;
  }
`;

const SubmitButton = styled.button`
  display: block;
  margin: 5px auto;
  margin-bottom: 20px;
  padding: 5px 12px;
  background-color: #afc1de;
  border: 2px solid #2f353d;
  cursor: pointer;
`;

const LinkItem = styled.p`
  text-align: center;
`;

const ProtectedText = styled.p`
  font-style: italic;
  color: green;
`;

export default Dashboard;
