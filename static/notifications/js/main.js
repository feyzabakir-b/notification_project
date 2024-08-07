document.addEventListener("DOMContentLoaded", () => {
    const notificationsList = document.getElementById("notifications-list");
  
    // REST API'den bildirimleri al
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/", {
          headers: {
            // Burada aldığınız token'ı ekleyin
            Authorization: "Token a0807782e8dc5441862628f3284d6f8d31142d21",
          },
        });
  
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
  
        const data = await response.json();
        displayNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    // Bildirimleri listeleme fonksiyonu
    const displayNotifications = (notifications) => {
      notifications.forEach((notification) => {
        const li = document.createElement("li");
        li.textContent = notification.message;
        notificationsList.appendChild(li);
      });
    };
  
    // WebSocket bağlantısı kur
    const setupWebSocket = () => {
      const socket = new WebSocket("ws://localhost:8000/ws/notifications/");
  
      // WebSocket açıldığında çalışır
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      // WebSocket'ten mesaj alındığında çalışır
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const li = document.createElement("li");
        li.textContent = data.message;
        notificationsList.appendChild(li);
      };
  
      // WebSocket kapanırsa yeniden bağlanmayı dener
      socket.onclose = () => {
        console.log("WebSocket connection closed, retrying...");
        setTimeout(setupWebSocket, 3000); // 3 saniye sonra yeniden bağlan
      };
  
      // WebSocket hata aldığında çalışır
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };
  
    // Bildirimleri fetch ederek ve WebSocket kurarak başlat
    fetchNotifications();
    setupWebSocket();
  });
  