package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"tiktok-messaging-poc/internal/config"
	"tiktok-messaging-poc/internal/tiktok"
	"tiktok-messaging-poc/internal/webhook"
)

func main() {
	cfg := config.LoadConfig()
	client := tiktok.NewClient(cfg)
	marketingClient := tiktok.NewMarketingClient(cfg)
	webhookHandler := webhook.NewWebhookHandler(cfg, client)

	// Middleware for CORS
	enableCORS := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	http.HandleFunc("/webhook", webhookHandler.Handle)

	// API Endpoints
	http.HandleFunc("/api/messages/send", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			BusinessID string `json:"business_id"`
			OpenID     string `json:"open_id"`
			Text       string `json:"text"`
			Type       string `json:"type"` // text, image, etc.
			URL        string `json:"url"`  // for image
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var err error
		switch req.Type {
		case "image":
			err = client.SendImageMessage(req.BusinessID, req.OpenID, req.URL)
		default:
			err = client.SendTextMessage(req.BusinessID, req.OpenID, req.Text)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "sent"})
	}))

	http.HandleFunc("/api/marketing/campaigns", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		advertiserID := r.URL.Query().Get("advertiser_id")
		if advertiserID == "" {
			http.Error(w, "advertiser_id required", http.StatusBadRequest)
			return
		}
		resp, err := marketingClient.GetCampaigns(advertiserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}))

	http.HandleFunc("/api/marketing/report", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		advertiserID := r.URL.Query().Get("advertiser_id")
		reportType := r.URL.Query().Get("report_type")
		dimension := r.URL.Query().Get("dimension")
		startDate := r.URL.Query().Get("start_date")
		endDate := r.URL.Query().Get("end_date")

		if advertiserID == "" || reportType == "" || dimension == "" || startDate == "" || endDate == "" {
			http.Error(w, "missing required query parameters", http.StatusBadRequest)
			return
		}

		resp, err := marketingClient.GetReport(advertiserID, reportType, dimension, startDate, endDate)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}))

	fmt.Printf("Server starting on port %s...\n", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
