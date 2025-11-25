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

type MessageContent struct {
	Type             string               `json:"type"`
	Text             string               `json:"text,omitempty"`
	Image            *ImageContent        `json:"image,omitempty"`
	Product          *ProductContent      `json:"product_card,omitempty"`
	Order            *OrderContent        `json:"order_card,omitempty"`
	Coupon           *CouponContent       `json:"coupon_card,omitempty"`
	ReturnRefundCard *ReturnRefundContent `json:"return_refund_card,omitempty"`
}

type ImageContent struct {
	URL string `json:"url"`
}

type ProductContent struct {
	ProductID string `json:"product_id"`
}

type OrderContent struct {
	OrderID string `json:"order_id"`
}

type CouponContent struct {
	CouponID string `json:"coupon_id"`
}

type ReturnRefundContent struct {
	ReturnRefundID string `json:"return_refund_id"`
}

type MessageRequest struct {
	BusinessID string `json:"business_id"`
	Recipient  struct {
		OpenID string `json:"open_id"`
	} `json:"recipient"`
	Message MessageContent `json:"message"`
}

func (c *Client) sendMessage(businessID, openID string, content MessageContent) error {
	reqBody := MessageRequest{
		BusinessID: businessID,
	}
	reqBody.Recipient.OpenID = openID
	reqBody.Message = content

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

func (c *Client) SendTextMessage(businessID, openID, text string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "text",
		Text: text,
	})
}

func (c *Client) SendImageMessage(businessID, openID, url string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "image",
		Image: &ImageContent{
			URL: url,
		},
	})
}

func (c *Client) SendProductMessage(businessID, openID, productID string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "product_card",
		Product: &ProductContent{
			ProductID: productID,
		},
	})
}

func (c *Client) SendOrderMessage(businessID, openID, orderID string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "order_card",
		Order: &OrderContent{
			OrderID: orderID,
		},
	})
}

func (c *Client) SendCouponMessage(businessID, openID, couponID string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "coupon_card",
		Coupon: &CouponContent{
			CouponID: couponID,
		},
	})
}

func (c *Client) SendReturnRefundMessage(businessID, openID, returnRefundID string) error {
	return c.sendMessage(businessID, openID, MessageContent{
		Type: "return_refund_card",
		ReturnRefundCard: &ReturnRefundContent{
			ReturnRefundID: returnRefundID,
		},
	})
}
