package tiktok

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"tiktok-messaging-poc/internal/config"
)

const MarketingBaseURL = "https://business-api.tiktok.com/open_api/v1.3"

type MarketingClient struct {
	Config *config.Config
	HTTP   *http.Client
}

func NewMarketingClient(cfg *config.Config) *MarketingClient {
	return &MarketingClient{
		Config: cfg,
		HTTP:   &http.Client{},
	}
}

type CampaignResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		List []struct {
			CampaignID   string  `json:"campaign_id"`
			CampaignName string  `json:"campaign_name"`
			Objective    string  `json:"objective"`
			Budget       float64 `json:"budget"`
			BudgetMode   string  `json:"budget_mode"`
		} `json:"list"`
		PageInfo struct {
			Page        int `json:"page"`
			PageSize    int `json:"page_size"`
			TotalNumber int `json:"total_number"`
			TotalPage   int `json:"total_page"`
		} `json:"page_info"`
	} `json:"data"`
}

func (c *MarketingClient) GetCampaigns(advertiserID string) (*CampaignResponse, error) {
	endpoint := fmt.Sprintf("%s/campaign/get/", MarketingBaseURL)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Add("advertiser_id", advertiserID)
	req.URL.RawQuery = q.Encode()

	req.Header.Set("Access-Token", c.Config.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result CampaignResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	if result.Code != 0 {
		return nil, fmt.Errorf("API error: %s (code: %d)", result.Message, result.Code)
	}

	return &result, nil
}

type ReportResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		List     []map[string]interface{} `json:"list"`
		PageInfo struct {
			Page        int `json:"page"`
			PageSize    int `json:"page_size"`
			TotalNumber int `json:"total_number"`
			TotalPage   int `json:"total_page"`
		} `json:"page_info"`
	} `json:"data"`
}

// GetReport fetches a basic report.
// reportType: "basic", "audience", etc.
// dimension: "campaign_id", "adgroup_id", etc.
func (c *MarketingClient) GetReport(advertiserID, reportType, dimension, startDate, endDate string) (*ReportResponse, error) {
	endpoint := fmt.Sprintf("%s/report/integrated/get/", MarketingBaseURL)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Add("advertiser_id", advertiserID)
	q.Add("report_type", reportType)
	q.Add("data_level", "AUCTION") // Defaulting to auction ads
	q.Add("dimensions", fmt.Sprintf("[\"%s\"]", dimension))
	q.Add("start_date", startDate)
	q.Add("end_date", endDate)
	q.Add("metrics", "[\"spend\", \"impressions\", \"clicks\", \"cpc\", \"cpm\", \"ctr\", \"conversion\"]") // Common metrics
	req.URL.RawQuery = q.Encode()

	req.Header.Set("Access-Token", c.Config.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result ReportResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	if result.Code != 0 {
		return nil, fmt.Errorf("API error: %s (code: %d)", result.Message, result.Code)
	}

	return &result, nil
}
