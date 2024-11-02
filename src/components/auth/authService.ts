// Import necessary AWS SDK components and types
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AuthFlowType,
  GetUserCommand,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "@/config.json";

// Initialize Cognito Client
export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

// Utility function to parse JWT and extract payload
const parseJwt = (token: string): { [key: string]: any } => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};


// SignIn Function: Authenticate user and store tokens and user sub in sessionStorage
export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (AuthenticationResult) {
      // Save tokens in session storage
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
      sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || "");
      sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || "");

      // Parse ID token to get user sub and store it in sessionStorage
      const decodedToken = parseJwt(AuthenticationResult.IdToken || "");
      const userSub = decodedToken.sub;
      sessionStorage.setItem("userSub", userSub);

      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

// SignUp Function: Register a new user
export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

// ConfirmSignUp Function: Verify user's email with the confirmation code
export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: config.clientId,
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};

// Function to log out the user and clear session storage
export const signOut = () => {
  sessionStorage.removeItem("idToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("userSub");
  console.log("User signed out");
};

export const getUserId = async (accessToken: string): Promise<string | null> => {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response: GetUserCommandOutput = await cognitoClient.send(command);
    const userId = response.UserAttributes?.find(attr => attr.Name === "sub")?.Value || null;

    return userId;
  } catch (error) {
    console.error("Error getting user ID: ", error);
    return null;
  }
};

