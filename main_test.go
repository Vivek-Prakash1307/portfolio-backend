package main

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestHealthHandler(t *testing.T) {
	router := setupRouter()
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/api/health", nil)

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, recorder.Code)
	}
	if !strings.Contains(recorder.Body.String(), `"status":"healthy"`) {
		t.Fatalf("unexpected health response: %s", recorder.Body.String())
	}
}

func TestResumeHandlerReturnsCachedPayloadAndETag(t *testing.T) {
	router := setupRouter()
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/api/resume", nil)

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, recorder.Code)
	}
	if recorder.Header().Get("ETag") == "" {
		t.Fatal("expected ETag header")
	}
	if !strings.Contains(recorder.Header().Get("Cache-Control"), "max-age=300") {
		t.Fatalf("unexpected cache header: %s", recorder.Header().Get("Cache-Control"))
	}

	cachedRecorder := httptest.NewRecorder()
	cachedRequest := httptest.NewRequest(http.MethodGet, "/api/resume", nil)
	cachedRequest.Header.Set("If-None-Match", recorder.Header().Get("ETag"))

	router.ServeHTTP(cachedRecorder, cachedRequest)

	if cachedRecorder.Code != http.StatusNotModified {
		t.Fatalf("expected status %d, got %d", http.StatusNotModified, cachedRecorder.Code)
	}
}

func TestContactRejectsInvalidInput(t *testing.T) {
	router := setupRouter()
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(`{"name":"A","email":"bad","message":"short"}`))
	request.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, recorder.Code)
	}
}

func TestContactRejectsOversizedBody(t *testing.T) {
	router := setupRouter()
	recorder := httptest.NewRecorder()
	payload := bytes.Repeat([]byte("x"), maxContactBodySize+1)
	request := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusBadRequest && recorder.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("expected client error status, got %d", recorder.Code)
	}
}

func TestContactQueuesValidMessageImmediately(t *testing.T) {
	t.Setenv("RESEND_API_KEY", "test-key")
	t.Setenv("FROM_EMAIL", "portfolio@example.com")
	t.Setenv("TO_EMAIL", "owner@example.com")

	dispatcher := newEmailDispatcher(1, func(context.Context, EmailConfig, ContactMessage) error {
		return nil
	})
	router := gin.New()
	router.POST("/api/contact", limitBody(maxContactBodySize), handleContactForm(dispatcher))

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/contact",
		strings.NewReader(`{"name":"Vivek","email":"visitor@example.com","message":"This is a real portfolio message."}`),
	)
	request.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusAccepted {
		t.Fatalf("expected status %d, got %d: %s", http.StatusAccepted, recorder.Code, recorder.Body.String())
	}

	select {
	case job := <-dispatcher.queue:
		if job.message.Email != "visitor@example.com" {
			t.Fatalf("unexpected queued email: %+v", job.message)
		}
	default:
		t.Fatal("expected message to be queued")
	}
}

func TestContactRejectsWhenQueueIsFull(t *testing.T) {
	t.Setenv("RESEND_API_KEY", "test-key")
	t.Setenv("FROM_EMAIL", "portfolio@example.com")
	t.Setenv("TO_EMAIL", "owner@example.com")

	dispatcher := newEmailDispatcher(0, func(context.Context, EmailConfig, ContactMessage) error {
		return nil
	})
	router := gin.New()
	router.POST("/api/contact", limitBody(maxContactBodySize), handleContactForm(dispatcher))

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/contact",
		strings.NewReader(`{"name":"Vivek","email":"visitor@example.com","message":"This is a real portfolio message."}`),
	)
	request.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected status %d, got %d", http.StatusServiceUnavailable, recorder.Code)
	}
}

func TestContactRateLimit(t *testing.T) {
	limiter := newRateLimiter(2, 10_000_000_000)
	router := ginTestRouter(limiter.middleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	for i := 0; i < 2; i++ {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodPost, "/limited", nil)
		request.RemoteAddr = "192.0.2.1:12345"
		router.ServeHTTP(recorder, request)
		if recorder.Code != http.StatusOK {
			t.Fatalf("request %d expected status %d, got %d", i+1, http.StatusOK, recorder.Code)
		}
	}

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/limited", nil)
	request.RemoteAddr = "192.0.2.1:12345"
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusTooManyRequests {
		t.Fatalf("expected status %d, got %d", http.StatusTooManyRequests, recorder.Code)
	}
}

func ginTestRouter(middleware gin.HandlerFunc, handler gin.HandlerFunc) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/limited", middleware, handler)
	return router
}
