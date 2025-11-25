package config

import (
	"os"
)

type Config struct {
	ClientKey    string
	ClientSecret string
	AccessToken  string
	VerifyToken  string
	Port         string
}

func LoadConfig() *Config {
	return &Config{
		ClientKey:    getEnv("CLIENT_KEY", ""),
		ClientSecret: getEnv("CLIENT_SECRET", ""),
		AccessToken:  getEnv("ACCESS_TOKEN", ""),
		VerifyToken:  getEnv("VERIFY_TOKEN", ""),
		Port:         getEnv("PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
