// Import necessary AWS SDK components and types
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AuthFlowType,
  GetUserCommand,
  GetUserCommandOutput,
  ResendConfirmationCodeCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "@/config.json";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
const idToken: string | null = sessionStorage.getItem('idToken');
const identityClient = new CognitoIdentityClient({ region: 'ap-south-1' });

const Credentials = fromCognitoIdentityPool({
  client: identityClient,
  identityPoolId: 'ap-south-1:0552001a-378b-4154-be28-84a0ea5b9f10',
  logins: {
    'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_epWmiSTO9': idToken as string,
  },
});


export default Credentials;
// Initialize Cognito Client
export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: Credentials,
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

export const resendConfirmationCode = async (username: string) => {
  try {
    const params = {
      ClientId: "29ii26cp64enchfiq0g14v5ls3", // Your Cognito App Client ID
      Username: username,
    };

    // Call the AWS SDK API to resend the confirmation code
    const command = new ResendConfirmationCodeCommand(params);
    const data = await cognitoClient.send(command);

    console.log("Confirmation code resent successfully", data);
    return data; // You can return the response if needed
  } catch (error) {
    console.error("Error resending confirmation code", error);
    throw new Error("Failed to resend confirmation code. Please try again later.");
  }
};

export const requestPasswordReset = async (username: string) => {
  const command = new ForgotPasswordCommand({
    ClientId: "29ii26cp64enchfiq0g14v5ls3",
    Username: username,
  });

  try {
    const response = await cognitoClient.send(command);
    console.log("Password reset requested:", response);
    return response;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export const confirmPasswordReset = async (username: string, code: string, newPassword: string) => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: "29ii26cp64enchfiq0g14v5ls3",
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  });

  try {
    const response = await cognitoClient.send(command);
    console.log("Password reset confirmed:", response);
    return response;
  } catch (error) {
    console.error("Error confirming password reset:", error);
    throw error;
  }
};