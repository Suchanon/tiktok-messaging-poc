package tiktok

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"tiktok-messaging-poc/internal/config"
)

const (
	BaseURL = "https://business-api.tiktok.com/open_api/v1/business_messages"
)

type Client struct {
	Config *config.Config
	HTTP   *http.Client
}

func NewClient(cfg *config.Config) *Client {
	return &Client{
		Config: cfg,
		HTTP:   &http.Client{},
	}
}

type MessageRequest struct {
	BusinessID string `json:"business_id"`
	Recipient  struct {
		OpenID string `json:"open_id"`
	} `json:"recipient"`
	Message struct {
		Type string `json:"type"`
		Text string `json:"text,omitempty"`
	} `json:"message"`
}

func (c *Client) SendTextMessage(businessID, openID, text string) error {
	reqBody := MessageRequest{
		BusinessID: businessID,
	}
	reqBody.Recipient.OpenID = openID
	reqBody.Message.Type = "text"
	reqBody.Message.Text = text

	data, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/messages/send/", BaseURL)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Access-Token", c.Config.AccessToken)

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send message, status: %d", resp.StatusCode)
	}

	return nil
}
