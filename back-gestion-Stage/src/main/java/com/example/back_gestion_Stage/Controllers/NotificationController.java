package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.NotificationDTO;
import com.example.back_gestion_Stage.Entities.Notification;
import com.example.back_gestion_Stage.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        List<NotificationDTO> notifications = notificationService.findAll();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<NotificationDTO> getNotificationByDocumentId(@PathVariable String documentId) {
        return notificationService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO savedNotification = notificationService.save(notificationDTO);
        return ResponseEntity.ok(savedNotification);
    }

    @PostMapping("/create")
    public ResponseEntity<NotificationDTO> createNewNotification(@RequestBody Map<String, String> notificationData) {
        String titre = notificationData.get("titre");
        String message = notificationData.get("message");
        String typeStr = notificationData.get("type");
        String compteUtilisateurDocumentId = notificationData.get("compteUtilisateurDocumentId");
        String documentIdReference = notificationData.get("documentIdReference");
        String typeReference = notificationData.get("typeReference");

        try {
            Notification.TypeNotification type = Notification.TypeNotification.valueOf(typeStr);
            NotificationDTO notification = notificationService.createNotification(
                titre, message, type, compteUtilisateurDocumentId, documentIdReference, typeReference);
            return ResponseEntity.ok(notification);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<NotificationDTO> updateNotification(@PathVariable String documentId, @RequestBody NotificationDTO notificationDTO) {
        if (!notificationService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        notificationDTO.setDocumentId(documentId);
        NotificationDTO updatedNotification = notificationService.save(notificationDTO);
        return ResponseEntity.ok(updatedNotification);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String documentId) {
        if (!notificationService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        notificationService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/compte/{compteUtilisateurDocumentId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByCompte(@PathVariable String compteUtilisateurDocumentId) {
        List<NotificationDTO> notifications = notificationService.findByCompteUtilisateurDocumentId(compteUtilisateurDocumentId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/compte/{compteUtilisateurDocumentId}/non-lues")
    public ResponseEntity<List<NotificationDTO>> getNotificationsNonLues(@PathVariable String compteUtilisateurDocumentId) {
        List<NotificationDTO> notifications = notificationService.findByCompteUtilisateurDocumentIdAndNonLues(compteUtilisateurDocumentId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByType(@PathVariable Notification.TypeNotification type) {
        List<NotificationDTO> notifications = notificationService.findByType(type);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{documentId}/marquer-lue")
    public ResponseEntity<NotificationDTO> marquerCommeLue(@PathVariable String documentId) {
        try {
            NotificationDTO updatedNotification = notificationService.marquerCommeLue(documentId);
            return ResponseEntity.ok(updatedNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/compte/{compteUtilisateurDocumentId}/marquer-toutes-lues")
    public ResponseEntity<Void> marquerToutesCommeLues(@PathVariable String compteUtilisateurDocumentId) {
        notificationService.marquerToutesCommeLues(compteUtilisateurDocumentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/compte/{compteUtilisateurDocumentId}/count-non-lues")
    public ResponseEntity<Long> countNotificationsNonLues(@PathVariable String compteUtilisateurDocumentId) {
        long count = notificationService.countNonLuesByCompteUtilisateurDocumentId(compteUtilisateurDocumentId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTotalCount() {
        long count = notificationService.countTotalNotifications();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/type/{type}/count")
    public ResponseEntity<Long> getCountByType(@PathVariable Notification.TypeNotification type) {
        long count = notificationService.countByType(type);
        return ResponseEntity.ok(count);
    }
}