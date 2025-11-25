package main

import (
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
	webhookHandler := webhook.NewWebhookHandler(cfg, client)

	http.HandleFunc("/webhook", webhookHandler.Handle)

	fmt.Printf("Server starting on port %s...\n", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
