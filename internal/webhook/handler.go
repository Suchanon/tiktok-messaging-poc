package webhook

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"tiktok-messaging-poc/internal/config"
	"tiktok-messaging-poc/internal/tiktok"
)

type WebhookHandler struct {
	Config *config.Config
	Client *tiktok.Client
}

func NewWebhookHandler(cfg *config.Config, client *tiktok.Client) *WebhookHandler {
	return &WebhookHandler{
		Config: cfg,
		Client: client,
	}
}

func (h *WebhookHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.handleVerification(w, r)
	case http.MethodPost:
		h.handleEvent(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *WebhookHandler) handleVerification(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	mode := query.Get("hub.mode")
	challenge := query.Get("hub.challenge")
	verifyToken := query.Get("hub.verify_token")

	if mode == "subscribe" && verifyToken == h.Config.VerifyToken {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(challenge))
		fmt.Println("Webhook verified successfully!")
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
		fmt.Println("Webhook verification failed.")
	}
}

type WebhookEvent struct {
	Object string `json:"object"`
	Entry  []struct {
		ID        string `json:"id"`
		Time      int64  `json:"time"`
		Messaging []struct {
			Sender struct {
				ID string `json:"id"`
			} `json:"sender"`
			Recipient struct {
				ID string `json:"id"`
			} `json:"recipient"`
			Message struct {
				MID  string `json:"mid"`
				Text string `json:"text"`
			} `json:"message"`
		} `json:"messaging"`
	} `json:"entry"`
}

func (h *WebhookHandler) handleEvent(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var event WebhookEvent
	if err := json.Unmarshal(body, &event); err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
		return
	}

	fmt.Printf("Received event: %+v\n", event)

	// Simple echo logic for demonstration
	for _, entry := range event.Entry {
		for _, messaging := range entry.Messaging {
			senderID := messaging.Sender.ID
			text := messaging.Message.Text
			if text != "" {
				fmt.Printf("Received message from %s: %s\n", senderID, text)
				// In a real app, you'd likely respond here using h.Client.SendTextMessage
				// For now, just logging it.
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}
