/*
============================================================
IRPA DIGITAL GOVERNANCE SYSTEM
APPLICATION CONTROLLER
============================================================

FRONT END:
GitHub Pages

BACK END:
Firebase Authentication
Firebase Firestore

SECURITY:
Firestore Security Rules

AUDIT:
Client users cannot write auditLogs.
Trusted server-side Firebase functions will create
audit records in the production implementation.
============================================================
*/


import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/*
============================================================
FIREBASE CONFIGURATION
============================================================

GET THESE VALUES FROM:

Firebase Console
→ Project Settings
→ Your Apps
→ Web App
→ SDK setup and configuration
============================================================
*/


const firebaseConfig = {

  apiKey:
    "PASTE_FIREBASE_API_KEY_HERE",

  authDomain:
    "PASTE_PROJECT_ID_HERE.firebaseapp.com",

  projectId:
    "PASTE_PROJECT_ID_HERE",

  storageBucket:
    "PASTE_PROJECT_ID_HERE.firebasestorage.app",

  messagingSenderId:
    "PASTE_MESSAGING_SENDER_ID_HERE",

  appId:
    "PASTE_FIREBASE_APP_ID_HERE"

};


/*
============================================================
FIREBASE INITIALIZATION
============================================================
*/


const app =
  initializeApp(firebaseConfig);


const auth =
  getAuth(app);


const db =
  getFirestore(app);


/*
============================================================
DOM
============================================================
*/


const loginScreen =
  document.getElementById(
    "loginScreen"
  );


const appScreen =
  document.getElementById(
    "appScreen"
  );


const googleSignIn =
  document.getElementById(
    "googleSignIn"
  );


const signOutButton =
  document.getElementById(
    "signOut"
  );


const loginMessage =
  document.getElementById(
    "loginMessage"
  );


const userIdentity =
  document.getElementById(
    "userIdentity"
  );


const userRole =
  document.getElementById(
    "userRole"
  );


const workspace =
  document.getElementById(
    "workspace"
  );


const connectionDot =
  document.getElementById(
    "connectionDot"
  );


const connectionText =
  document.getElementById(
    "connectionText"
  );


/*
============================================================
STATUS
============================================================
*/


function setConnectionStatus(
  text
) {

  connectionText.textContent =
    text;

}


/*
============================================================
LOGIN MESSAGE
============================================================
*/


function showLoginMessage(
  text
) {

  loginMessage.textContent =
    text;

}


/*
============================================================
GOOGLE AUTHENTICATION
============================================================
*/


googleSignIn.addEventListener(
  "click",
  async () => {

    try {

      showLoginMessage(
        "Opening secure Google sign-in..."
      );


      const provider =
        new GoogleAuthProvider();


      await signInWithPopup(
        auth,
        provider
      );


    } catch (error) {

      console.error(
        "Sign-in error:",
        error
      );


      showLoginMessage(
        error.message ||
        "Sign-in failed."
      );

    }

  }
);


/*
============================================================
SIGN OUT
============================================================
*/


signOutButton.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(
        "Sign-out error:",
        error
      );

    }

  }
);


/*
============================================================
GET USER GOVERNANCE PROFILE
============================================================

The role is NOT trusted from JavaScript.

The application reads the user's Firestore profile,
while Firestore Security Rules remain the authoritative
security layer.
============================================================
*/


async function loadUserProfile(
  user
) {

  try {

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );


    const snapshot =
      await getDoc(
        userRef
      );


    if (!snapshot.exists()) {

      userRole.textContent =
        "Role: Not registered";


      showLoginMessage(
        "Your Google account is authenticated, but you have not yet been registered as an IRPA governance user."
      );


      return null;

    }


    const profile =
      snapshot.data();


    userRole.textContent =
      `Role: ${
        profile.role ||
        "Not assigned"
      }`;


    return profile;


  } catch (error) {

    console.error(
      "Profile error:",
      error
    );


    userRole.textContent =
      "Role: Unable to verify";


    return null;

  }

}


/*
============================================================
AUTH STATE
============================================================
*/


onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      loginScreen.classList.remove(
        "hidden"
      );


      appScreen.classList.add(
        "hidden"
      );


      setConnectionStatus(
        "Ready"
      );


      return;

    }


    /*
    --------------------------------------------------------
    AUTHENTICATED
    --------------------------------------------------------
    */


    loginScreen.classList.add(
      "hidden"
    );


    appScreen.classList.remove(
      "hidden"
    );


    setConnectionStatus(
      "Authenticated"
    );


    userIdentity.textContent =
      user.email ||
      user.displayName ||
      "Authenticated user";


    await loadUserProfile(
      user
    );

  }
);


/*
============================================================
GOVERNANCE MODULES
============================================================
*/


document
  .querySelectorAll(
    ".module"
  )
  .forEach(
    module => {

      module.addEventListener(
        "click",
        () => {

          const moduleName =
            module.dataset.module;


          openModule(
            moduleName
          );

        }
      );

    }
  );


/*
============================================================
MODULE ROUTER
============================================================
*/


function openModule(
  moduleName
) {

  const titles = {

    meetings:
      "Meetings",

    resolutions:
      "Resolutions",

    votes:
      "Voting",

    actions:
      "Open Actions",

    documents:
      "Documents",

    reports:
      "Reports",

    auditLogs:
      "Audit Logs",

    members:
      "Members"

  };


  const descriptions = {

    meetings:
      "Manage Board meetings, notices, attendance and meeting records.",

    resolutions:
      "Prepare and manage Board resolutions and decision records.",

    votes:
      "Record and review governance voting activity.",

    actions:
      "Track actions arising from Board decisions.",

    documents:
      "Manage controlled Board papers and governance documents.",

    reports:
      "Access governance and performance reports.",

    auditLogs:
      "Protected evidence of governance activity. Audit records cannot be changed by client users.",

    members:
      "Manage governance membership and user profiles according to role permissions."

  };


  workspace.innerHTML = `

    <div class="workspace-placeholder">

      <p class="eyebrow">
        IRPA GOVERNANCE MODULE
      </p>

      <h3>
        ${titles[moduleName]}
      </h3>

      <p>
        ${descriptions[moduleName]}
      </p>

      <p>
        <small>
          Firestore data operations will be connected to this
          module after role and collection testing.
        </small>
      </p>

    </div>

  `;


  workspace.scrollIntoView({
    behavior: "smooth"
  });

}
