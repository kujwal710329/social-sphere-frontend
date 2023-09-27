import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [picture, setPicture] = useState("");
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (e) => {
    const savedUserResponse = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        location,
        occupation,
        picturePath: picture.name,
      }),
    });
    // const savedUser = await savedUserResponse.json();
    const savedUser = savedUserResponse;
    window.alert("Account created successfully");
    if (savedUser) {
      setPageType("login");
    }
  };
  // const login = async (e) => {
  //   const loggedInResponse = await fetch("/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   console.log(loggedInResponse);
  //   const loggedIn = await loggedInResponse.json();
  //   console.log(loggedIn);

  //   if (loggedIn) {
  //     dispatch(
  //       setLogin({
  //         user: loggedIn.user,
  //         token: loggedIn.token,
  //       })
  //     );
  //     navigate("/home");
  //   }
  // };

  const login = async (e) => {
    const loggedInResponse = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (loggedInResponse.status === 200) {
      // Check if response body is empty
      const contentType = loggedInResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const loggedIn = await loggedInResponse.json();
          console.log(loggedIn);

          if (loggedIn) {
            dispatch(
              setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
              })
            );
            navigate("/home");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        // Handle empty response body or non-JSON response here
        console.error("Empty or non-JSON response");
      }
    } else {
      // Handle error here, e.g., show an error message
      console.error("Login failed. Status code:", loggedInResponse.status);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) await login(e);
    if (isRegister) await register(e);

    setEmail("");
    setPassword("");
  };
  return (
    <form
      onSubmit={(e) => {
        handleFormSubmit(e);
      }}
    >
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "&>div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {isRegister && (
          <>
            <TextField
              type="text"
              label="First Name"
              value={firstName}
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              name="lastName"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Location"
              value={location}
              name="location"
              type="text"
              onChange={(e) => setLocation(e.target.value)}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Occupation"
              value={occupation}
              name="occupation"
              type="text"
              onChange={(e) => setOccupation(e.target.value)}
              sx={{ gridColumn: "span 4" }}
            />
            <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem">
              <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}>
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}>
                    <input {...getInputProps()} />
                    {!picture ? (
                      <p>Add picture here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{picture.name}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
          </>
        )}
        <TextField label="email" value={email} name="email" type="email" onChange={(e) => setEmail(e.target.value)} sx={{ gridColumn: "span 4" }} />
        <TextField
          label="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          sx={{ gridColumn: "span 4" }}
        />
      </Box>
      {/* buttons */}
      <Box>
        <Button
          fullWidth
          type="submit"
          sx={{ m: "2rem 0", p: "1rem", backgroundColor: palette.primary.main, color: palette.background.alt, "&:hover": { color: palette.primary.main } }}
        >
          {isLogin ? "LOGIN" : "REGISTER"}
        </Button>
        <Typography
          onClick={() => {
            setPageType(isLogin ? "register" : "login");
          }}
          sx={{
            textDecoration: "underline",
            color: palette.primary.main,
            "&:hover": {
              cursor: "pointer",
              color: palette.primary.light,
            },
          }}
        >
          {isLogin ? "Don't have an account? sign up here." : "Already have an account? Login here."}
        </Typography>
      </Box>
    </form>
  );
};

export default Form;
