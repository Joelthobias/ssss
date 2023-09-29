var firebase = require('firebase');
var firebaseui = require('firebaseui');
const { getAuth, signInWithPopup, FacebookAuthProvider }=require("firebase/auth");

const provider = new FacebookAuthProvider();
const auth = getAuth();
signInWithPopup(auth, provider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
    });








var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'localhost:7081',
    signInOptions: [
        {
            provider: firebase.auth.FacebookAuthProvider.process.env.FBAPPID,
            scopes: [
                'public_profile',
                'email'
            ],
            customParameters: {
                // Forces password re-entry.
                auth_type: 'reauthenticate'
            }
        }
    ]
};
ui.start('#firebaseui-auth-container',uiConfig);