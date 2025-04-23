// Local replacement for Moneta YJS functionality

// Simple contact message store
export const contactMessages = {
    messages: [],
    addMessage(message) {
        this.messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(this.messages));
        return message;
    },
    loadMessages() {
        const stored = localStorage.getItem('contactMessages');
        if (stored) {
            this.messages = JSON.parse(stored);
        }
    }
};

// Simple settings store
export const settings = {
    data: {
        theme: {
            primary: '#2C3E50',
            accent: '#F39C12'
        }
    },
    get(key) {
        return this.data[key];
    },
    set(key, value) {
        this.data[key] = value;
        localStorage.setItem('settings', JSON.stringify(this.data));
    },
    loadSettings() {
        const stored = localStorage.getItem('settings');
        if (stored) {
            this.data = JSON.parse(stored);
        }
    }
};

// Initialize
contactMessages.loadMessages();
settings.loadSettings();

// Contact form functionality
export function submitContactMessage(data) {
    const message = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    return contactMessages.addMessage(message);
}

// Always connected in local mode
export const syncStatus = {
    connected: true,
    observers: new Set(),
    
    notify() {
        this.observers.forEach(callback => callback(this.connected));
    },
    
    onStatusChange(callback) {
        this.observers.add(callback);
        callback(this.connected);
        return () => this.observers.delete(callback);
    }
};
