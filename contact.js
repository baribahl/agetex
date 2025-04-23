import { submitContactMessage, syncStatus } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Handle sync status changes
    syncStatus.onStatusChange(connected => {
        submitButton.disabled = !connected;
        
        if (connected) {
            submitButton.classList.remove('opacity-50');
        } else {
            submitButton.classList.add('opacity-50');
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!syncStatus.connected) {
            alert('Veuillez attendre la connexion au serveur');
            return;
        }
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi...';
            
            const message = await submitContactMessage(data);
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'mt-4 p-4 bg-green-100 text-green-700 rounded-md';
            successMsg.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>Message envoyé avec succès!</span>
                </div>
            `;
            form.appendChild(successMsg);
            
            // Reset form
            form.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting message:', error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded-md';
            errorMsg.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    <span>Une erreur est survenue. Veuillez réessayer.</span>
                </div>
            `;
            form.appendChild(errorMsg);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMsg.remove();
            }, 5000);
            
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <span class="flex items-center justify-center">
                    <i class="fas fa-paper-plane mr-2"></i>
                    <span>Envoyer le message</span>
                </span>
            `;
        }
    });
});
