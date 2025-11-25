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
				MID   string `json:"mid"`
				Type  string `json:"type"`
				Text  string `json:"text,omitempty"`
				Image *struct {
					URL string `json:"url"`
				} `json:"image,omitempty"`
				Product *struct {
					ProductID string `json:"product_id"`
				} `json:"product_card,omitempty"`
				Order *struct {
					OrderID string `json:"order_id"`
				} `json:"order_card,omitempty"`
				Coupon *struct {
					CouponID string `json:"coupon_id"`
				} `json:"coupon_card,omitempty"`
				ReturnRefundCard *struct {
					ReturnRefundID string `json:"return_refund_id"`
				} `json:"return_refund_card,omitempty"`
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
			msgType := messaging.Message.Type

			fmt.Printf("Received message type '%s' from %s\n", msgType, senderID)

			switch msgType {
			case "text":
				fmt.Printf("Text: %s\n", messaging.Message.Text)
			case "image":
				if messaging.Message.Image != nil {
					fmt.Printf("Image URL: %s\n", messaging.Message.Image.URL)
				}
			case "product_card":
				if messaging.Message.Product != nil {
					fmt.Printf("Product ID: %s\n", messaging.Message.Product.ProductID)
				}
				// Add other cases as needed
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}
