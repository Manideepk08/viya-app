# Viya App - Backend Task Breakdown

This document outlines the division of work for the Viya app's backend development. The work is divided into three main modules, with each module assigned to a different teammate.

---

### Teammate 1: Core User & Authentication

This teammate will focus on the foundational features of the app: user registration, login, profile management, and security.

*   **`Backend/controllers/auth.controller.js`**:
    *   **`register(req, res)`**: Handle new user registration. It will take `email` or `mobile` and initiate the OTP process.
    *   **`login(req, res)`**: Handle user login. It will also use an OTP-based flow.
    *   **`verifyOtp(req, res)`**: Verify the OTP sent to the user. On successful verification, it will generate a JWT (JSON Web Token) and send it back to the user.
    *   **`resendOtp(req, res)`**: Allow the user to request a new OTP.

*   **`Backend/controllers/user.controller.js`**:
    *   **`getProfile(req, res)`**: Fetch the profile of the currently logged-in user.
    *   **`updateProfile(req, res)`**: Update the user's profile information. This will handle all the fields from the `user.model.js`, from basic info to photos.
    *   **`checkProfileCompleteness(req, res)`**: A helper to check if the user's profile is complete.

*   **`Backend/services/otp.service.js`**:
    *   **`generateOtp()`**: Create a new, random OTP.
    *   **`sendOtp(destination, otp)`**: (Optional, for later) Integrate with an SMS/email gateway to send the OTP. For now, it can just log the OTP to the console for testing.

*   **`Backend/middleware/auth.js`**:
    *   **`verifyToken(req, res, next)`**: A middleware function to protect routes. It will check for a valid JWT in the request headers and attach the user's ID to the request object (`req.user`).

*   **`Backend/routes/auth.js`**:
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
    *   `POST /api/auth/verify-otp`
    *   `POST /api/auth/resend-otp`

*   **`Backend/routes/users.js`**:
    *   `GET /api/users/me` (Protected by `verifyToken` middleware)
    *   `PUT /api/users/me` (Protected by `verifyToken` middleware)

---

### Teammate 2: Matchmaking & Discovery

This teammate is responsible for the core "matching" feature, allowing users to discover potential partners based on various criteria.

*   **`Backend/controllers/discovery.controller.js`**:
    *   **`getMatches(req, res)`**: Get a list of recommended profiles for the current user based on the matching algorithm.
    *   **`searchProfiles(req, res)`**: Allow users to search for other profiles using filters like `city`, `occupation`, `education`, etc.
    *   **`getPublicProfile(req, res)`**: Fetch a limited, public view of another user's profile.

*   **`Backend/services/match.service.js`**:
    *   **`calculateMatchScore(currentUser, otherUser)`**: The core logic. This service will contain the algorithm to determine how good a match is between two users. It will consider factors like location, interests, education, and other preferences.

*   **`Backend/routes/discovery.js`**:
    *   `GET /api/discovery/matches` (Protected)
    *   `POST /api/discovery/search` (Protected)
    *   `GET /api/discovery/profile/:userId` (Protected)

---

### Teammate 3: User Interactions & Notifications

This teammate will build the features that allow users to interact with each other, such as sending interests, managing connections, and receiving notifications.

*   **`Backend/models/interaction.model.js`** (New File):
    *   A new Mongoose schema to track interactions. It could look like this:
        ```javascript
        {
          fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
          toUser: { type: Schema.Types.ObjectId, ref: 'User' },
          type: { type: String, enum: ['interest', 'block', 'report'] },
          status: { type: String, enum: ['pending', 'accepted', 'declined'] }, // for interests
          message: { type: String } // for reports
        }
        ```

*   **`Backend/controllers/interaction.controller.js`**:
    *   **`sendInterest(req, res)`**: Allow a user to send an interest request to another user.
    *   **`respondToInterest(req, res)`**: Let a user accept or decline an interest request.
    *   **`blockUser(req, res)`**: Block another user to prevent any further interaction.
    *   **`getInterests(req, res)`**: Get a list of received or sent interests.

*   **`Backend/services/notification.service.js`**:
    *   **`createNotification(userId, message)`**: A service to create a notification for a user (e.g., "You have a new interest!"). This can be expanded later to support push notifications.

*   **`Backend/routes/interactions.js`**:
    *   `POST /api/interactions/interest` (Protected)
    *   `POST /api/interactions/respond` (Protected)
    *   `POST /api/interactions/block` (Protected)
    *   `GET /api/interactions/` (Protected)

---

### Teammate 4: Payments & Subscriptions

This teammate will be responsible for integrating with a payment gateway, processing transactions, and managing user subscriptions or premium features.

*   **`Backend/models/payment.model.js`** (New File):
    *   A new Mongoose schema to log every transaction. This is crucial for record-keeping and debugging.
        ```javascript
        const paymentSchema = new Schema({
          userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          amount: { type: Number, required: true },
          currency: { type: String, default: 'INR' },
          paymentGateway: { type: String }, // e.g., 'Stripe', 'Razorpay'
          transactionId: { type: String, unique: true },
          orderId: { type: String }, // ID from the payment gateway
          status: { type: String, enum: ['created', 'successful', 'failed'], required: true },
        }, { timestamps: true });
        ```

*   **`Backend/controllers/payment.controller.js`**:
    *   **`createOrder(req, res)`**: This will create a payment order with the chosen payment gateway (like Razorpay or Stripe). It will then send the `order_id` and other necessary details to the frontend to initialize the payment process.
    *   **`verifyPayment(req, res)`**: After the user completes the payment on the frontend, the frontend will send back a payment signature and other details. This function will verify that signature on the backend to confirm the payment is authentic and successful.
    *   **`getPaymentHistory(req, res)`**: Fetches a list of all past payments for the logged-in user.

*   **`Backend/services/payment.service.js`**:
    *   **`createGatewayOrder(amount, currency)`**: This service will contain the core logic for interacting with the payment gateway's API or SDK to create a new order.
    *   **`verifyGatewaySignature(gatewayResponse)`**: This will hold the logic to verify the cryptographic signature sent by the payment gateway. This is a critical security step.

*   **`Backend/routes/payment.js`**:
    *   `POST /api/payments/create-order` (Protected)
    *   `POST /api/payments/verify` (Protected)
    *   `GET /api/payments/history` (Protected) 