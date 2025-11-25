# TikTok Business Messaging API PoC Walkthrough

## Prerequisites
- Go installed
- Ngrok installed (`brew install ngrok`)
- TikTok Developer Account & App

## Setup

1.  **Environment Variables**
    Set the following environment variables (you can create a `.env` file or export them in your shell):
    ```bash
    export CLIENT_KEY="your_client_key"
    export CLIENT_SECRET="your_client_secret"
    export ACCESS_TOKEN="your_access_token"
    export VERIFY_TOKEN="your_verify_token"
    export PORT="8080"
    ```

2.  **Start the Server**
    ```bash
    # Terminal 1
    go run ./cmd/server
    ```

3.  **Start the UI**
    ```bash
    # Terminal 2
    cd web
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

4.  **Expose via Ngrok**
    In a separate terminal:
    ```bash
    ngrok http 8080
    ```
    Copy the HTTPS URL (e.g., `https://xxxx.ngrok.io`).

## Verification Steps

### 1. Webhook Verification
1.  Go to your TikTok Developer Portal > App > Webhook.
2.  Enter the Ngrok URL + `/webhook` (e.g., `https://xxxx.ngrok.io/webhook`).
3.  Enter the `VERIFY_TOKEN` you set in step 1.
4.  Click **Verify**.
5.  **Expected Result**: The portal should show success, and your terminal running the Go server should print `Webhook verified successfully!`.

### 2. Receive Messages
1.  Send a message to your test business account on TikTok.
2.  **Expected Result**: Your terminal should log the incoming event and message details:
    ```
    Received event: ...
    Received message from <sender_id>: <text>
    ```

### 3. Send Messages (Manual Trigger)
To test sending a message, you can add a temporary code snippet in `main.go` or use a separate script to call `client.SendTextMessage`.
For example, you can create a `send_test.go` (not included in main build) or just use `curl` if you exposed an endpoint for it (currently not exposed, but the `Client` struct supports it).

## Code Overview
- **`main.go`**: Entry point, starts server.
- **`webhook.go`**: Handles GET (verification) and POST (events).
- **`client.go`**: Contains `SendTextMessage` to reply or send messages.
- **`config.go`**: Loads env vars.
